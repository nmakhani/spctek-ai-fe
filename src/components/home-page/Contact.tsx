"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { contactsApi } from "@/lib/api";
import { SectionHeading } from "../ui/SectionHeading";

interface FormErrors {
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  submit?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Phone validation - basic international format
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.submit = "At least one of email or phone is required";
    }

    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone.trim() && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await contactsApi.create({
        name: formData.name,
        company: formData.company,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        message: formData.message,
        source: "website",
      });

      toast.success("Thank you! We'll be in touch soon.");
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit form";
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full rounded-2xl border border-white/25 bg-[linear-gradient(90deg,rgba(9,9,12,0.96),rgba(21,18,24,0.96))] px-5 py-3 text-base text-white/90 placeholder:text-white/25 outline-none transition-all focus:border-[#94a9ff] focus:ring-2 focus:ring-[#606bfa]/30";
  const errorInputStyles =
    "w-full rounded-2xl border border-red-500/50 bg-[linear-gradient(90deg,rgba(9,9,12,0.96),rgba(21,18,24,0.96))] px-5 py-3 text-base text-white/90 placeholder:text-white/25 outline-none transition-all focus:border-red-400 focus:ring-2 focus:ring-red-500/30";
  const labelStyles = "mb-2 block text-white text-lg font-semibold md:text-2xl";
  const errorStyles = "mt-1 text-sm text-red-400";

  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 font-poppins"
      id="contact"
    >
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="mx-auto mb-10 max-w-4xl text-center md:mb-12">
          <SectionHeading size="large">
            Ready to See How <span className="text-[#606bfa]">AI</span> Can
            Improve Your Operations?
          </SectionHeading>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-[1.35] text-white md:text-2xl">
            Provide your details, and we&apos;ll prepare a custom AI plan
            tailored to your business.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[40px] border border-[#b8c7ff] bg-[linear-gradient(140deg,rgba(4,4,8,0.98),rgba(0,0,0,0.98))] p-5 shadow-[0_24px_55px_rgba(0,0,0,0.68)] md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-12 h-36 w-36 rounded-full bg-white/45 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

          <form className="relative z-10 space-y-6" onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-red-400 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 text-left md:grid-cols-2 md:gap-6">
              <div>
                <label className={labelStyles}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nick Smith"
                  className={errors.fullName ? errorInputStyles : inputStyles}
                  disabled={loading}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.fullName && (
                  <p className={errorStyles}>{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className={labelStyles}>
                  Company <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Spctek"
                  className={errors.company ? errorInputStyles : inputStyles}
                  disabled={loading}
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
                {errors.company && (
                  <p className={errorStyles}>{errors.company}</p>
                )}
              </div>

              <div>
                <label className={labelStyles}>
                  Email
                  <span className="text-white/60 text-base">
                    {" "}
                    (email or phone required)
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="nicksmith@company.com"
                  className={errors.email ? errorInputStyles : inputStyles}
                  disabled={loading}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && <p className={errorStyles}>{errors.email}</p>}
              </div>

              <div>
                <label className={labelStyles}>
                  Phone
                  <span className="text-white/60 text-base">
                    {" "}
                    (email or phone required)
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-6454"
                  className={errors.phone ? errorInputStyles : inputStyles}
                  disabled={loading}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {errors.phone && <p className={errorStyles}>{errors.phone}</p>}
              </div>
            </div>

            <div className="text-left">
              <label className={labelStyles}>
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your business challenges..."
                className={
                  errors.message
                    ? `${errorInputStyles} resize-none py-4`
                    : `${inputStyles} resize-none py-4`
                }
                disabled={loading}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
              {errors.message && (
                <p className={errorStyles}>{errors.message}</p>
              )}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#606bfa] py-3.5 text-lg font-semibold text-white transition-all hover:bg-[#6f79ff] disabled:opacity-60 disabled:cursor-not-allowed font-poppins"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
