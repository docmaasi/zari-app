"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

interface PushPermissionProps {
  userId: Id<"users">;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(Array.from(rawData).map((c) => c.charCodeAt(0)));
}

export function PushPermission({ userId }: PushPermissionProps) {
  const [show, setShow] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const subscribe = useMutation(api.pushSubscriptions.subscribe);

  useEffect(() => {
    // Only show if notifications are supported and not already granted/denied
    if (!("Notification" in window) || !("PushManager" in window)) return;
    if (Notification.permission !== "default") return;

    // Show after a delay so it doesn't overwhelm on first visit
    const dismissed = localStorage.getItem("zari-push-dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnable = async () => {
    setSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setShow(false);
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        setShow(false);
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const json = subscription.toJSON();
      await subscribe({
        userId,
        endpoint: json.endpoint!,
        p256dh: json.keys!.p256dh!,
        auth: json.keys!.auth!,
      });

      setShow(false);
    } catch {
      setShow(false);
    } finally {
      setSubscribing(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("zari-push-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto"
        >
          <div className="p-4 rounded-2xl bg-zari-surface border border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-zari-accent/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-zari-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zari-text mb-1">
                  Stay connected with Zari
                </p>
                <p className="text-xs text-zari-muted mb-3">
                  Get reminders and check-ins from Zari based on your
                  conversations.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEnable}
                    disabled={subscribing}
                    className="px-4 py-2 rounded-xl bg-zari-accent text-white text-xs font-semibold hover:bg-zari-accent/90 transition-all disabled:opacity-50"
                  >
                    {subscribing ? "Enabling..." : "Enable Notifications"}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-zari-muted hover:text-zari-text transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg text-zari-muted/40 hover:text-zari-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
