import { Subscription } from "./../node_modules/stripe/esm/resources/Subscriptions.d";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
    username: v.string(),
    stripeCustomerId: v.string(),
    currentSubscriptionId: v.optional(v.id("subscriptions")),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  courses: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    price: v.number(),
  }),

  purchase: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    amount: v.number(),
    purchaseDate: v.number(),
    stripePurchaseId: v.string(),
  }).index("by_userId_and_courseId", ["userId", "courseId"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    planType: v.union(v.literal("month"), v.literal("year")),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    status: v.string(),
    stripeSubscriptionId: v.string(),
    cancelPeriodEnd: v.boolean(),
  }).index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),
});
