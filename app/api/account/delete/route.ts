import { auth, clerkClient } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { getAuthenticatedConvex } from "@/lib/convex-server";

// Permanently delete the user — Convex records first (memories, conversations,
// messages, streaks, etc), then the Clerk identity. Idempotent: if either side
// is already gone, we still return 200.
export async function POST() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const convex = await getAuthenticatedConvex();
    if (!convex) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (user) {
      await convex.mutation(api.users.deleteAccount, { userId: user._id });
    }

    try {
      const client = await clerkClient();
      await client.users.deleteUser(clerkId);
    } catch (err) {
      // If Clerk delete fails (already deleted, network), the Convex data is
      // gone — user can still sign out manually. Log but don't fail the request.
      console.error("Clerk user delete failed:", err);
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Account delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
