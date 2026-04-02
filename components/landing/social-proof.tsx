"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Brain, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Active Users",
  },
  {
    icon: MessageSquare,
    value: "1M+",
    label: "Messages Sent",
  },
  {
    icon: Brain,
    value: "500K+",
    label: "Memories Saved",
  },
  {
    icon: Globe,
    value: "16",
    label: "Languages",
  },
];

export function SocialProof() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="text-center"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-zari-accent/10 flex items-center justify-center">
            <stat.icon className="w-6 h-6 text-zari-accent-light" />
          </div>
          <div className="text-3xl font-bold text-zari-text mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-zari-muted">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
