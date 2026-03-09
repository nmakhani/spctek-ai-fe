"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden max-w-4xl mx-auto"
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/[0.06] via-bg-light to-purple/[0.06]" />
          <div
            className="absolute inset-0"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "1.5rem",
            }}
          />

          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-gradient-radial from-cyan/[0.12] to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* Bottom glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-gradient-radial from-purple/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 px-8 md:px-16 py-20 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex pill mb-8 text-[11px]"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              5-Minute Assessment
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5"
            >
              Get your custom
              <br />
              <span className="gradient-text">AI Operations Playbook</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed"
            >
              Answer a few quick questions about your business. We&apos;ll
              generate a personalized AI roadmap — free, no commitment required.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
            >
              <a href="/process-diagnostic" className="glow-btn text-sm">
                Get My AI Playbook
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
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-5 text-xs text-slate-700"
            >
              No spam. No sales calls. Just your custom strategy.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
