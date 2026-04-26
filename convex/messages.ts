import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnerByUserId, assertOwnerOfRecord } from "./security";

export const createConversation = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const now = Date.now();
    return await ctx.db.insert("conversations", {
      userId: args.userId,
      title: args.title,
      startedAt: now,
      lastMessageAt: now,
    });
  },
});

export const getActiveConversation = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
    return conversations;
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify caller owns the conversation AND the userId arg matches the
    // conversation's owner — defense-in-depth.
    const conv = await ctx.db.get(args.conversationId);
    await assertOwnerOfRecord(ctx, conv);
    if (conv && conv.userId !== args.userId) {
      throw new Error("Forbidden");
    }
    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      userId: args.userId,
      role: args.role,
      content: args.content,
      createdAt: now,
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
    });

    return messageId;
  },
});

export const getAllConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    return await ctx.db
      .query("conversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const verifyOwnership = query({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const conv = await ctx.db.get(args.conversationId);
    return conv !== null && conv.userId === args.userId;
  },
});

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const conv = await ctx.db.get(args.conversationId);
    await assertOwnerOfRecord(ctx, conv);
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const getRecentMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const conv = await ctx.db.get(args.conversationId);
    await assertOwnerOfRecord(ctx, conv);
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .take(30);
    return messages.reverse();
  },
});
