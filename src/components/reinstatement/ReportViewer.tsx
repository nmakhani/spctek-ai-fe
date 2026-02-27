"use client";

import { motion } from "framer-motion";

interface ReportViewerProps {
  report: string;
  onBack: () => void;
}

/**
 * Renders the AI-generated markdown report with styled sections.
 * Parses markdown headings, tables, bold, italic, and lists.
 */
export default function ReportViewer({ report, onBack }: ReportViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <button onClick={onBack} className="outline-btn text-sm">
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
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          New Assessment
        </button>
        <button
          onClick={() => {
            const blob = new Blob([report], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Reinstatement_Report.md";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="outline-btn text-sm"
        >
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
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Download Report
        </button>
      </div>

      {/* Report content */}
      <div className="glass-card-elevated p-8 md:p-10">
        <div className="report-content prose-invert">
          <MarkdownRenderer content={report} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Minimal markdown → JSX renderer ─── */

function MarkdownRenderer({ content }: { content: string }) {
  // Strip code fences
  let text = content
    .replace(/^```[a-z]*\n?/gm, "")
    .replace(/\n?```$/gm, "")
    .trim();

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed)) {
      elements.push(<hr key={i} className="border-white/[0.06] my-6" />);
      i++;
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = stripBold(headingMatch[2]);
      if (level <= 2) {
        elements.push(
          <h2 key={i} className="text-lg font-bold text-white mt-8 mb-3">
            <InlineFormatted text={headingText} />
          </h2>,
        );
      } else if (level === 3) {
        elements.push(
          <h3 key={i} className="text-base font-bold text-slate-200 mt-6 mb-2">
            <InlineFormatted text={headingText} />
          </h3>,
        );
      } else {
        elements.push(
          <h4 key={i} className="text-sm font-bold text-slate-300 mt-4 mb-2">
            <InlineFormatted text={headingText} />
          </h4>,
        );
      }
      i++;
      continue;
    }

    // Table
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      elements.push(<MdTable key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    // Bullet list item (*, -, •)
    if (/^[*•\-]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (/^[*•\-]\s+/.test(l)) {
          items.push(l.replace(/^[*•\-]\s+/, ""));
          i++;
        } else if (/^\s{2,}[*•\-]\s+/.test(lines[i])) {
          // sub-bullet, merge into last item
          items[items.length - 1] +=
            "\n" + lines[i].replace(/^\s+[*•\-]\s+/, "  → ");
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-2 mb-4 ml-1">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex gap-2 text-sm text-slate-300 leading-relaxed"
            >
              <span className="text-cyan mt-0.5 shrink-0">•</span>
              <span>
                <InlineFormatted text={item} />
              </span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: { num: string; text: string }[] = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        const numMatch = l.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          items.push({ num: numMatch[1], text: numMatch[2] });
          i++;
        } else if (/^\s{2,}/.test(lines[i]) && items.length) {
          items[items.length - 1].text += " " + lines[i].trim();
          i++;
        } else {
          break;
        }
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 mb-4 ml-1">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex gap-2 text-sm text-slate-300 leading-relaxed"
            >
              <span className="text-cyan font-bold shrink-0">{item.num}.</span>
              <span>
                <InlineFormatted text={item.text} />
              </span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="text-sm text-slate-300 leading-relaxed mb-3">
        <InlineFormatted text={trimmed} />
      </p>,
    );
    i++;
  }

  return <>{elements}</>;
}

/* ─── Inline formatting: bold & italic ─── */

function InlineFormatted({ text }: { text: string }) {
  // Split by **bold** and *italic* patterns
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold match
    const boldIdx = remaining.indexOf("**");
    if (boldIdx !== -1) {
      const endIdx = remaining.indexOf("**", boldIdx + 2);
      if (endIdx !== -1) {
        if (boldIdx > 0) parts.push(remaining.slice(0, boldIdx));
        parts.push(
          <strong key={key++} className="text-white font-semibold">
            {remaining.slice(boldIdx + 2, endIdx)}
          </strong>,
        );
        remaining = remaining.slice(endIdx + 2);
        continue;
      }
    }

    // Italic match
    const italicIdx = remaining.indexOf("*");
    if (italicIdx !== -1) {
      const endIdx = remaining.indexOf("*", italicIdx + 1);
      if (endIdx !== -1) {
        if (italicIdx > 0) parts.push(remaining.slice(0, italicIdx));
        parts.push(
          <em key={key++} className="text-slate-200 italic">
            {remaining.slice(italicIdx + 1, endIdx)}
          </em>,
        );
        remaining = remaining.slice(endIdx + 1);
        continue;
      }
    }

    // No more formatting
    parts.push(remaining);
    break;
  }

  return <>{parts}</>;
}

/* ─── Table renderer ─── */

function MdTable({ lines }: { lines: string[] }) {
  const rows: string[][] = [];
  for (const line of lines) {
    // Skip separator rows
    if (/^\|[\s\-:|]+\|$/.test(line)) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c !== "");
    if (cells.length) rows.push(cells);
  }

  if (rows.length < 2) return null;

  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div className="overflow-x-auto mb-6 mt-4 rounded-xl border border-white/[0.06]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-white/[0.04]">
            {header.map((cell, idx) => (
              <th
                key={idx}
                className="text-left px-4 py-3 text-xs font-bold text-cyan tracking-wide"
              >
                {stripBold(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rIdx) => (
            <tr
              key={rIdx}
              className="border-t border-white/[0.04] even:bg-white/[0.02]"
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-2.5 text-slate-300">
                  <CellContent value={stripBold(cell)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CellContent({ value }: { value: string }) {
  const lower = value.toLowerCase();
  if (lower === "yes") {
    return <span className="text-green font-semibold">Yes</span>;
  }
  if (lower === "no") {
    return <span className="text-rose font-semibold">No</span>;
  }
  return <>{value}</>;
}

/* ─── Helpers ─── */

function stripBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
}
