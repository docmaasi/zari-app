import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnerByClerkId, assertOwnerByUserId } from "./security";

const TRIAL_DAYS = 7;

// Called only from the Clerk webhook (signature-verified) and from authenticated
// API routes — does not assert identity match because Clerk webhook has no JWT.
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    // New signup: grant a 7-day Plus trial automatically so users can taste
    // memory, all 16 languages, premium voices, journal etc. before paying.
    const trialEndsAt = Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000;

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
      trialEndsAt,
    });
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    await assertOwnerByClerkId(ctx, args.clerkId);
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const updatePreferences = mutation({
  args: {
    userId: v.id("users"),
    // `personality` is the canonical field. `gender` is accepted for backwards
    // compat — if only gender is passed, we write both so reads stay consistent.
    personality: v.optional(v.string()),
    gender: v.optional(v.string()),
    language: v.optional(v.string()),
    mood: v.optional(v.string()),
    voiceEnabled: v.optional(v.boolean()),
    voiceId: v.optional(v.string()),
    orbColor: v.optional(v.string()),
    name: v.optional(v.string()),
    namePronunciation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const { userId, ...updates } = args;

    // Sync personality + gender so legacy reads still resolve.
    if (updates.personality && !updates.gender) {
      updates.gender = updates.personality;
    } else if (updates.gender && !updates.personality) {
      updates.personality = updates.gender;
    }

    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(userId, filtered);
  },
});

export const confirmAge = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    await ctx.db.patch(args.userId, { ageConfirmedAt: Date.now() });
  },
});

// Account deletion — removes all user-owned data. Idempotent.
// Called from /api/account/delete after Clerk user is destroyed.
export const deleteAccount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);

    const tables = [
      "memories",
      "conversations",
      "messages",
      "moodHistory",
      "voiceNotes",
      "reminders",
      "pushSubscriptions",
      "streaks",
      "referrals",
      "voiceUsage",
      "zariJournal",
    ] as const;

    for (const table of tables) {
      const rows = await ctx.db
        .query(table)
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
    }

    await ctx.db.delete(args.userId);
  },
});
