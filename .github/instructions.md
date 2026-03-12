# SPCTEK AI — Frontend Copilot Instructions

## Project Overview

This is the **SPCTEK AI frontend** — a Next.js 15 App Router application with a premium dark UI. It serves as the public-facing marketing site and user-facing tools for the SPCTEK AI platform, including an AI-powered Amazon reinstatement report tool, a local AI deployment guide, and a process diagnostic wizard.

---

## Tech Stack

| Layer      | Technology                                                     |
| ---------- | -------------------------------------------------------------- |
| Framework  | Next.js 15 (App Router)                                        |
| Language   | TypeScript (strict)                                            |
| Styling    | Tailwind CSS v3 + CSS custom properties (theme system)         |
| Fonts      | Poppins (headings), Gued (body/brand), JetBrains Mono (code)   |
| Animations | Framer Motion                                                  |
| Icons      | Inline SVG (no icon library)                                   |
| Images     | `next/image` (always use for `<img>` tags)                     |
| API        | Fetch against the FastAPI backend at the `NEXT_PUBLIC_API_URL` |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout — injects theme CSS variables
│   ├── page.tsx                      # Homepage (marketing landing page)
│   ├── globals.css                   # Global styles — uses CSS custom properties
│   ├── reinstatement/page.tsx        # Reinstatement report generator
│   ├── process-diagnostic/page.tsx   # Multi-step process diagnostic wizard
│   └── local-llm-setup/page.tsx      # Local AI setup guide / configurator
├── components/
│   ├── Navbar.tsx                    # Fixed top navigation with logo.png
│   ├── Hero.tsx                      # Landing hero section
│   ├── Problems.tsx                  # Pain-points section
│   ├── Solutions.tsx                 # Solutions cards section
│   ├── Stats.tsx                     # Stats / social proof section
│   ├── Architecture.tsx              # Architecture diagram section
│   ├── CTASection.tsx                # Call-to-action section
│   ├── ContactForm.tsx               # Contact / lead capture form
│   ├── Footer.tsx                    # Footer
│   └── reinstatement/
│       └── ReportViewer.tsx          # Renders the AI-generated report
└── themes/
    ├── themes.ts                     # Theme definitions (THEME_PURPLE_MAGENTA, THEME_DARK_NEON)
    └── index.ts                      # Active theme export — change ONE line to switch themes
```

---

## Theme System — How It Works

The app uses a **fully modular CSS custom property theme system**. All colors flow from a single source of truth.

### Switching Themes

Open `src/themes/index.ts` and change the import on the last line:

```ts
// ▼▼▼  CHANGE THIS ONE LINE TO SWITCH THE ENTIRE APP THEME  ▼▼▼
import { THEME_PURPLE_MAGENTA } from "./themes"; // ← swap this
export const activeTheme = THEME_PURPLE_MAGENTA;
// ▲▲▲  CHANGE THIS ONE LINE TO SWITCH THE ENTIRE APP THEME  ▲▲▲
```

Available themes:

- `THEME_PURPLE_MAGENTA` — deep purple background + vibrant magenta/violet accents
- `THEME_DARK_NEON` — near-black navy background + electric cyan/indigo accents

### Adding a New Theme

1. Define a new `Theme` object in `src/themes/themes.ts` following the `Theme` interface.
2. Import and set it as `activeTheme` in `src/themes/index.ts`.

### CSS Variable Reference

All themes inject the following CSS variables on `:root` (done in `layout.tsx`):

| Variable                | Usage                                      |
| ----------------------- | ------------------------------------------ |
| `--theme-bg`            | Page background                            |
| `--theme-bg-light`      | Lighter background variant                 |
| `--theme-bg-card`       | Card surface background                    |
| `--theme-accent`        | Primary accent color (hex)                 |
| `--theme-accent-rgb`    | Primary accent as `r, g, b` for `rgba()`   |
| `--theme-accent-light`  | Light variant of primary accent            |
| `--theme-accent-dark`   | Dark variant of primary accent             |
| `--theme-accent2`       | Secondary accent color (hex)               |
| `--theme-accent2-rgb`   | Secondary accent as `r, g, b` for `rgba()` |
| `--theme-accent2-light` | Light variant of secondary accent          |
| `--theme-accent2-dark`  | Dark variant of secondary accent           |
| `--theme-fg`            | Body / foreground text                     |
| `--theme-muted`         | Muted text                                 |
| `--theme-muted-light`   | Light muted text                           |
| `--theme-muted-dark`    | Dark muted text                            |

### Using Theme Colors

**In Tailwind classes** (mapped in `tailwind.config.js`):

```tsx
// Tailwind tokens map to CSS variables automatically
<div className="bg-bg text-fg border-cyan/20 text-cyan" />
```

**In inline styles with rgba**:

```tsx
// Always use the --theme-*-rgb variable for rgba() calls
style={{ background: "rgba(var(--theme-accent-rgb), 0.08)" }}
```

**In globals.css**:

```css
.my-class {
  color: var(--theme-accent);
}
```

> ⚠️ **Never hardcode color hex values or specific rgba channels** like `rgba(220,59,245,...)` in component files. Always use CSS variables so themes work correctly.

---

## Tailwind Configuration

Key color tokens (all backed by CSS variables):

| Token                                  | Maps to                              |
| -------------------------------------- | ------------------------------------ |
| `bg` / `bg-light` / `bg-card`          | Background shades                    |
| `cyan`                                 | Primary accent (`--theme-accent`)    |
| `cyan-light` / `cyan-dark`             | Accent variants                      |
| `purple`                               | Secondary accent (`--theme-accent2`) |
| `purple-light` / `purple-dark`         | Accent2 variants                     |
| `fg`                                   | Foreground text                      |
| `muted` / `muted-light` / `muted-dark` | Muted text hierarchy                 |

Key utility classes from `globals.css`:

- `.glass-card` — glassmorphism card with hover glow
- `.glass-card-elevated` — elevated variant
- `.glow-btn` — primary CTA button
- `.outline-btn` — secondary outline button
- `.pill` — tag / badge chip
- `.form-input` — styled form input
- `.form-label` — form label
- `.gradient-text` — animated gradient text
- `.grid-bg` — subtle dot/grid background
- `.gradient-stripes` — animated diagonal accent stripes
- `.section-divider` — horizontal gradient rule

---

## Coding Conventions

### General

- All components are **Client Components** that need interactivity (`"use client"` at top).
- Static/layout components can be Server Components (no directive needed).
- Use **TypeScript strict mode** — no `any`, properly type all props.
- Use `next/image` for all images — never raw `<img>` tags.
- Use `next/link` for internal navigation — never raw `<a>` with `href`.

### Component Structure

- One component per file, named after the file (PascalCase).
- Shared reusable pieces go in `src/components/`.
- Page-specific sub-components can live in the same file as the page or in a `components/` subfolder next to the page.

### Styling

- Tailwind utility classes are preferred over custom CSS.
- For dynamic inline styles (e.g., computed colors, `radial-gradient`), use the `style={{}}` prop with CSS variables.
- Avoid arbitrary Tailwind values with hardcoded hex colors — use CSS variables inside `[]`.
- The `cn()` utility (if added) should be used for conditional class merging.

### Animations

- Use **Framer Motion** `<motion.div>` for entrance animations.
- Standard entrance pattern: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}` with `viewport={{ once: true }}`.
- CSS animations (defined in `tailwind.config.js` keyframes) are used for continuous effects like aurora drifting, particle shimmer, etc.

