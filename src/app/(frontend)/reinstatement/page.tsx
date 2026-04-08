"use client";

import React from "react";

import {
  Hero,
  AccountRisk,
  ReinstatementProcess,
  Intelligence,
  FreeAssessment,
  ExpertHelp,
  FAQSection,
} from "@/components/reinstatement";

import { SectionDivider } from "@/components/ui/SectionDivider";

export default function Home() {
  const SECTIONS = [
    { Component: Hero, id: "hero" },
    { Component: AccountRisk, id: "account-risk" },
    { Component: ReinstatementProcess, id: "reinstatement-process" },
    { Component: Intelligence, id: "intelligence" },
    { Component: FreeAssessment, id: "free-assessment" },
    { Component: ExpertHelp, id: "expert-help" },
    { Component: FAQSection, id: "faq" },
  ];

  return (
    <div className="relative flex flex-col min-h-screen noise-overlay">
      <main className="flex-1">
        {SECTIONS.map(({ Component, id }, index) => (
          <React.Fragment key={index}>
            <section id={id}>
              <Component />
            </section>
            {index < SECTIONS.length - 1 && <SectionDivider />}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
}
