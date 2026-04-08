import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const recordPurchase = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
    amount: v.number(),
    stripePurchaseId: v.string(),
  },
  handler: async (ctx, arg) => {
    const { userId, courseId, amount, stripePurchaseId } = arg;

    const purchaseId = await ctx.db.insert("purchase", {
      userId,
      courseId,
      amount,
      stripePurchaseId,
      purchaseDate: Date.now(),
    });

    return purchaseId;
  },
});
