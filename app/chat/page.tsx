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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const creatingRef = useRef(false);

  // Auto-create user in Convex if webhook hasn't fired
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

  useEffect(() => {
    if (convexUser && !convexUser.gender && !onboardingDone) {
      setShowOnboarding(true);
    }
  }, [convexUser, onboardingDone]);

  // Loading state
  if (!isLoaded || (clerkUser && convexUser === undefined)) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#06060e]">
        <div className="flex flex-col items-center gap-4">
          <ZariOrb emotion="thinking" gender="neutral" size={64} />
          <p className="text-sm text-zari-muted font-mono">Loading Zari...</p>
        </div>
      </div>
    );
  }

  // Still waiting for user creation (should be very brief now)
  if (!convexUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#06060e]">
        <div className="flex flex-col items-center gap-4">
          <ZariOrb emotion="thinking" gender="neutral" size={64} />
          <p className="text-sm text-zari-muted font-mono">
            Setting up your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          userId={convexUser._id}
          userName={convexUser.name}
          onComplete={() => {
            setShowOnboarding(false);
            setOnboardingDone(true);
            window.location.reload();
          }}
        />
      )}
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
    </>
  );
}
