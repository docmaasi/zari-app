"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

const tabs = [
  {
    label: "Life Advice",
    messages: [
      {
        role: "user",
        text: "Zari, I got into a huge fight with Allen today. He said I don't contribute enough because my paycheck is smaller than his. It really hurt.",
      },
      {
        role: "assistant",
        text: "That sounds really painful, and I'm sorry you're going through that. Your worth isn't measured by the size of a paycheck — contributions to a relationship go way beyond money. Have you two talked about what \"contributing\" really means to each of you? Sometimes these fights aren't really about money... they're about feeling valued.",
      },
      {
        role: "user",
        text: "No, he just stormed off. I don't even know how to bring it up again.",
      },
      {
        role: "assistant",
        text: "Give it a little breathing room — maybe tomorrow when things are calmer. You could start with how it made you feel instead of what he said. Something like \"When you said that, I felt like my efforts don't matter to you.\" That opens a door instead of putting up a wall. You deserve to be heard.",
      },
    ],
  },
  {
    label: "Motivation",
    messages: [
      {
        role: "user",
        text: "I've been procrastinating on my business idea for months. I just can't seem to start.",
      },
      {
        role: "assistant",
        text: "You know what's interesting? The fact that it's been months and you're still thinking about it tells me this idea matters to you. Most people let go of ideas they don't care about. So the passion is there — it's the starting that feels overwhelming. What if you didn't try to launch a business today... what if you just wrote down the one thing your business would solve?",
      },
      {
        role: "user",
        text: "I guess I'm scared it won't work and I'll look stupid.",
      },
      {
        role: "assistant",
        text: "That fear? Every single person who ever built something felt it. The difference between them and the people who didn't build anything isn't talent or luck — it's that they started scared. You don't need to be fearless. You just need to take one small step while afraid. What's the smallest possible version of your idea you could test this week?",
      },
    ],
  },
  {
    label: "Health",
    messages: [
      {
        role: "user",
        text: "I've been getting these headaches every afternoon around 3pm. What do you think it could be?",
      },
      {
        role: "assistant",
        text: "Afternoon headaches around the same time can be connected to a few things — dehydration, screen fatigue, blood sugar dips, or tension from posture. Are you drinking enough water throughout the day? And how long are your screen stretches without breaks?",
        disclosure: "health",
      },
      {
        role: "user",
        text: "Honestly, I probably drink like 2 glasses of water all day and I'm on my laptop non-stop.",
      },
      {
        role: "assistant",
        text: "There you go — that's likely a big part of it. Try this: set a reminder to drink a glass of water every hour, and do the 20-20-20 rule — every 20 minutes, look at something 20 feet away for 20 seconds. Give it a week and see if the pattern changes. If the headaches persist or get worse, definitely see a doctor — persistent headaches deserve professional attention.",
        disclosure: "health",
      },
    ],
  },
];

const disclosureLabels: Record<string, { label: string; color: string }> = {
  health: { label: "Health Disclosure", color: "bg-red-500/20 text-red-300" },
  finance: {
    label: "Finance Disclosure",
    color: "bg-green-500/20 text-green-300",
  },
  legal: { label: "Legal Disclosure", color: "bg-blue-500/20 text-blue-300" },
};

export function DemoChat() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === i
                ? "bg-zari-accent text-white"
                : "bg-zari-surface text-zari-muted hover:text-zari-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="bg-zari-surface rounded-2xl border border-white/5 p-6 space-y-4 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {tabs[activeTab].messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-zari-accent/20 text-zari-text"
                      : "bg-zari-surface2 text-zari-text"
                  }`}
                >
                  {msg.text}
                  {"disclosure" in msg && msg.disclosure && (
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${disclosureLabels[msg.disclosure].color}`}
                      >
                        <Shield className="w-3 h-3" />
                        {disclosureLabels[msg.disclosure].label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
