"use client";

import React from "react";

import {
  Hero,
  Problems,
  Issues,
  Testimonials,
  TargetedSolutions,
  BusinessAdoption,
  OperationalFramework,
  Tools,
  PrivateAiStack,
  AIPlaybook,
  FAQSection,
  ContactSection,
} from "@/components/home-page";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SectionDivider } from "@/components/ui/SectionDivider";

export default function Home() {
  const SECTIONS = [
    { Component: Hero, id: "hero" },
    { Component: Problems, id: "problems" },
    { Component: Issues, id: "issues" },
    { Component: Testimonials, id: "testimonials" },
    { Component: OperationalFramework, id: "framework" },
    { Component: TargetedSolutions, id: "solutions" },
    { Component: BusinessAdoption, id: "adoption" },
    { Component: Tools, id: "tools" },
    { Component: PrivateAiStack, id: "stack" },
    { Component: AIPlaybook, id: "playbook" },
    { Component: ContactSection, id: "contact" },
    { Component: FAQSection, id: "faq" },
  ];

  return (
    <div className="relative flex flex-col min-h-screen noise-overlay">
      <Navbar />
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
      <Footer />
    </div>
  );
}
