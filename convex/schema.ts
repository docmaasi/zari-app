import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    gender: v.optional(v.string()),
    language: v.optional(v.string()),
    mood: v.optional(v.string()),
    voiceEnabled: v.optional(v.boolean()),
    voiceId: v.optional(v.string()), // ElevenLabs voice ID
    namePronunciation: v.optional(v.string()), // Phonetic spelling for TTS
    orbColor: v.optional(v.string()), // Custom orb color
    createdAt: v.number(),
    // Subscription fields
    stripeCustomerId: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()), // "active", "canceled", "past_due", "free"
    plan: v.optional(v.string()), // "free", "plus_monthly", "plus_yearly"
    planExpiresAt: v.optional(v.number()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_stripe_customer", ["stripeCustomerId"]),

  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    startedAt: v.number(),
    lastMessageAt: v.number(),
  }).index("by_user", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"]),

  memories: defineTable({
    userId: v.id("users"),
    category: v.string(),
    fact: v.string(),
    people: v.optional(v.array(v.string())),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    dayOfWeek: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_category", ["userId", "category"]),

  referrals: defineTable({
    referrerId: v.id("users"),
    referralCode: v.string(),
    referredUserId: v.optional(v.id("users")),
    status: v.string(), // "pending", "signed_up", "rewarded"
    createdAt: v.number(),
  })
    .index("by_referrer", ["referrerId"])
    .index("by_code", ["referralCode"]),

  streaks: defineTable({
    userId: v.id("users"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.string(), // "2026-04-02"
    totalDaysActive: v.number(),
    firstChatDate: v.string(),
    totalMessages: v.number(),
  }).index("by_user", ["userId"]),

  pushSubscriptions: defineTable({
    userId: v.id("users"),
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  voiceUsage: defineTable({
    userId: v.id("users"),
    date: v.string(), // "2026-04-02"
    count: v.number(),
  })
    .index("by_user_date", ["userId", "date"]),
});
