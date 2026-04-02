"use client";

import { motion } from "framer-motion";

interface ReportViewerProps {
  report: string;
  onBack: () => void;
}

/**
 * Displays limited sections of the reinstatement report on the page.
 * Full report is sent via email as PDF for security.
 */
export default function ReportViewer({ report, onBack }: ReportViewerProps) {
  // Extract sections 1 and 5 from the report
  const section1 = extractSection(report, 1);
  const section5 = extractSection(report, 5);

  // Fallback: if section parsing fails show the first portion of the report
  const previewContent = section1 || report.split("\n").slice(0, 50).join("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Action bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
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
        <div className="text-center text-xs text-slate-400">
          📧 Full report sent to your email as PDF
        </div>
      </div>

      {/* Report content - visible sections */}
      <div className="glass-card-elevated p-8 md:p-10 space-y-8">
        {previewContent && (
          <div className="report-section">
            <MarkdownRenderer content={previewContent} />
          </div>
        )}

        {section5 && section1 && (
          <div className="report-section">
            <MarkdownRenderer content={section5} />
          </div>
        )}

        {/* Locked premium sections */}
        <div className="relative mt-12 pt-8 border-t border-white/[0.06]">
          <div
            className="blur-sm select-none pointer-events-none opacity-50"
            style={{ filter: "blur(8px)" }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-2">
                  Root Cause Identification
                </h3>
                <p className="text-sm text-slate-300">
                  [Premium content - see full report in email]
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-2">
                  Required Documents
                </h3>
                <p className="text-sm text-slate-300">
                  [Premium content - see full report in email]
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-2">
                  Document Comparison
                </h3>
                <p className="text-sm text-slate-300">
                  [Premium content - see full report in email]
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-2">
                  Recommended Steps for Reinstatement
                </h3>
                <p className="text-sm text-slate-300">
                  [Premium content - see full report in email]
                </p>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200 mb-2">
                  Final Summary
                </h3>
                <p className="text-sm text-slate-300">
                  [Premium content - see full report in email]
                </p>
              </div>
            </div>
          </div>

          {/* Padlock overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg px-6 py-4 text-center">
              <svg
                className="w-8 h-8 text-cyan mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1L9 4H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3h-4l-3-3z" />
              </svg>
              <p className="text-sm font-semibold text-cyan mb-1">
                Full Report in Your Email
              </p>
              <p className="text-xs text-slate-400">
                Complete analysis, documents checklist, and action steps sent to
                your inbox as PDF
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Extract a numbered section from the markdown report.
 * Returns the section heading and its content until the next section.
 */
function extractSection(report: string, sectionNum: number): string {
  const lines = report.split("\n");
  let startIdx = -1;
  let endIdx = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for section header like "### **1." or "## 1." or "**1." or plain "1."
    if (
      new RegExp(`^#+\\s*\\*?\\*?${sectionNum}\.`).test(line) ||
      new RegExp(`^\\*\\*${sectionNum}\.`).test(line) ||
      new RegExp(`^${sectionNum}\.\\s+[A-Z]`).test(line)
    ) {
      startIdx = i;
    }

    // If we found the start, look for the next section
    if (startIdx !== -1 && i > startIdx) {
      const nextSectionMatch = line.match(/^#+\s*\*?\*?(\d+)\./);
      if (nextSectionMatch && parseInt(nextSectionMatch[1]) > sectionNum) {
        endIdx = i;
        break;
      }
    }
  }

  if (startIdx === -1) return "";

  return lines.slice(startIdx, endIdx).join("\n");
}

/* ─── Minimal markdown → JSX renderer ─── */

function MarkdownRenderer({ content }: { content: string }) {
  // Strip code fences
  const text = content
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
