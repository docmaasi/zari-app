"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { OnboardingModal } from "@/components/chat/onboarding-modal";
import { Sparkles } from "lucide-react";

export default function ChatPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    if (convexUser && !convexUser.gender && !onboardingDone) {
      setShowOnboarding(true);
    }
  }, [convexUser, onboardingDone]);

  // Loading state
  if (!isLoaded || (clerkUser && convexUser === undefined)) {
    return (
      <div className="h-screen flex items-center justify-center bg-zari-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zari-accent to-purple-500 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm text-zari-muted">Loading Zari...</p>
        </div>
      </div>
    );
  }

  // No user in Convex yet (webhook hasn't fired)
  if (!convexUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-zari-bg">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-zari-accent to-purple-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-zari-text mb-2">
            Setting things up...
          </h2>
          <p className="text-sm text-zari-muted">
            Your account is being created. This usually takes a few seconds.
            Please refresh the page in a moment.
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
