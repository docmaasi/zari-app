"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Trash2,
  User,
  Heart,
  Target,
  Users,
  Star,
  Calendar,
  Search,
} from "lucide-react";

const categoryConfig: Record<
  string,
  { label: string; icon: typeof User; color: string }
> = {
  personal: { label: "Personal", icon: User, color: "text-blue-400" },
  interests: { label: "Interests", icon: Heart, color: "text-pink-400" },
  goals: { label: "Goals", icon: Target, color: "text-green-400" },
  relationships: { label: "Relationships", icon: Users, color: "text-purple-400" },
  preferences: { label: "Preferences", icon: Star, color: "text-yellow-400" },
  events: { label: "Events", icon: Calendar, color: "text-orange-400" },
};

export default function MemoriesPage() {
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  const memories = useQuery(
    api.memories.getMemories,
    convexUser ? { userId: convexUser._id } : "skip"
  );
  const deleteMemory = useMutation(api.memories.deleteMemory);
  const clearAll = useMutation(api.memories.clearAll);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!convexUser || memories === undefined) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#06060e]">
        <Brain className="w-8 h-8 text-zari-accent animate-pulse" />
      </div>
    );
  }

  const filtered = (memories || []).filter((m) => {
    const matchesSearch = search
      ? m.fact.toLowerCase().includes(search.toLowerCase()) ||
        (m.people || []).some((p) =>
          p.toLowerCase().includes(search.toLowerCase())
        )
      : true;
    const matchesCategory = activeCategory
      ? m.category === activeCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const grouped: Record<string, typeof filtered> = {};
  for (const mem of filtered) {
    if (!grouped[mem.category]) grouped[mem.category] = [];
    grouped[mem.category].push(mem);
  }

  const categories = Object.keys(categoryConfig);

  return (
    <div className="min-h-screen bg-[#06060e] font-mono">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-zari-muted hover:text-zari-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Chat</span>
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-zari-accent" />
            <span className="text-sm font-semibold text-zari-text">
              {memories?.length || 0} memories
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <h1 className="text-2xl font-bold text-zari-text mb-2">
            What Zari Knows About You
          </h1>
          <p className="text-sm text-zari-muted mb-8">
            Everything Zari has learned from your conversations. You can
            search, filter, or delete anything.
          </p>

          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-black/30 border border-white/5 mb-6">
            <Search className="w-4 h-4 text-zari-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search memories..."
              className="flex-1 bg-transparent text-sm text-zari-text placeholder:text-zari-muted/50 focus:outline-none"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !activeCategory
                  ? "bg-zari-accent text-white"
                  : "bg-black/20 text-zari-muted hover:text-zari-text"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const config = categoryConfig[cat];
              const count = (memories || []).filter(
                (m) => m.category === cat
              ).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? null : cat)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-zari-accent text-white"
                      : "bg-black/20 text-zari-muted hover:text-zari-text"
                  }`}
                >
                  {config.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Memory list */}
          {Object.entries(grouped).map(([category, mems]) => {
            const config = categoryConfig[category] || {
              label: category,
              icon: Brain,
              color: "text-zari-accent",
            };
            const Icon = config.icon;

            return (
              <div key={category} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <h2 className="text-sm font-semibold text-zari-text uppercase tracking-wider">
                    {config.label}
                  </h2>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {mems.map((mem) => (
                      <motion.div
                        key={mem._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex items-start justify-between gap-3 p-4 rounded-xl bg-zari-surface border border-white/5"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-zari-text">{mem.fact}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-zari-muted">
                            {mem.date && <span>{mem.date}</span>}
                            {mem.people && mem.people.length > 0 && (
                              <span>
                                People: {mem.people.join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            deleteMemory({
                              memoryId: mem._id as Id<"memories">,
                            })
                          }
                          className="p-1.5 rounded-lg text-zari-muted/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Brain className="w-12 h-12 text-zari-muted/20 mx-auto mb-4" />
              <p className="text-zari-muted">
                {search
                  ? "No memories match your search"
                  : "No memories yet. Start chatting with Zari!"}
              </p>
            </div>
          )}

          {/* Clear all */}
          {memories && memories.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              {confirmClear ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-400">
                    This will delete all {memories.length} memories. Are you
                    sure?
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        clearAll({ userId: convexUser._id });
                        setConfirmClear(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all"
                    >
                      Yes, Delete Everything
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-4 py-2 rounded-xl text-sm text-zari-muted hover:text-zari-text transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-xs text-zari-muted/40 hover:text-red-400 transition-colors"
                >
                  Clear all memories
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
