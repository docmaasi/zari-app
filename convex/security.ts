import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id, Doc } from "./_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

/**
 * Enforce that the authenticated caller owns the user record at `userId`.
 * Strict mode: requires a Clerk JWT identity. Throws on missing identity
 * or owner mismatch. API routes must call Convex via getAuthenticatedConvex()
 * so the request carries a Clerk JWT.
 */
export async function assertOwnerByUserId(
  ctx: Ctx,
  userId: Id<"users">
): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  const user = await ctx.db.get(userId);
  if (!user || user.clerkId !== identity.subject) {
    throw new Error("Forbidden");
  }
}

/**
 * Strict: caller's JWT subject must equal clerkId.
 */
export async function assertOwnerByClerkId(
  ctx: Ctx,
  clerkId: string
): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");
  if (identity.subject !== clerkId) {
    throw new Error("Forbidden");
  }
}

/**
 * For mutations that operate on a record by its own ID (e.g. memoryId,
 * reminderId, voiceNoteId): load it, then enforce ownership of its `userId`.
 */
export async function assertOwnerOfRecord<T extends { userId: Id<"users"> }>(
  ctx: Ctx,
  record: T | null
): Promise<void> {
  if (!record) throw new Error("Not found");
  await assertOwnerByUserId(ctx, record.userId);
}

/**
 * Convenience: load a record by id and assert ownership in one step.
 * Returns the record (typed) so the caller doesn't have to re-fetch.
 */
export async function loadOwnedRecord<TableName extends "memories" | "reminders" | "voiceNotes" | "conversations" | "moodHistory" | "pushSubscriptions" | "streaks">(
  ctx: Ctx,
  id: Id<TableName>
): Promise<Doc<TableName>> {
  const record = await ctx.db.get(id);
  if (!record) throw new Error("Not found");
  await assertOwnerByUserId(ctx, (record as unknown as { userId: Id<"users"> }).userId);
  return record as Doc<TableName>;
}
