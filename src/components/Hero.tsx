"use client";

import { motion } from "framer-motion";

const tags = [
  "Private AI Deployment",
  "Ops Intelligence",
  "Revenue Monitoring",
  "Reinstatement Automation",
  "Inventory Tracking",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 pt-16 pb-20 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Aurora orb 1 — cyan, top-left */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[20%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Aurora orb 2 — purple, bottom-right */}
      <motion.div
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 20, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.03) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Aurora orb 3 — mixed, center */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.06) 0%, rgba(124,58,237,0.04) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Horizontal accent line */}
      <div className="absolute top-[35%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/[0.12] to-transparent" />
      <div className="absolute top-[65%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple/[0.08] to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-cyan/20 bg-cyan/[0.06] backdrop-blur-md text-cyan text-xs font-semibold mb-10"
        >
          <span className="text-sm">⚡</span>
          AI-Native Operations Platform
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.08] tracking-tight text-white mb-7"
        >
          Build a System.
          <br />
          <span className="gradient-text">Not a Spreadsheet.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Replace fragmented tools and manual chaos with an intelligent AI
          operating layer. Ops intelligence, revenue tracking, and local AI
          deployment — unified for your business.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap mb-16"
        >
          <a href="#contact" className="glow-btn text-sm">
            Get Your AI Playbook
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
          <a href="#solutions" className="outline-btn">
            Explore Solutions
          </a>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-slate-500"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-2.5 whitespace-nowrap"
            >
              <span className="w-1 h-1 rounded-full bg-cyan/50" />
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
