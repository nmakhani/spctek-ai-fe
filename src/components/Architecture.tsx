"use client";

import { motion } from "framer-motion";

const nodes = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z"
        />
      </svg>
    ),
    label: "User Interface",
    desc: "Apps & dashboards",
    color: "var(--theme-accent)",
    bg: "rgba(var(--theme-accent-rgb),0.08)",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    ),
    label: "API Gateway",
    desc: "Internal REST router",
    color: "var(--theme-accent2)",
    bg: "rgba(var(--theme-accent2-rgb),0.08)",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
        />
      </svg>
    ),
    label: "Local LLM",
    desc: "Ollama / vLLM on-prem",
    color: "var(--theme-accent)",
    bg: "rgba(var(--theme-accent-rgb),0.08)",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
    label: "Vector Store",
    desc: "Embeddings & search",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
    label: "Business Data",
    desc: "DB, files, ops data",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
  },
];

export default function Architecture() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pill mb-6 text-[11px]"
            style={{
              background: "rgba(var(--theme-accent2-rgb),0.08)",
              borderColor: "rgba(var(--theme-accent2-rgb),0.2)",
              color: "var(--theme-accent2-light)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent2-light animate-pulse-glow" />
            Architecture
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5"
          >
            Your private AI stack
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-slate-400 text-base leading-relaxed"
          >
            Every component runs on your infrastructure. No data ever leaves
            your network, no third-party dependencies.
          </motion.p>
        </div>

        {/* Architecture diagram card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-card-elevated p-8 sm:p-10 relative max-w-4xl mx-auto"
        >
          {/* Air-gapped badge */}
          <div
            className="absolute top-5 right-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-sm"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
              color: "#34d399",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green" />
            </span>
            Fully Air-Gapped
          </div>

          {/* Flow nodes */}
          <div className="flex items-center gap-0 my-10 overflow-x-auto pb-4 flex-wrap md:flex-nowrap justify-center">
            {nodes.map((n, i) => (
              <div key={n.label} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex flex-col items-center gap-3 shrink-0 group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: n.bg,
                      border: `1px solid ${n.color}20`,
                      color: n.color,
                    }}
                  >
                    {n.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-300 text-center max-w-[80px]">
                    {n.label}
                  </span>
                  <span className="text-[10px] text-slate-600 text-center max-w-[80px] leading-snug">
                    {n.desc}
                  </span>
                </motion.div>
                {i < nodes.length - 1 && (
                  <div className="w-10 flex items-center justify-center mb-10 hidden md:flex shrink-0">
                    <svg
                      className="w-5 h-5 text-slate-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div
            className="flex flex-wrap gap-6 pt-6 text-xs text-slate-500"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              All traffic stays within your network
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              No telemetry or external API calls
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
