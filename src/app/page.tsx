"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Issues from "@/components/Issues";
import TargetedSolutions from "@/components/TargetedSolutions";
import { SectionDivider } from "@/components/ui/SectionDivider";

export default function Home() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    // Generate shimmer particles
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = `shimmer-particle ${Math.random() > 0.5 ? "purple" : ""}`;

      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;

      // Random delay for staggered animation
      const delay = Math.random() * 8;
      particle.style.animationDelay = `${delay}s`;

      particlesRef.current.appendChild(particle);
    }
  }, []);

  return (
    <div className="relative min-h-screen noise-overlay grid-bg">
      {/* Floating Aurora Orb 1 — cyan */}
      <div
        className="fixed top-20 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none -z-10 animate-aurora-drift-1"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--theme-accent-rgb),0.08) 0%, rgba(var(--theme-accent-rgb),0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Floating Aurora Orb 2 — purple */}
      <div
        className="fixed top-1/2 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none -z-10 animate-aurora-drift-2"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--theme-accent2-rgb),0.08) 0%, rgba(var(--theme-accent2-rgb),0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Floating Aurora Orb 3 — cyan light */}
      <div
        className="fixed bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none -z-10 animate-aurora-drift-3"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--theme-accent-rgb),0.06) 0%, rgba(var(--theme-accent-rgb),0.01) 40%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      {/* Global ambient glow — top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-cyan/[0.04] via-transparent to-transparent pointer-events-none -z-10" />
      {/* Global ambient glow — bottom */}
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-purple/[0.03] via-transparent to-transparent pointer-events-none -z-10" />
      {/* Animated gradient stripes overlay */}
      <div className="gradient-stripes" />
      {/* Shimmer particles container */}
      <div ref={particlesRef} className="shimmer-particles" />

      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <Problems />
        <SectionDivider />
        <Issues />
        <SectionDivider />
        <TargetedSolutions />
      </main>
    </div>
  );
}