### Forms

- Use controlled React state for all form fields.
- Validate at the component level before making API calls.
- Show loading state on submit buttons (`disabled` + spinner).
- Always handle both success and error states visually.

---

## API Integration

The frontend communicates with the FastAPI backend. Use the `NEXT_PUBLIC_API_URL` environment variable as the base URL.

```ts
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/reinstatement/analyze`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  },
);
```

**Environment variables**:

- `NEXT_PUBLIC_API_URL` — Backend URL (e.g., `http://localhost:8000` for local dev)

---

## Pages

### Homepage (`/`)

Marketing landing page composed of sections: `Navbar` → `Hero` → `Problems` → `Solutions` → `Stats` → `Architecture` → `CTASection` → `ContactForm` → `Footer`. Aurora orbs and shimmer particles are generated client-side.

### Reinstatement (`/reinstatement`)

Multi-step form for the Amazon reinstatement report generator. Collects case data, sends to the backend API, displays the formatted report via `ReportViewer`.

### Process Diagnostic (`/process-diagnostic`)

Multi-step wizard (radio-button selections) that collects operational details and generates a diagnostic report. Uses accordion-style step navigation.

### Local AI Setup (`/local-llm-setup`)

Interactive configuration guide for deploying local LLMs. Lets users select use cases, team size, data sensitivity, and hardware tier to receive tailored setup recommendations.

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start dev server
npm run dev
```

App runs at `http://localhost:3000`.

---

## Assets

- Logo: `/public/logo.png` — used in `Navbar.tsx` via `next/image`
- Custom font: `/public/fonts/Gued.woff2` and `/public/fonts/Gued.woff`
- Sample reports: `/public/sample-reports/`

---

## Common Mistakes to Avoid

- ❌ Using raw `rgba(220,59,245,...)` hex values instead of CSS variables — breaks theming.
- ❌ Using `<img>` instead of `next/image` — causes layout shift and missing optimization.
- ❌ Using `<a href="/...">` instead of `next/link` — skips client-side routing.
- ❌ Adding `"use client"` to every file — only add it when needed (event handlers, hooks, browser APIs).
- ❌ Putting page-level business logic directly in `layout.tsx`.
- ❌ Hardcoding the backend URL — always use `process.env.NEXT_PUBLIC_API_URL`.
- ❌ Defining new theme colors in component files — add them to `src/themes/themes.ts`.
