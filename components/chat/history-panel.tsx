"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { X, MessageSquare, Search, Clock } from "lucide-react";

interface HistoryPanelProps {
  userId: Id<"users">;
  activeConversationId?: Id<"conversations">;
  onSelect: (conversationId: Id<"conversations">) => void;
  onClose: () => void;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function HistoryPanel({
  userId,
  activeConversationId,
  onSelect,
  onClose,
}: HistoryPanelProps) {
  const [search, setSearch] = useState("");
  const conversations = useQuery(api.messages.getAllConversations, { userId });

  const filtered = (conversations || []).filter((c) =>
    search
      ? c.title.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="fixed inset-y-0 left-0 w-full max-w-md bg-zari-surface border-r border-white/5 z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-zari-accent" />
          <h2 className="font-semibold text-zari-text">Conversations</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5 text-zari-muted" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/5">
          <Search className="w-4 h-4 text-zari-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-sm text-zari-text placeholder:text-zari-muted/50 focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <MessageSquare className="w-8 h-8 text-zari-muted/30 mx-auto mb-3" />
            <p className="text-sm text-zari-muted">
              {search ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        )}

        {filtered.map((conv) => (
          <button
            key={conv._id}
            onClick={() => {
              onSelect(conv._id);
              onClose();
            }}
            className={`w-full text-left px-4 py-4 border-b border-white/5 transition-all hover:bg-white/5 ${
              activeConversationId === conv._id
                ? "bg-zari-accent/10 border-l-2 border-l-zari-accent"
                : ""
            }`}
          >
            <p className="text-sm font-medium text-zari-text truncate mb-1">
              {conv.title}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-zari-muted">
              <Clock className="w-3 h-3" />
              {timeAgo(conv.lastMessageAt)}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
