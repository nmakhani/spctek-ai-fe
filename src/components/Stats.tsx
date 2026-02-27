"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "87%", label: "First-appeal success rate", color: "#06b6d4" },
  { value: "$14.2K", label: "Average recovery per case", color: "#34d399" },
  { value: "24–48hr", label: "Case generation time", color: "#a78bfa" },
  { value: "1,200+", label: "Cases resolved", color: "#fbbf24" },
];

export default function Stats() {
  return (
    <section id="about" className="py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex pill mb-6 text-[11px]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
            By the Numbers
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5"
          >
            Results that{" "}
            <span className="gradient-text">speak for themselves</span>
          </motion.h2>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 sm:p-8 text-center group"
            >
              {/* Top highlight line */}
              <div
                className="w-8 h-0.5 rounded-full mx-auto mb-5 opacity-60 group-hover:opacity-100 group-hover:w-12 transition-all duration-500"
                style={{ background: s.color }}
              />
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 tracking-tight"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-snug">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
