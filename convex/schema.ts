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
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

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
  }).index("by_conversation", ["conversationId"]),

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
});
