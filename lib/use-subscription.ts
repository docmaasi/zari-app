"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSubscription() {
  const { userId } = useAuth();

  const subscription = useQuery(
    api.subscriptions.getSubscription,
    userId ? { clerkId: userId } : "skip"
  );

  const isPlusUser = subscription?.status === "active";
  const plan = subscription?.plan || "free";

  return {
    isPlusUser,
    plan,
    status: subscription?.status || "free",
    expiresAt: subscription?.expiresAt,
    isLoading: subscription === undefined,
  };
}
