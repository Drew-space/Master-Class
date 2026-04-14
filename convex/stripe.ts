import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import stripe from "../lib/stripe";

import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

const rateLimiter = new RateLimiter(components.rateLimiter, {
  createCheckoutSession: { kind: "fixed window", rate: 3, period: MINUTE },
});

const subscriptionRateLimter = new RateLimiter(components.rateLimiter, {
  createProPlanCheckoutSession: {
    kind: "fixed window",
    rate: 3,
    period: MINUTE,
  },
});

export const createCheckoutSession = action({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args): Promise<{ checkoutUrl: string | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    });

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Todo: implement rate limiting

    const { ok } = await rateLimiter.limit(ctx, "createCheckoutSession", {
      key: user._id,
      throws: false,
    });

    if (!ok) {
      throw new ConvexError(
        "Too many  attempts. Please wait try again later .",
      );
    }

    const course = await ctx.runQuery(api.courses.getCourseById, {
      courseId: args.courseId,
    });

    if (!course) {
      throw new ConvexError("Course not found");
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              images: [course.imageUrl],
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],

      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${args.courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses`,

      metadata: {
        courseId: args.courseId,
        userId: user._id,
      },
    });

    return { checkoutUrl: session.url };
  },
});

// adroit-cheer-lawful-fast

export const createProPlanCheckoutSession = action({
  args: { planId: v.union(v.literal("month"), v.literal("year")) },
  handler: async (ctx, agrs): Promise<{ checkoutUrl: string | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    });

    if (!user) {
      throw new ConvexError("User not found");
    }

    // todo:handle rate limiting
    const { ok } = await subscriptionRateLimter.limit(
      ctx,
      "createProPlanCheckoutSession",
      {
        key: user._id,
        throws: false,
      },
    );

    if (!ok) {
      throw new ConvexError(
        "Too many  attempts. Please wait try again later .",
      );
    }

    let priceId;
    if (agrs.planId === "month") {
      priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
    } else if (agrs.planId === "year") {
      priceId = process.env.STRIPE_YEARLY_PRICE_ID;
    }

    if (!priceId) {
      throw new ConvexError("PriceId not provided");
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro/sucess?session_id={CHECKOUT_SESSION_ID}&year=${agrs.planId === "year"}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pro`,

      metadata: { userId: user._id, planId: agrs.planId },
    });

    return { checkoutUrl: session.url };
  },
});
