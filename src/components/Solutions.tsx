"use client";

import { motion } from "framer-motion";

const solutions = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
    tagLabel: "Revenue Recovery",
    tagBg: "rgba(6,182,212,0.08)",
    tagBorder: "rgba(6,182,212,0.2)",
    tagColor: "#22d3ee",
    title: "Reinstatement Estimator",
    description:
      "Automatically calculate and recover lost Amazon marketplace revenue from reinstatement claims.",
    features: [
      "Automated claim analysis",
      "Revenue impact projection",
      "Step-by-step case builder",
    ],
    iconBg: "rgba(6,182,212,0.08)",
    iconColor: "#06b6d4",
    hoverGlow: "rgba(6,182,212,0.06)",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
    tagLabel: "Private AI",
    tagBg: "rgba(124,58,237,0.08)",
    tagBorder: "rgba(124,58,237,0.2)",
    tagColor: "#a78bfa",
    title: "Local AI Deployment",
    description:
      "Run powerful LLMs on your own infrastructure. No cloud dependencies, no data exposure.",
    features: [
      "On-premise LLM deployment",
      "Zero data leaves your network",
      "Custom model fine-tuning",
    ],
    iconBg: "rgba(124,58,237,0.08)",
    iconColor: "#7c3aed",
    hoverGlow: "rgba(124,58,237,0.06)",
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pill mb-6 text-[11px]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
            Solutions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5"
          >
            Built for businesses
            <br />
            <span className="text-slate-500">that demand precision</span>
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8 sm:p-10 cursor-pointer group"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-7">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: s.iconBg, color: s.iconColor }}
                >
                  {s.icon}
                </div>
                <span
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-sm"
                  style={{
                    background: s.tagBg,
                    border: `1px solid ${s.tagBorder}`,
                    color: s.tagColor,
                  }}
                >
                  {s.tagLabel}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {s.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-7">
                {s.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 list-none">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      style={{ color: s.iconColor }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 group-hover:text-white transition-colors duration-300">
                Explore Solution
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
