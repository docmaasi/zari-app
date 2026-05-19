"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { OnboardingModal } from "@/components/chat/onboarding-modal";
import { AgeGate } from "@/components/safety/age-gate";
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

  useEffect(() => {
    const timer = setTimeout(() => setLoadTimeout(true), 15000);
    return () => clearTimeout(timer);
  }, []);

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

  if (!isLoaded || !clerkUser || !convexUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0b0b12]">
        <div className="flex flex-col items-center gap-4">
          <ZariOrb emotion="thinking" size={64} />
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

  // Age gate first — required before onboarding or chat.
  if (!convexUser.ageConfirmedAt) {
    return (
      <AgeGate
        userId={convexUser._id}
        onConfirm={() => window.location.reload()}
      />
    );
  }

  // Onboarding — accept either personality (new field) or gender (legacy)
  const userPersonality = convexUser.personality || convexUser.gender;
  if (!userPersonality) {
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

  return (
    <ChatInterface
      user={{
        _id: convexUser._id,
        name: convexUser.name,
        personality: userPersonality,
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
