"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { OnboardingModal } from "@/components/chat/onboarding-modal";
import { ZariOrb } from "@/components/chat/zari-orb";

export default function ChatPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  const upsertUser = useMutation(api.users.upsertUser);
  const creatingRef = useRef(false);
  const [loadTimeout, setLoadTimeout] = useState(false);

  // Show error after 15 seconds of loading
  useEffect(() => {
    const timer = setTimeout(() => setLoadTimeout(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-create user in Convex if they don't exist yet
  useEffect(() => {
    if (
      isLoaded &&
      clerkUser &&
      convexUser === null &&
      !creatingRef.current
    ) {
      creatingRef.current = true;
      const name =
        [clerkUser.firstName, clerkUser.lastName]
          .filter(Boolean)
          .join(" ") || "User";
      const email =
        clerkUser.emailAddresses?.[0]?.emailAddress || "";

      upsertUser({
        clerkId: clerkUser.id,
        name,
        email,
        imageUrl: clerkUser.imageUrl,
      }).catch(() => {
        creatingRef.current = false;
      });
    }
  }, [isLoaded, clerkUser, convexUser, upsertUser]);

  // Loading — waiting for Clerk or Convex
  if (!isLoaded || !clerkUser || !convexUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#06060e]">
        <div className="flex flex-col items-center gap-4">
          <ZariOrb emotion="thinking" gender="neutral" size={64} />
          <p className="text-sm text-zari-muted font-mono">
            {loadTimeout ? "Taking longer than usual..." : "Loading Zari..."}
          </p>
          {loadTimeout && (
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-zari-accent hover:text-zari-accent-light transition-colors"
            >
              Tap to retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Onboarding — gender not set means they haven't completed setup
  if (!convexUser.gender) {
    return (
      <OnboardingModal
        userId={convexUser._id}
        userName={convexUser.name}
        onComplete={() => {
          window.location.reload();
        }}
      />
    );
  }

  // Chat
  return (
    <ChatInterface
      user={{
        _id: convexUser._id,
        name: convexUser.name,
        gender: convexUser.gender,
        language: convexUser.language,
        voiceEnabled: convexUser.voiceEnabled,
        voiceId: convexUser.voiceId,
        namePronunciation: convexUser.namePronunciation,
        mood: convexUser.mood,
      }}
    />
  );
}
