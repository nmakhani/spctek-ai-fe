/**
 * ═══════════════════════════════════════════════════════════
 *  SPCTEK AI — Centralized Theme Definitions
 * ═══════════════════════════════════════════════════════════
 *  To switch the entire app to a different theme, edit ONE
 *  line in src/themes/index.ts — that's it.
 * ═══════════════════════════════════════════════════════════
 */

export interface Theme {
  name: string;

  // ── Backgrounds ──────────────────────────────────────────
  /** Page background */
  bg: string;
  /** Slightly lighter background variant */
  bgLight: string;
  /** Card / surface background */
  bgCard: string;

  // ── Primary Accent ───────────────────────────────────────
  /** Primary accent color (hex) */
  accent: string;
  /** Primary accent as "r, g, b" for rgba() usage */
  accentRgb: string;
  /** Light variant of primary accent */
  accentLight: string;
  /** Dark variant of primary accent */
  accentDark: string;

  // ── Secondary Accent ─────────────────────────────────────
  /** Secondary accent color (hex) */
  accent2: string;
  /** Secondary accent as "r, g, b" for rgba() usage */
  accent2Rgb: string;
  /** Light variant of secondary accent */
  accent2Light: string;
  /** Dark variant of secondary accent */
  accent2Dark: string;

  // ── Text ─────────────────────────────────────────────────
  /** Primary foreground / body text */
  fg: string;
  /** Muted text */
  muted: string;
  /** Light muted text */
  mutedLight: string;
  /** Dark muted text */
  mutedDark: string;
}

// ─────────────────────────────────────────────────────────────
//  Theme 1 — Purple Magenta
//  Rich deep-purple background with vibrant magenta + violet
//  accents. Feels premium, mystical and energetic.
// ─────────────────────────────────────────────────────────────
export const THEME_PURPLE_MAGENTA: Theme = {
  name: "purple-magenta",

  bg: "#000000",
  bgLight: "#0a0a0a",
  bgCard: "#0f0f0f",

  accent: "#d946ef",
  accentRgb: "217, 70, 239",
  accentLight: "#e879f9",
  accentDark: "#a21caf",

  accent2: "#7c3aed",
  accent2Rgb: "124, 58, 237",
  accent2Light: "#8b5cf6",
  accent2Dark: "#5b21b6",

  fg: "#f1f5f9",
  muted: "#64748b",
  mutedLight: "#94a3b8",
  mutedDark: "#475569",
};

// ─────────────────────────────────────────────────────────────
//  Theme 2 — SPCTEK Brand
//  Dark navy background with vibrant indigo + light purple
//  accents. Premium, professional, and modern.
// ─────────────────────────────────────────────────────────────
export const THEME_SPCTEK_BRAND: Theme = {
  name: "spctek-brand",

  bg: "#000000",
  bgLight: "#0a0a0a",
  bgCard: "#0f0f0f",

  accent: "#606bfa",
  accentRgb: "96, 107, 250",
  accentLight: "#7b87fb",
  accentDark: "#4a52d6",

  accent2: "#a0a6fc",
  accent2Rgb: "160, 166, 252",
  accent2Light: "#b8bdfb",
  accent2Dark: "#8a92f5",

  fg: "#ffffff",
  muted: "#a0a0a0",
  mutedLight: "#c0c0c0",
  mutedDark: "#808080",
};

// ─────────────────────────────────────────────────────────────
//  Theme 3 — Dark Neon
//  Near-black navy background with electric cyan + indigo
//  accents. Cyberpunk-corporate. Eye-catching and ultra-modern.
// ─────────────────────────────────────────────────────────────
export const THEME_DARK_NEON: Theme = {
  name: "dark-neon",

  bg: "#000000",
  bgLight: "#0a0a0a",
  bgCard: "#0f0f0f",

  accent: "#22d3ee",
  accentRgb: "34, 211, 238",
  accentLight: "#67e8f9",
  accentDark: "#0891b2",

  accent2: "#818cf8",
  accent2Rgb: "129, 140, 248",
  accent2Light: "#a5b4fc",
  accent2Dark: "#6366f1",

  fg: "#f0f9ff",
  muted: "#64748b",
  mutedLight: "#94a3b8",
  mutedDark: "#475569",
};
