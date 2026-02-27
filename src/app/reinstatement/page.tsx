"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportViewer from "@/components/reinstatement/ReportViewer";

const BUSINESS_MODELS = [
  { value: "", label: "-- Select Business Model --" },
  {
    value: "Private Label",
    label: "Private Label – Source and brand your own products",
  },
  {
    value: "White Label",
    label: "White Label – Resell manufacturer products under your brand",
  },
  {
    value: "Wholesale",
    label: "Wholesale – Purchase bulk inventory from distributors",
  },
  {
    value: "Retail Arbitrage",
    label: "Retail Arbitrage – Buy from retail stores and resell online",
  },
  {
    value: "Online Arbitrage",
    label: "Online Arbitrage – Buy from other online retailers and resell",
  },
  {
    value: "Dropshipping",
    label: "Dropshipping – Supplier ships products directly to customers",
  },
  { value: "Other", label: "Other – Please specify below" },
];

type FormState = {
  performance_notification: string;
  suspension_date: string;
  business_model: string;
  custom_business_model: string;
  appeals_made: number;
  seller_belief: string;
  available_documents: string;
};

const INITIAL_FORM: FormState = {
  performance_notification: "",
  suspension_date: "",
  business_model: "",
  custom_business_model: "",
  appeals_made: 0,
  seller_belief: "",
  available_documents: "",
};

type Status = "idle" | "generating" | "done" | "error";

export default function ReinstatementPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isOther = form.business_model === "Other";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "appeals_made" ? Number(value) : value,
    }));
  };

  const canSubmit =
    form.performance_notification.trim() &&
    form.suspension_date &&
    (isOther ? form.custom_business_model.trim() : form.business_model) &&
    form.seller_belief.trim() &&
    form.available_documents.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("generating");
    setErrorMsg("");
    setReport("");

    const businessModel = isOther
      ? form.custom_business_model
      : form.business_model;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/reinstatement/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            performance_notification: form.performance_notification,
            suspension_date: form.suspension_date,
            business_model: businessModel,
            appeals_made: form.appeals_made,
            seller_belief: form.seller_belief,
            available_documents: form.available_documents,
            model_selected: "gemini-3-flash-preview",
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Server error" }));
        throw new Error(err.detail || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setReport(data.report);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setStatus("idle");
    setReport("");
    setErrorMsg("");
  };

  return (
    <div className="relative min-h-screen noise-overlay grid-bg">
      {/* Aurora orbs */}
      <div
        className="fixed top-20 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none -z-10 animate-aurora-drift-1"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="fixed top-1/2 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none -z-10 animate-aurora-drift-2"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div className="gradient-stripes" />

      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex pill mb-6 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
              AI-Powered Assessment
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5">
              Reinstatement <span className="gradient-text">Estimator</span>
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
              Paste your Amazon performance notification and get an instant
              AI-generated reinstatement assessment with actionable next steps.
            </p>
          </motion.div>

          {/* Show report or form */}
          {status === "done" && report ? (
            <ReportViewer report={report} onBack={handleReset} />
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              onSubmit={handleSubmit}
              className="glass-card-elevated p-8 md:p-10"
            >
              {/* Error banner */}
              {status === "error" && errorMsg && (
                <div className="mb-6 px-4 py-3 rounded-xl border border-rose/20 bg-rose/[0.06] text-rose text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Section 1 – Performance Notification */}
              <fieldset className="mb-8">
                <legend className="text-base font-bold text-white mb-5 pb-2 border-b border-white/[0.06] w-full">
                  Performance Notification Details
                </legend>
                <div>
                  <label className="form-label">
                    Amazon Performance Notification{" "}
                    <span className="text-cyan">*</span>
                  </label>
                  <textarea
                    name="performance_notification"
                    value={form.performance_notification}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Paste the full text of your Amazon Performance Notification email here…"
                    className="form-input resize-none"
                    required
                  />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Include the complete notification text from Amazon
                  </p>
                </div>
              </fieldset>

              {/* Section 2 – Account Information */}
              <fieldset className="mb-8">
                <legend className="text-base font-bold text-white mb-5 pb-2 border-b border-white/[0.06] w-full">
                  Account Information
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="form-label">
                      Suspension Date <span className="text-cyan">*</span>
                    </label>
                    <input
                      type="date"
                      name="suspension_date"
                      value={form.suspension_date}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                    <p className="text-[11px] text-slate-600 mt-1">
                      Date your account was suspended
                    </p>
                  </div>
                  <div>
                    <label className="form-label">
                      Previous Appeals <span className="text-cyan">*</span>
                    </label>
                    <input
                      type="number"
                      name="appeals_made"
                      value={form.appeals_made}
                      onChange={handleChange}
                      min={0}
                      className="form-input"
                      required
                    />
                    <p className="text-[11px] text-slate-600 mt-1">
                      Number of appeal attempts made
                    </p>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="form-label">
                    Business Model <span className="text-cyan">*</span>
                  </label>
                  <select
                    name="business_model"
                    value={form.business_model}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    {BUSINESS_MODELS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Select the model that best describes your operation
                  </p>
                </div>

                {isOther && (
                  <div className="mb-5">
                    <label className="form-label">
                      Specify Business Model{" "}
                      <span className="text-cyan">*</span>
                    </label>
                    <input
                      type="text"
                      name="custom_business_model"
                      value={form.custom_business_model}
                      onChange={handleChange}
                      placeholder="Enter your business model…"
                      className="form-input"
                      required
                    />
                  </div>
                )}
              </fieldset>

              {/* Section 3 – Additional Information */}
              <fieldset className="mb-8">
                <legend className="text-base font-bold text-white mb-5 pb-2 border-b border-white/[0.06] w-full">
                  Additional Information
                </legend>

                <div className="mb-5">
                  <label className="form-label">
                    Your Belief on Suspension Cause{" "}
                    <span className="text-cyan">*</span>
                  </label>
                  <textarea
                    name="seller_belief"
                    value={form.seller_belief}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe what you believe caused the suspension…"
                    className="form-input resize-none"
                    required
                  />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Your perspective on what caused the suspension
                  </p>
                </div>

                <div>
                  <label className="form-label">
                    Available Documents <span className="text-cyan">*</span>
                  </label>
                  <textarea
                    name="available_documents"
                    value={form.available_documents}
                    onChange={handleChange}
                    rows={3}
                    placeholder="List documents you have (e.g., Invoices, Business License, ID, Utility Bill, Plan of Action)…"
                    className="form-input resize-none"
                    required
                  />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Separate with commas or line breaks
                  </p>
                </div>
              </fieldset>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit || status === "generating"}
                  className="glow-btn flex-1 text-sm"
                >
                  {status === "generating" ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating Report…
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                        />
                      </svg>
                      Generate Report
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="outline-btn text-sm justify-center"
                >
                  Clear Form
                </button>
              </div>

              {/* Loading message */}
              {status === "generating" && (
                <p className="text-center text-slate-500 text-xs mt-5 animate-pulse">
                  Analyzing your case — this may take up to a minute…
                </p>
              )}
            </motion.form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
