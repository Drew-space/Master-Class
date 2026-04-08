// adroit - cheer - lawful - fast;

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import stripe from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import Stripe from "stripe";
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }
  } catch (error) {
    console.log(`⚠️  Error handling webhook event.`, (error as Error).message);
    return new Response("Error handling webhook event", {
      status: 500,
    });
  }

  return new Response("Webhook received", { status: 200 });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const courseId = session.metadata?.courseId;
  const stripeCustomerId = session.customer as string;

  if (!courseId || !stripeCustomerId) {
    throw new Error(
      `⚠️  Missing courseId or stripeCustomerId in session metadata.`,
    );
    return;
  }

  const user = await convex.query(api.users.getUserByStripeCustomerId, {
    stripeCustomerId,
  });

  if (!user) {
    throw new Error("⚠️  No user found with stripeCustomerId ");
  }

  await convex.mutation(api.purchase.recordPurchase, {
    userId: user._id,
    courseId: courseId as Id<"courses">,
    amount: session.amount_total as number,
    stripePurchaseId: session.id,
  });

  //   todo: send email to user about purchase
}
