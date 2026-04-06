"use client";

import { useState } from "react";

interface Glow {
  id: number;
  top: string;
  left: string;
  size: string;
  color: string;
}

// Seeded random generator to ensure consistent values between server and client
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateGlows(): Glow[] {
  const colors = ["#606bfa", "#4a57d6", "#2d3bab"];
  return Array.from({ length: 3 }, (_, i) => ({
    id: i,
    top: `${seededRandom(i * 123) * 100}%`,
    left: `${seededRandom(i * 456) * 100}%`,
    size: `${250 + seededRandom(i * 789) * 200}px`,
    color: colors[Math.floor(seededRandom(i * 999) * colors.length)],
  }));
}

export function GlowBackground() {
  const [glows] = useState<Glow[]>(() => generateGlows());

  return (
    <>
      {glows.map((glow) => (
        <div
          key={glow.id}
          className="pointer-events-none fixed rounded-full blur-3xl"
          style={{
            top: glow.top,
            left: glow.left,
            width: glow.size,
            height: glow.size,
            backgroundColor: `${glow.color}20`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );
}
