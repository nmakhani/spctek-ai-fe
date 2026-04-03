"use client";

import React, { useState } from "react";

import { SectionHeading } from "../ui/SectionHeading";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const inputStyles =
    "w-full rounded-2xl border border-white/25 bg-[linear-gradient(90deg,rgba(9,9,12,0.96),rgba(21,18,24,0.96))] px-5 py-3 text-base text-white/90 placeholder:text-white/25 outline-none transition-all focus:border-[#94a9ff] focus:ring-2 focus:ring-[#606bfa]/30";
  const labelStyles = "mb-2 block text-white text-lg font-semibold md:text-2xl";

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
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-[1.35] text-white/90 md:text-2xl">
            Provide your details, and we&apos;ll prepare a custom AI plan
            tailored to your business.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[40px] border border-[#b8c7ff] bg-[linear-gradient(140deg,rgba(4,4,8,0.98),rgba(0,0,0,0.98))] p-5 shadow-[0_24px_55px_rgba(0,0,0,0.68)] md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-12 h-36 w-36 rounded-full bg-white/45 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

          <form
            className="relative z-10 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 gap-5 text-left md:grid-cols-2 md:gap-6">
              <div>
                <label className={labelStyles}>Full Name</label>
                <input
                  type="text"
                  placeholder="Nick Smith"
                  className={inputStyles}
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelStyles}>Company</label>
                <input
                  type="text"
                  placeholder="Spctek"
                  className={inputStyles}
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelStyles}>Email</label>
                <input
                  type="email"
                  placeholder="nicksmith@company.com"
                  className={inputStyles}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className={labelStyles}>Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-6454"
                  className={inputStyles}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="text-left">
              <label className={labelStyles}>Message</label>
              <textarea
                rows={4}
                placeholder="Tell us about your business challenges..."
                className={`${inputStyles} resize-none py-4`}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#606bfa] py-3.5 text-lg font-semibold text-white transition-all hover:bg-[#6f79ff] font-poppins"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
