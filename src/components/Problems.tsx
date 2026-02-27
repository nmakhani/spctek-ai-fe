"use client";

import { motion } from "framer-motion";

const problems = [
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
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    ),
    title: "Ops Chaos",
    description:
      "Disconnected workflows, manual handoffs, and reactive firefighting drain your team and bleed revenue.",
    stat: "43%",
    statSuffix: "of SMBs",
    statLabel: "cite operations as top bottleneck",
    accentColor: "rgba(251,191,36,1)",
    accentBg: "rgba(251,191,36,0.08)",
    accentBorder: "rgba(251,191,36,0.15)",
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
    title: "Data Fragmentation",
    description:
      "Your business data lives in multiple places with no single source of truth.",
    stat: "7+",
    statSuffix: "tools",
    statLabel: "average SMB uses daily",
    accentColor: "rgba(251,113,133,1)",
    accentBg: "rgba(251,113,133,0.08)",
    accentBorder: "rgba(251,113,133,0.15)",
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
    title: "AI Confusion",
    description:
      "Generic AI tools don't deliver specific business value. You need operations-focused AI.",
    stat: "78%",
    statSuffix: "of teams",
    statLabel: "fail to deploy AI effectively",
    accentColor: "rgba(167,139,250,1)",
    accentBg: "rgba(167,139,250,0.08)",
    accentBorder: "rgba(167,139,250,0.15)",
  },
];

export default function Problems() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6">
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
            The Problem
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5"
          >
            Your tools are slowing
            <br />
            <span className="text-slate-500">you down</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-slate-400 text-base leading-relaxed"
          >
            Most businesses run on a patchwork of disconnected tools. The
            result? Slow decisions, lost revenue, and burned-out teams.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-7 sm:p-8 group"
              style={{ borderColor: p.accentBorder }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                style={{ background: p.accentBg, color: p.accentColor }}
              >
                {p.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                {p.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {p.description}
              </p>

              {/* Stat */}
              <div
                className="pt-5"
                style={{ borderTop: `1px solid ${p.accentBorder}` }}
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl sm:text-4xl font-black"
                    style={{ color: p.accentColor }}
                  >
                    {p.stat}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {p.statSuffix}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{p.statLabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
