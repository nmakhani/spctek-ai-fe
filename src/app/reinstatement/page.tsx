"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReportViewer from "@/components/reinstatement/ReportViewer";

const SAMPLE_REPORTS = [
  {
    name: "Sample Reinstatement Report.pdf",
    url: "/sample-reports/Sample%20Reinstatement%20Report.pdf",
  },
];

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

type ContactForm = {
  name: string;
  email: string;
  phone: string;
};

export default function ReinstatementPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Contact modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
  });
  const [contactStatus, setContactStatus] = useState<
    "idle" | "submitting" | "sent"
  >("idle");
  const [reportReady, setReportReady] = useState(false);

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

    // Show contact modal first before generating report
    setShowContactModal(true);
  };

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email) return;
    setContactStatus("submitting");
    setErrorMsg("");

    const businessModel = isOther
      ? form.custom_business_model
      : form.business_model;

    try {
      // Generate the report with contact info
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
            // Contact information
            recipient_name: contactForm.name,
            recipient_email: contactForm.email,
            recipient_phone: contactForm.phone || null,
          }),
        },
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Server error" }));
        throw new Error(err.detail || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setReport(data.report);
      setContactStatus("sent");

      // Keep modal open briefly to show success message
      await new Promise((r) => setTimeout(r, 1500));

      setShowContactModal(false);
      setReportReady(true);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setContactStatus("idle");
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setStatus("idle");
    setReport("");
    setErrorMsg("");
    setShowContactModal(false);
    setContactForm({ name: "", email: "", phone: "" });
    setContactStatus("idle");
    setReportReady(false);
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

          {/* Sample Reports */}
          {!reportReady && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.5 }}
              className="mb-8 glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-4 h-4 text-cyan flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-sm font-bold text-white">
                  Have a look at our sample reports
                </h2>
              </div>
              <div className="space-y-2">
                {SAMPLE_REPORTS.map((file) => (
                  <a
                    key={file.name}
                    href={file.url}
                    download
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan/30 transition-all group"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-rose/[0.1] border border-rose/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-rose"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16zm0-6h3v1.5H8V10z" />
                      </svg>
                    </div>
                    <span className="flex-1 text-sm text-slate-300 group-hover:text-white transition-colors">
                      {file.name}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-cyan transition-colors">
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Download</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Show report or form */}
          {reportReady && report ? (
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

      {/* ─── Contact Modal ─── */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md glass-card-elevated p-8 z-10"
            >
              {contactStatus === "sent" ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-cyan/[0.1] border-2 border-cyan flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-cyan"
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
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Report processing started!
                  </h3>
                  <p className="text-sm text-slate-400">
                    Your reinstatement report is being generated and will be
                    sent to{" "}
                    <span className="text-cyan font-medium">
                      {contactForm.email}
                    </span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 border border-white/[0.06] flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-cyan"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Provide Your Contact Information
                    </h3>
                    <p className="text-sm text-slate-400">
                      We'll email your complete report as a PDF to the address
                      below.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 px-4 py-3 rounded-xl border border-rose/20 bg-rose/[0.06] text-rose text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="form-label">
                        Full Name <span className="text-cyan">*</span>
                      </label>
                      <input
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Jane Smith"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        Email <span className="text-cyan">*</span>
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        placeholder="jane@company.com"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">
                        Phone <span className="text-slate-600">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="+1 (555) 123-4567"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleContactSubmit}
                    disabled={
                      !contactForm.name ||
                      !contactForm.email ||
                      contactStatus === "submitting"
                    }
                    className="glow-btn w-full justify-center text-sm mb-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {contactStatus === "submitting" ? (
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
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                        Generate & Email Report
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-600 text-center leading-relaxed">
                    Your contact information is required to deliver the report.
                    We'll only use it for that purpose.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
