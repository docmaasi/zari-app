"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import {
  X,
  Trash2,
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  Brain,
  Heart,
  Target,
  Star,
  Tag,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface MemoryPanelProps {
  userId: Id<"users">;
  onClose: () => void;
}

const categoryIcons: Record<string, typeof Brain> = {
  personal: Heart,
  interests: Star,
  goals: Target,
  relationships: Users,
  preferences: Tag,
  events: Calendar,
};

const categoryColors: Record<string, string> = {
  events: "text-orange-400 bg-orange-400/10",
  personal: "text-pink-400 bg-pink-400/10",
  interests: "text-yellow-400 bg-yellow-400/10",
  goals: "text-green-400 bg-green-400/10",
  relationships: "text-blue-400 bg-blue-400/10",
  preferences: "text-purple-400 bg-purple-400/10",
};

export function MemoryPanel({ userId, onClose }: MemoryPanelProps) {
  const memories = useQuery(api.memories.getMemories, { userId });
  const deleteMemory = useMutation(api.memories.deleteMemory);
  const clearAll = useMutation(api.memories.clearAll);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const grouped = (memories || []).reduce(
    (acc, m) => {
      const cat = m.category || "personal";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(m);
      return acc;
    },
    {} as Record<string, typeof memories>
  );

  // Events first
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    if (a === "events") return -1;
    if (b === "events") return 1;
    return a.localeCompare(b);
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-zari-surface border-l border-white/5 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-zari-accent" />
          <h2 className="font-semibold text-zari-text">
            Memories ({memories?.length || 0})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {memories && memories.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-400/10 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-zari-muted" />
          </button>
        </div>
      </div>

      {/* Clear confirmation */}
      {showClearConfirm && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-300">
              Delete all memories?
            </span>
          </div>
          <p className="text-xs text-zari-muted mb-3">
            This cannot be undone. Zari will forget everything about you.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 py-2 rounded-lg border border-white/10 text-xs text-zari-muted"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await clearAll({ userId });
                setShowClearConfirm(false);
              }}
              className="flex-1 py-2 rounded-lg bg-red-500/20 text-xs text-red-300"
            >
              Delete All
            </button>
          </div>
        </div>
      )}

      {/* Memories list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sortedCategories.map((category) => {
          const Icon = categoryIcons[category] || Zap;
          const colorClass =
            categoryColors[category] || "text-gray-400 bg-gray-400/10";

          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1 rounded-md ${colorClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zari-muted">
                  {category} ({grouped[category]?.length})
                </span>
              </div>
              <div className="space-y-2">
                {grouped[category]?.map((memory) => (
                  <div
                    key={memory._id}
                    className="group bg-zari-surface2 rounded-xl p-3 border border-white/5"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm text-zari-text leading-relaxed">
                        {memory.fact}
                      </p>
                      <button
                        onClick={() =>
                          deleteMemory({ memoryId: memory._id })
                        }
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {memory.date && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-zari-muted">
                          <Calendar className="w-3 h-3" />
                          {memory.dayOfWeek} {memory.date}
                        </span>
                      )}
                      {memory.time && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-zari-muted">
                          <Clock className="w-3 h-3" />
                          {memory.time}
                        </span>
                      )}
                      {memory.people &&
                        memory.people.map((person) => (
                          <span
                            key={person}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-zari-accent/10 text-[10px] text-zari-accent-light"
                          >
                            <Users className="w-3 h-3" />
                            {person}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {(!memories || memories.length === 0) && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 mx-auto text-zari-muted/30 mb-4" />
            <p className="text-sm text-zari-muted">No memories yet</p>
            <p className="text-xs text-zari-muted/60 mt-1">
              Zari will remember things as you talk
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
