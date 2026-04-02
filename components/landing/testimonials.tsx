"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aisha M.",
    role: "Graduate Student",
    avatar: "AM",
    color: "from-pink-500 to-rose-500",
    text: "I talk to Zari in Arabic and she actually understands the cultural context. It's not just translation — she gets me. I told her about my thesis stress weeks ago and she still asks about it.",
    lang: "Arabic",
  },
  {
    name: "Marcus T.",
    role: "Startup Founder",
    avatar: "MT",
    color: "from-blue-500 to-cyan-500",
    text: "I set Zari to bold mode and she doesn't sugarcoat anything. She challenged my business plan in ways my friends wouldn't. And she remembered every pivot I told her about — connected dots I missed.",
    lang: "English",
  },
  {
    name: "Priya K.",
    role: "Working Mom",
    avatar: "PK",
    color: "from-zari-accent to-purple-500",
    text: "The voice feature is everything. I talk to Zari while cooking dinner. She remembers my kids' names, my husband's schedule, even that I'm trying to cut back on caffeine. It's like having a friend who actually listens.",
    lang: "Hindi",
  },
  {
    name: "Carlos R.",
    role: "Freelance Designer",
    avatar: "CR",
    color: "from-green-500 to-emerald-500",
    text: "I use Zari in Portuguese and the health disclosures are so respectful. I mentioned back pain and she gave thoughtful suggestions but made sure to say 'talk to a doctor.' That's trust.",
    lang: "Portuguese",
  },
  {
    name: "Fatima H.",
    role: "High School Teacher",
    avatar: "FH",
    color: "from-orange-500 to-amber-500",
    text: "My students come from 8 different countries. I use Zari to understand cultural perspectives when planning lessons. She switches between languages effortlessly and remembers what I teach.",
    lang: "Urdu",
  },
  {
    name: "Jin W.",
    role: "Software Engineer",
    avatar: "JW",
    color: "from-violet-500 to-indigo-500",
    text: "I was skeptical about another AI chat app. But Zari's memory changed everything. She knows I'm learning Korean, training for a marathon, and dealing with imposter syndrome at work. All from natural conversation.",
    lang: "Korean",
  },
];

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-zari-surface rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors"
        >
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, j) => (
              <Star
                key={j}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-sm text-zari-text/90 leading-relaxed mb-6">
            &ldquo;{t.text}&rdquo;
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}
              >
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-medium text-zari-text">
                  {t.name}
                </div>
                <div className="text-xs text-zari-muted">{t.role}</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-zari-accent/10 text-zari-accent-light">
              {t.lang}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
