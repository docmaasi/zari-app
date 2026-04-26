import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnerByUserId, assertOwnerOfRecord } from "./security";

export const create = mutation({
  args: {
    userId: v.id("users"),
    text: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    return await ctx.db.insert("voiceNotes", {
      userId: args.userId,
      text: args.text,
      type: args.type,
      listened: false,
      createdAt: Date.now(),
    });
  },
});

export const getUnlistened = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    return await ctx.db
      .query("voiceNotes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("listened"), false))
      .order("desc")
      .take(10);
  },
});

export const getAll = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    return await ctx.db
      .query("voiceNotes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);
  },
});

export const markListened = mutation({
  args: { noteId: v.id("voiceNotes") },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId);
    await assertOwnerOfRecord(ctx, note);
    await ctx.db.patch(args.noteId, { listened: true });
  },
});
