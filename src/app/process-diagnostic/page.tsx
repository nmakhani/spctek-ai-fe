"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
  // Step 1
  motive: string;
  teamSize: string;
  industry: string;
  // Step 2
  sopLocation: string;
  decisionMaking: string;
  onboardingTime: string;
  // Step 3
  toolIntegration: string;
  founderBottleneck: string;
  customerComms: string;
  // Step 4
  brokenProcess: string;
  timeWasted: string;
  triedToFix: string;
  // Step 5 (contact)
  name: string;
  email: string;
  company: string;
};

type Step = 1 | 2 | 3 | 4 | 5;

const INITIAL: FormData = {
  motive: "Scaling without burnout",
  teamSize: "Solo",
  industry: "eCommerce",
  sopLocation: "Heads",
  decisionMaking: "Founder",
  onboardingTime: "Long",
  toolIntegration: "Manual",
  founderBottleneck: "Everything",
  customerComms: "Manual",
  brokenProcess: "",
  timeWasted: "5-10",
  triedToFix: "Never",
  name: "",
  email: "",
  company: "",
};

// ─── Radio Card Component ─────────────────────────────────────────────────────

function RadioCard({
  name,
  value,
  current,
  label,
  desc,
  onChange,
}: {
  name: keyof FormData;
  value: string;
  current: string;
  label: string;
  desc?: string;
  onChange: (name: keyof FormData, value: string) => void;
}) {
  const selected = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(name, value)}
      className={`w-full text-left rounded-xl p-4 border transition-all duration-200 ${
        selected
          ? "border-cyan bg-cyan/[0.08] shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.15)]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-cyan/30 hover:bg-cyan/[0.04]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            selected ? "border-cyan" : "border-white/20"
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-cyan" />}
        </div>
        <div>
          <p
            className={`text-sm font-medium ${selected ? "text-white" : "text-slate-300"}`}
          >
            {label}
          </p>
          {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
        </div>
      </div>
    </button>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = (step / 5) * 100;
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-slate-500 tracking-widest uppercase">
          Step {step} of 5
        </span>
        <span className="text-xs font-semibold text-cyan">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #dc3bf5, #520e60)" }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// ─── Step Wrapper ─────────────────────────────────────────────────────────────

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Score Calculator ─────────────────────────────────────────────────────────

function calculateScore(f: FormData) {
  let score = 100;

  // SOPs / Knowledge (-25 max)
  if (f.sopLocation === "Heads") score -= 22;
  else if (f.sopLocation === "Slack") score -= 14;
  else if (f.sopLocation === "Docs") score -= 6;

  // Tool Integration (-20 max)
  if (f.toolIntegration === "Manual") score -= 20;
  else if (f.toolIntegration === "Zapier") score -= 10;

  // Founder Bottleneck (-20 max)
  if (f.founderBottleneck === "Everything") score -= 20;
  else if (f.founderBottleneck === "Some") score -= 8;

  // Decision making (-10 max)
  if (f.decisionMaking === "Founder") score -= 10;
  else if (f.decisionMaking === "Leads") score -= 4;

  // Onboarding (-8 max)
  if (f.onboardingTime === "Long") score -= 8;
  else if (f.onboardingTime === "Medium") score -= 4;

  // Customer comms (-10 max)
  if (f.customerComms === "Manual") score -= 10;
  else if (f.customerComms === "Outsourced") score -= 6;
  else if (f.customerComms === "Partial") score -= 2;

  // Time wasted (-7 max)
  if (f.timeWasted === "10+") score -= 7;
  else if (f.timeWasted === "5-10") score -= 4;
  else if (f.timeWasted === "2-5") score -= 2;

  return Math.min(90, Math.max(20, score));
}

function getCategory(score: number) {
  if (score >= 76)
    return {
      label: "Well-Organized",
      color: "text-green",
      border: "border-green",
      glow: "rgba(52,211,153,0.3)",
      desc: "Your systems are relatively healthy — targeted automation would compound your gains significantly.",
    };
  if (score >= 51)
    return {
      label: "Fragmented & Founder-Dependent",
      color: "text-amber",
      border: "border-amber",
      glow: "rgba(251,191,36,0.3)",
      desc: "You're growing, but fragile. One departure or mistake can cascade quickly without better systems.",
    };
  return {
    label: "Chaos Mode (High Risk)",
    color: "text-rose",
    border: "border-rose",
    glow: "rgba(251,113,133,0.3)",
    desc: "You're running on manual effort. Every day without automation is a hidden revenue leak.",
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProcessDiagnosticPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [step, setStep] = useState<Step>(1);
  const [phase, setPhase] = useState<"form" | "loading" | "results">("form");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (name: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [name]: value }));

  const next = (to: Step) => setStep(to);
  const back = (to: Step) => setStep(to);

  const loadingMessages = [
    "Scanning for process bottlenecks...",
    "Evaluating tool friction and knowledge leaks...",
    "Mapping founder dependency risk...",
    "Generating your personalized scorecard...",
  ];
  const [loadingIdx, setLoadingIdx] = useState(0);

  const runAnalysis = async () => {
    if (!form.email || !form.name) return;
    setSubmitting(true);
    setSubmitError("");
    setPhase("loading");
    setLoadingIdx(0);

    // Cycle loading messages
    const msgInterval = setInterval(() => {
      setLoadingIdx((i) => Math.min(i + 1, loadingMessages.length - 1));
    }, 1200);

    // Submit contact to backend
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/contacts/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            company: form.company || null,
            message: `Process Diagnostic — Motive: ${form.motive} | Team: ${form.teamSize} | Industry: ${form.industry} | SOPs: ${form.sopLocation} | Tools: ${form.toolIntegration} | Score: ${calculateScore(form)} | Broken process: ${form.brokenProcess}`,
            source: "process_diagnostic",
          }),
        },
      );
    } catch {
      // Non-blocking — still show results
    }

    await new Promise((r) => setTimeout(r, 4000));
    clearInterval(msgInterval);
    setPhase("results");
    setSubmitting(false);
  };

  const score = calculateScore(form);
  const category = getCategory(score);

  const pointers = buildPointers(form);

  return (
    <div className="relative min-h-screen noise-overlay grid-bg">
      {/* Aurora orbs */}
      <div
        className="fixed top-20 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none -z-10 animate-aurora-drift-1"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--theme-accent-rgb),0.08) 0%, rgba(var(--theme-accent-rgb),0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="fixed top-1/2 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none -z-10 animate-aurora-drift-2"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--theme-accent2-rgb),0.08) 0%, rgba(var(--theme-accent2-rgb),0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div className="gradient-stripes" />

      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex pill mb-6 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
              5-Minute Process Assessment
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5">
              Find Your Hidden{" "}
              <span className="gradient-text">Automation Wins</span>
            </h1>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
              Answer a few questions about how your business runs today —
              we&apos;ll pinpoint exactly where automation can save you the most
              time and money, with zero fluff.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="glass-card-elevated p-8 md:p-10"
          >
            <AnimatePresence mode="wait">
              {/* ─── Loading ─────────────────────────────────── */}
              {phase === "loading" && (
                <StepWrapper key="loading">
                  <div className="text-center py-12">
                    <div className="relative w-16 h-16 mx-auto mb-8">
                      <div className="absolute inset-0 rounded-full border-2 border-cyan/20" />
                      <div className="absolute inset-0 rounded-full border-t-2 border-cyan animate-spin" />
                      <div className="absolute inset-[6px] rounded-full border-t-2 border-purple animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
                    </div>
                    <h3 className="text-xl font-bold text-cyan mb-2">
                      Analyzing Your Process Architecture
                    </h3>
                    <motion.p
                      key={loadingIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-slate-400 text-sm"
                    >
                      {loadingMessages[loadingIdx]}
                    </motion.p>
                  </div>
                </StepWrapper>
              )}

              {/* ─── Results ─────────────────────────────────── */}
              {phase === "results" && (
                <StepWrapper key="results">
                  {/* Score header */}
                  <div className="flex items-center gap-6 pb-8 mb-8 border-b border-white/[0.06]">
                    <div
                      className={`relative w-24 h-24 flex-shrink-0 flex items-center justify-center rounded-full border-2 ${category.border}`}
                      style={{ boxShadow: `0 0 24px ${category.glow}` }}
                    >
                      <motion.span
                        className="text-3xl font-black text-white"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        {score}
                      </motion.span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                        Process Health Score
                      </p>
                      <p
                        className={`text-2xl font-black ${category.color} mb-1`}
                      >
                        {category.label}
                      </p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {category.desc}
                      </p>
                    </div>
                  </div>

                  {/* Pointers */}
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">
                    Top Hidden Challenges Detected
                  </h3>
                  <div className="space-y-4 mb-8">
                    {pointers.map((p, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.12 }}
                        className={`rounded-xl p-4 border border-white/[0.06] bg-white/[0.02] border-l-4 ${p.accent}`}
                      >
                        <h4 className="font-bold text-white text-sm mb-1">
                          {p.title}
                        </h4>
                        <p className="text-sm text-slate-400 mb-2 leading-relaxed">
                          {p.body}
                        </p>
                        <p className={`text-xs font-semibold ${p.costColor}`}>
                          Hidden Cost: {p.cost}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA box */}
                  <div className="rounded-2xl border border-cyan/20 bg-cyan/[0.04] p-6">
                    <p className="text-sm font-bold text-white mb-1">
                      Ready to fix these in 30 days?
                    </p>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      We&apos;ll map your entire process landscape and identify
                      which automations give you the fastest payback — in a
                      single 30-min session.
                    </p>
                    <a
                      href="/#contact"
                      className="glow-btn !text-sm !py-2.5 !px-6 w-full justify-center"
                    >
                      Book My Free Strategy Call
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
                    <p className="text-center text-xs text-slate-600 mt-3">
                      No hard sell. No commitment required.
                    </p>
                  </div>
                </StepWrapper>
              )}

              {/* ─── Form Steps ───────────────────────────────── */}
              {phase === "form" && (
                <StepWrapper key={`step-${step}`}>
                  <ProgressBar step={step} />

                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-black text-white mb-1">
                          Operational Baseline
                        </h2>
                        <p className="text-slate-400 text-sm">
                          Tell us a bit about your team and goals.
                        </p>
                      </div>

                      <div>
                        <label className="form-label">
                          What is your primary goal right now?
                        </label>
                        <select
                          value={form.motive}
                          onChange={(e) => set("motive", e.target.value)}
                          className="form-input"
                        >
                          <option>Scaling without burnout</option>
                          <option>Reducing manual errors</option>
                          <option>Freeing up founder time</option>
                          <option>Building repeatable processes</option>
                          <option>Reducing operational costs</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Team Size</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { v: "Solo", l: "Solo – 5", d: "Founder-led" },
                            { v: "6-15", l: "6 – 15", d: "Growing team" },
                            { v: "16+", l: "16+", d: "Established" },
                          ].map(({ v, l, d }) => (
                            <RadioCard
                              key={v}
                              name="teamSize"
                              value={v}
                              current={form.teamSize}
                              label={l}
                              desc={d}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">
                          Industry / Vertical
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { v: "eCommerce", l: "eCommerce" },
                            { v: "Agency/Services", l: "Agency / Services" },
                            { v: "SaaS", l: "SaaS / Tech" },
                            {
                              v: "Professional Services",
                              l: "Professional Services",
                            },
                            { v: "Logistics", l: "Logistics" },
                            { v: "Other", l: "Other" },
                          ].map(({ v, l }) => (
                            <RadioCard
                              key={v}
                              name="industry"
                              value={v}
                              current={form.industry}
                              label={l}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => next(2)}
                          className="glow-btn w-full justify-center"
                        >
                          Next: Knowledge Systems →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-black text-white mb-1">
                          Knowledge & Decision-Making
                        </h2>
                        <p className="text-slate-400 text-sm">
                          How does information flow inside your business?
                        </p>
                      </div>

                      <div>
                        <label className="form-label">
                          Where do your SOPs and processes currently live?
                        </label>
                        <div className="space-y-2">
                          {[
                            {
                              v: "Heads",
                              l: "In people's heads",
                              d: "Tribal knowledge, not written down",
                            },
                            {
                              v: "Slack",
                              l: "Scattered in Slack / WhatsApp",
                              d: "Usually buried, hard to find",
                            },
                            {
                              v: "Docs",
                              l: "Google Docs / Notion (often outdated)",
                              d: "Written but not maintained",
                            },
                            {
                              v: "Hub",
                              l: "Centralized & actively used",
                              d: "Team actually follows them",
                            },
                          ].map(({ v, l, d }) => (
                            <RadioCard
                              key={v}
                              name="sopLocation"
                              value={v}
                              current={form.sopLocation}
                              label={l}
                              desc={d}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">
                          Who makes day-to-day operational decisions?
                        </label>
                        <div className="space-y-2">
                          {[
                            {
                              v: "Founder",
                              l: "Almost everything goes through the founder",
                              d: "High dependency risk",
                            },
                            {
                              v: "Leads",
                              l: "Team leads with frequent founder check-ins",
                              d: "Partial delegation",
                            },
                            {
                              v: "Autonomous",
                              l: "Team is largely self-sufficient",
                              d: "Healthy structure",
                            },
                          ].map(({ v, l, d }) => (
                            <RadioCard
                              key={v}
                              name="decisionMaking"
                              value={v}
                              current={form.decisionMaking}
                              label={l}
                              desc={d}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">
                          How long does it take to onboard a new team member?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { v: "Long", l: "1+ months", d: "Painful" },
                            { v: "Medium", l: "2–4 weeks", d: "Average" },
                            { v: "Short", l: "~1 week", d: "Streamlined" },
                          ].map(({ v, l, d }) => (
                            <RadioCard
                              key={v}
                              name="onboardingTime"
                              value={v}
                              current={form.onboardingTime}
                              label={l}
                              desc={d}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => back(1)}
                          className="outline-btn w-1/3 justify-center"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => next(3)}
                          className="glow-btn flex-1 justify-center"
                        >
                          Next: Friction Points →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-black text-white mb-1">
                          Friction & Bottlenecks
                        </h2>
                        <p className="text-slate-400 text-sm">
                          Where does momentum die in your operations?
                        </p>
                      </div>

                      <div>
                        <label className="form-label">
                          How well do your tools talk to each other?
                        </label>
                        <div className="space-y-2">
                          {[
                            {
                              v: "Manual",
                              l: "Manual copy-pasting between tools",
                              d: "Highest risk of errors",
                            },
                            {
                              v: "Zapier",
                              l: "Basic Zapier / Make (breaks sometimes)",
                              d: "Brittle automation",
                            },
                            {
                              v: "Native",
                              l: "Native integrations or custom code",
                              d: "Reliable and fast",
                            },
                          ].map(({ v, l, d }) => (
                            <RadioCard
                              key={v}
                              name="toolIntegration"
                              value={v}
                              current={form.toolIntegration}
                              label={l}
                              desc={d}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">
                          The Founder Bottleneck
                        </label>
                        <div className="space-y-2">
                          {[
                            {
                              v: "Everything",
                              l: "Founder approves almost everything",
                              d: "Team can't move without you",
                            },
                            {
                              v: "Some",
                              l: "Founder approves big decisions only",
                              d: "Some breathing room",
                            },
                            {
                              v: "Autonomous",
                              l: "Team is highly autonomous",
                              d: "Well-delegated",
                            },
                          ].map(({ v, l, d }) => (
                            <RadioCard
                              key={v}
                              name="founderBottleneck"
                              value={v}
                              current={form.founderBottleneck}
                              label={l}
                              desc={d}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">
                          How is customer communication managed?
                        </label>
                        <div className="space-y-2">
                          {[
                            {
                              v: "Manual",
                              l: "Manually by team members",
                              d: "Reactive and inconsistent",
                            },
                            {
                              v: "Outsourced",
                              l: "Outsourced to VA / agency",
                              d: "Off your plate but still manual",
                            },
                            {
                              v: "Partial",
                              l: "Partly automated (canned responses, etc.)",
                              d: "Getting there",
                            },
                            {
                              v: "Full",
                              l: "Fully automated or AI-handled",
                              d: "Running in the background",
                            },
                          ].map(({ v, l, d }) => (
                            <RadioCard
                              key={v}
                              name="customerComms"
                              value={v}
                              current={form.customerComms}
                              label={l}
                              desc={d}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => back(2)}
                          className="outline-btn w-1/3 justify-center"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => next(4)}
                          className="glow-btn flex-1 justify-center"
                        >
                          Next: The Broken Link →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-black text-white mb-1">
                          The Broken Link
                        </h2>
                        <p className="text-slate-400 text-sm">
                          Tell us about the one process that keeps costing you.
                        </p>
                      </div>

                      <div>
                        <label className="form-label">
                          Describe the most tedious or error-prone manual
                          process in your business
                        </label>
                        <textarea
                          rows={4}
                          value={form.brokenProcess}
                          onChange={(e) => set("brokenProcess", e.target.value)}
                          className="form-input resize-none"
                          placeholder="e.g., We manually download orders from Shopify and re-enter them into a spreadsheet for the warehouse team, then manually email tracking updates to customers..."
                        />
                      </div>

                      <div>
                        <label className="form-label">
                          How much time does this process waste per week?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              v: "2",
                              l: "Under 2 hrs/wk",
                              d: "Minor friction",
                            },
                            {
                              v: "2-5",
                              l: "2 – 5 hrs/wk",
                              d: "Noticeable drag",
                            },
                            {
                              v: "5-10",
                              l: "5 – 10 hrs/wk",
                              d: "Significant cost",
                            },
                            {
                              v: "10+",
                              l: "10+ hrs/wk",
                              d: "Major bottleneck",
                            },
                          ].map(({ v, l, d }) => (
                            <RadioCard
                              key={v}
                              name="timeWasted"
                              value={v}
                              current={form.timeWasted}
                              label={l}
                              desc={d}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="form-label">
                          Have you tried to fix this before?
                        </label>
                        <div className="space-y-2">
                          {[
                            {
                              v: "Never",
                              l: "Never — not sure where to start",
                            },
                            {
                              v: "Attempted",
                              l: "Attempted, but nothing stuck",
                            },
                            {
                              v: "Partial",
                              l: "Partially solved, still has gaps",
                            },
                          ].map(({ v, l }) => (
                            <RadioCard
                              key={v}
                              name="triedToFix"
                              value={v}
                              current={form.triedToFix}
                              label={l}
                              onChange={set}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => back(3)}
                          className="outline-btn w-1/3 justify-center"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={() => next(5)}
                          className="glow-btn flex-1 justify-center"
                        >
                          Get My Scorecard →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5 */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-black text-white mb-1">
                          Almost There
                        </h2>
                        <p className="text-slate-400 text-sm">
                          Enter your details to unlock your Process Health Score
                          and personalized automation playbook.
                        </p>
                      </div>

                      {/* Preview score teaser */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-cyan/40 bg-cyan/[0.06] flex items-center justify-center flex-shrink-0">
                          <div className="text-lg font-black text-cyan blur-[3px] select-none">
                            {score}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                            Your score is ready
                          </p>
                          <p className="text-sm text-slate-300">
                            Enter your email below to reveal your full scorecard
                            &amp; top 3 fixes.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">
                            Full Name <span className="text-cyan">*</span>
                          </label>
                          <input
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Jane Smith"
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label className="form-label">Company</label>
                          <input
                            value={form.company}
                            onChange={(e) => set("company", e.target.value)}
                            placeholder="Acme Corp"
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="form-label">
                          Work Email <span className="text-cyan">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="jane@company.com"
                          className="form-input"
                        />
                      </div>

                      {submitError && (
                        <p className="text-rose text-sm">{submitError}</p>
                      )}

                      <p className="text-xs text-slate-600 leading-relaxed">
                        We take privacy seriously — your details are only used
                        to send your scorecard and optional follow-up. No spam,
                        ever.
                      </p>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => back(4)}
                          className="outline-btn w-1/3 justify-center"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={runAnalysis}
                          disabled={!form.name || !form.email || submitting}
                          className="glow-btn flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {submitting
                            ? "Analyzing..."
                            : "Reveal My Scorecard →"}
                        </button>
                      </div>
                    </div>
                  )}
                </StepWrapper>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust bar */}
          {phase === "form" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600"
            >
              {[
                "Free — no credit card",
                "Results in 30 seconds",
                "No spam, ever",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="text-cyan text-[10px]">✓</span>
                  {t}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Pointer Builder ──────────────────────────────────────────────────────────

type Pointer = {
  title: string;
  body: string;
  cost: string;
  accent: string;
  costColor: string;
};

function buildPointers(f: FormData): Pointer[] {
  type ScoredPointer = Pointer & { severity: number };
  const pool: ScoredPointer[] = [];

  // ── 1. SOPs & Knowledge ───────────────────────────────────────────
  if (f.sopLocation === "Heads") {
    pool.push({
      title: "Knowledge Leakage & Bus-Factor Risk",
      body: `Your critical processes exist only in people's minds. One resignation, sick day, or bad hire creates an immediate operational crisis. You cannot reliably scale, delegate, or automate what hasn't been defined — this is the single most common hidden growth blocker for ${f.teamSize === "Solo" ? "founder-led businesses" : `teams of ${f.teamSize}`}.`,
      cost: "~8–15 hrs/week lost to redundant Q&A, re-explaining, and untracked errors.",
      accent: "border-l-rose",
      costColor: "text-rose",
      severity: 9,
    });
  } else if (f.sopLocation === "Slack") {
    pool.push({
      title: "Scattered Knowledge Architecture",
      body: `Important process knowledge buried in chat threads is effectively invisible. Teams repeat the same mistakes, onboarding takes longer than it should, and institutional knowledge drains out with every departure. For a ${f.industry} operation, inconsistent execution directly impacts customer outcomes.`,
      cost: "Recoverable decisions take 3–5× longer than they should.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 7,
    });
  } else if (f.sopLocation === "Docs") {
    pool.push({
      title: "Documentation Drift",
      body: `Having docs is a start — but undated, unmaintained SOPs are often worse than none. Team members quietly follow outdated instructions and produce inconsistent results. In ${f.industry}, these silent deviations compound into quality issues that are hard to trace back to process failures.`,
      cost: "Onboarding costs 2–3× more than necessary; errors blamed on 'human mistake' are often process failures.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 5,
    });
  }

  // ── 2. Tool Integration ───────────────────────────────────────────
  if (f.toolIntegration === "Manual") {
    pool.push({
      title: "Data Fragmentation & Manual Transfer Risk",
      body: `Manual data entry between your tools creates invisible errors that compound over time — mismatched records, missed orders, billing discrepancies. These are rarely caught in real-time; they surface when a customer complains, a report is wrong, or a deadline is missed. For ${f.industry}, the downstream cost of even small data errors is significant.`,
      cost: "Teams spend 4–10 hrs/week on data reconciliation that automation eliminates entirely.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 8,
    });
  } else if (f.toolIntegration === "Zapier") {
    pool.push({
      title: "Integration Fragility",
      body: "Basic Zap-style automation breaks silently. When a workflow fails, no one notices until downstream damage appears — a missed lead, a double order, a customer who was never followed up with. Your integrations need resilient, monitored workflows with error alerting, not set-and-forget triggers.",
      cost: "Silent failures damage customer trust and revenue before they're detected.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 5,
    });
  } else {
    pool.push({
      title: "Untapped Automation Capacity at the Workflow Edge",
      body: `Your integrations are healthy — but even well-connected stacks have a 'last mile' of manual work layered on top. An AI agent layer could eliminate repetitive human touchpoints that your current tooling can't handle for your ${f.industry} operations.`,
      cost: "Uncaptured efficiency at the workflow edges — typically 2–4 hrs/week per team member.",
      accent: "border-l-purple",
      costColor: "text-purple-light",
      severity: 3,
    });
  }

  // ── 3. Founder / Decision Bottleneck ─────────────────────────────
  if (f.founderBottleneck === "Everything" || f.decisionMaking === "Founder") {
    // Deduplicate: only push once if both are worst-case
    const alreadyHas = pool.some((p) => p.title === "The Founder Ceiling");
    if (!alreadyHas) {
      pool.push({
        title: "The Founder Ceiling",
        body: `Your team's output is capped by a single person's availability. Every decision, review, or approval that routes back to you is a queued task blocking everyone downstream. This isn't a people problem — it's a systems problem. Decision frameworks, documented approval thresholds, and AI-assisted routing can unlock 3–5× team throughput without adding headcount.`,
        cost: "Every hour of founder review delay is a cascading delay for your entire team.",
        accent: "border-l-rose",
        costColor: "text-rose",
        severity: f.founderBottleneck === "Everything" ? 9 : 7,
      });
    }
  } else if (f.founderBottleneck === "Some") {
    pool.push({
      title: "Latent Founder Dependency",
      body: "You've delegated well overall — but the decisions still routing back to you will become the bottleneck as you scale. Systematize the remaining dependencies with documented approval thresholds and escalation playbooks before they compound into a ceiling.",
      cost: "Growth at the next stage will be constrained by the decisions not yet delegated.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 4,
    });
  }

  if (f.decisionMaking === "Leads" && f.founderBottleneck !== "Everything") {
    pool.push({
      title: "Key-Person Dependency at the Lead Level",
      body: "Routing decisions through team leads without documented criteria creates a second-tier bottleneck. When your leads are on leave, unavailable, or eventually depart, their teams stall. The fix is decision frameworks — documented criteria that empower team members to move forward independently.",
      cost: "Each unavailable lead multiplies wait time and frustration across their team.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 4,
    });
  }

  // ── 4. Customer Communications ───────────────────────────────────
  if (f.customerComms === "Manual") {
    pool.push({
      title: "Customer Communication Bottleneck",
      body: `Manual customer communication doesn't scale. Response times vary by who's available, tone is inconsistent across team members, and your team's bandwidth is the hard ceiling for customer satisfaction. In ${f.industry}, delayed or inconsistent responses are a direct driver of churn — often before you realize a customer is dissatisfied.`,
      cost: "Slow/inconsistent responses are a primary cause of churn and negative public reviews.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 6,
    });
  } else if (f.customerComms === "Outsourced") {
    pool.push({
      title: "Outsourced Comms Quality Risk",
      body: "External support teams lack the brand context and institutional knowledge that builds lasting customer trust. Without tight SOPs, quality scoring, and AI-assisted consistency checks, outsourced communication silently erodes the brand reputation you've built.",
      cost: "Brand inconsistency is difficult to measure until customers stop returning or leave public reviews.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 5,
    });
  } else if (f.customerComms === "Partial") {
    pool.push({
      title: "Inconsistent Customer Experience",
      body: "Partial automation means some customers receive fast, consistent responses while others wait for manual handling. This unpredictability undermines trust more than a universally slower manual process would, because expectations aren't set consistently.",
      cost: "Inconsistency is a hidden churn driver — customers don't complain, they just leave.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 3,
    });
  }

  // ── 5. Time Wasted ────────────────────────────────────────────────
  if (f.timeWasted === "10+") {
    pool.push({
      title: "Critical Manual Process Overhead",
      body: `Over 10 hours per week is consumed by repetitive, automatable work. At any team cost, this is the highest-ROI automation target in your business.${f.brokenProcess ? ` Your identified process — "${f.brokenProcess}" — is the most obvious starting point: structured, repetitive, and ripe for an AI agent.` : " The highest-impact automations almost always target the most repetitive, least strategic tasks."}`,
      cost: "10+ hrs/week × team cost = significant monthly overhead that AI automation eliminates.",
      accent: "border-l-rose",
      costColor: "text-rose",
      severity: 8,
    });
  } else if (f.timeWasted === "5-10") {
    pool.push({
      title: "Significant Manual Process Overhead",
      body: `5–10 hours per week in manual work is above the threshold where automation ROI is immediate.${f.brokenProcess ? ` "${f.brokenProcess}" is a high-leverage target — systematizing it will likely expose 2–3 adjacent tasks that can be automated in the same pass.` : " Start with the task your team complains about most — it's usually the best automation candidate."}`,
      cost: "5–10 hrs/week on repetitive tasks represents automation ROI waiting to be captured.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 6,
    });
  } else if (f.timeWasted === "2-5") {
    pool.push({
      title: "Latent Automation Opportunity",
      body: `Even 2–5 hours weekly represents meaningful efficiency gains.${f.brokenProcess ? ` "${f.brokenProcess}" in particular — structured, repetitive tasks like this are often the easiest to automate with immediate, measurable results.` : " Small wins compound: automating several 30-minute tasks often frees a full working day per month."}`,
      cost: "Small automation wins compound into full days of reclaimed capacity each month.",
      accent: "border-l-purple",
      costColor: "text-purple-light",
      severity: 3,
    });
  }

  // ── 6. Onboarding ────────────────────────────────────────────────
  if (f.onboardingTime === "Long") {
    pool.push({
      title: "Slow Onboarding as a Scaling Constraint",
      body: `Long onboarding means every new hire is a temporary drag on team productivity before contributing value. Without documented SOPs and an automated training flow, you rebuild institutional knowledge from scratch with every hire — and every hire is an opportunity for silent process deviations to enter your operation.`,
      cost: "Long onboarding delays ROI on every hire and creates compounding error-prone ramp periods.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 5,
    });
  } else if (f.onboardingTime === "Medium") {
    pool.push({
      title: "Onboarding Friction",
      body: "Moderate onboarding time often signals underdocumented processes and reliance on tribal knowledge transfer from existing team members. A structured onboarding playbook with an internal AI knowledge base can cut this significantly and standardize the output of new hires from day one.",
      cost: "Onboarding friction is directly linked to process documentation gaps and key-person dependency.",
      accent: "border-l-amber",
      costColor: "text-amber",
      severity: 3,
    });
  }

  // ── 7. Broken process (specific, if mentioned and not already covered) ──
  if (
    f.brokenProcess &&
    f.timeWasted !== "10+" &&
    f.timeWasted !== "5-10" &&
    f.timeWasted !== "2-5"
  ) {
    pool.push({
      title: "Identified Process Ready for Automation",
      body: `You've pinpointed "${f.brokenProcess}" — this self-awareness is the critical first step. Even if overall time waste is low, automating a specifically identified process eliminates its error surface entirely and typically reveals 2–3 adjacent automation candidates immediately downstream.`,
      cost: "Automating one named process often uncovers a cascade of related efficiency gains.",
      accent: "border-l-cyan",
      costColor: "text-cyan",
      severity: 4,
    });
  }

  // ── 8. Fallback: well-organized but still has forward opportunities ──
  if (pool.length === 0 || pool.every((p) => p.severity < 4)) {
    if (!pool.some((p) => p.title === "Optimization Ceiling")) {
      pool.push({
        title: "Optimization Ceiling",
        body: `Your operations are well-structured for your current stage — but even the best manual systems have an efficiency ceiling. The next growth phase for ${f.industry} businesses requires AI-assisted decision-making and predictive automation, not just better documentation or Zapier flows.`,
        cost: "Without the next automation layer, efficiency gains plateau at current team size.",
        accent: "border-l-purple",
        costColor: "text-purple-light",
        severity: 4,
      });
    }
    if (!pool.some((p) => p.title === "Competitive Automation Gap")) {
      pool.push({
        title: "Competitive Automation Gap",
        body: `Competitors in ${f.industry} who are adopting AI agents and workflow automation are compounding speed and margin advantages today. The business case has shifted from 'saving money' to 'staying competitive' — and early movers are building structural advantages that are hard to reverse.`,
        cost: "Delayed AI adoption creates a widening competitive gap that's costly to close reactively.",
        accent: "border-l-cyan",
        costColor: "text-cyan",
        severity: 3,
      });
    }
  }

  // Sort by severity descending, return top 4 (or all if fewer)
  pool.sort((a, b) => b.severity - a.severity);
  const limit = Math.min(pool.length, 4);
  return pool.slice(0, limit).map(({ severity: _s, ...rest }) => rest);
}
