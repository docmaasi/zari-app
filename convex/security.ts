import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id, Doc } from "./_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

/**
 * Enforce that the authenticated caller owns the user record at `userId`.
 *
 * If JWT identity is present (Clerk-Convex integration active) and does NOT
 * match the record owner, throw. If identity is absent, fall back to legacy
 * arg-trust mode — the API route layer is expected to have authenticated the
 * caller via Clerk auth() before reaching here. Direct browser calls without
 * JWT will be rejected once the Clerk JWT template is configured.
 */
export async function assertOwnerByUserId(
  ctx: Ctx,
  userId: Id<"users">
): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return;
  const user = await ctx.db.get(userId);
  if (!user || user.clerkId !== identity.subject) {
    throw new Error("Forbidden");
  }
}

/**
 * Enforce that the authenticated caller's Clerk subject matches the given clerkId.
 */
export async function assertOwnerByClerkId(
  ctx: Ctx,
  clerkId: string
): Promise<void> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return;
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
