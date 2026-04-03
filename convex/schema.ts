import { Subscription } from "./../node_modules/stripe/esm/resources/Subscriptions.d";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { title } from "process";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
    username: v.string(),
    stripeCustomerId: v.string(),
    currentSubscriptionId: v.optional(v.id("subscriptions")),
  }).index("by_clerkId", ["clerkId"]),

  courses: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    price: v.number(),
  }),

  purchase: defineTable({
    userId: v.id("user"),
    courseId: v.id("courses"),
    amount: v.number(),
    purchaseDate: v.number(),
    stripePurchasedId: v.string(),
  }).index("by_userId_and_courseId", ["userId", "courseId"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    planType: v.union(v.literal("month"), v.literal("year")),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    stripeSubscriptionId: v.string(),
    cancelPeriodEnd: v.boolean(),
  }).index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),
});
