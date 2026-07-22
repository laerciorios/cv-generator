import { downloadBlob } from "@/lib/download";
import type { CVDocument } from "@/types/cv.types";
import {
  buildExportContent,
  formatDateRange,
  nonEmpty,
  type ExportContent,
  type ExportEntry,
  type ExportSection,
} from "./content";
import type { ExportLabels } from "./filter";

/**
 * Generates a LaTeX source file (.tex) from the current CV document and
 * triggers a browser download.
 */
export function generateAndDownloadLatex(
  doc: CVDocument,
  labels: ExportLabels,
  filename: string,
): void {
  const content = buildExportContent(doc, labels);
  const latex = renderLatexDocument(content);

  downloadBlob(new Blob([latex], { type: "application/x-tex" }), filename);
}

function renderLatexDocument(content: ExportContent): string {
  const lines: string[] = [
    "\\documentclass[11pt,a4paper]{article}",
    "\\usepackage[utf8]{inputenc}",
    "\\usepackage[T1]{fontenc}",
    "\\usepackage[margin=1.8cm]{geometry}",
    "\\usepackage[hidelinks]{hyperref}",
    "\\usepackage{enumitem}",
    "\\setlist[itemize]{leftmargin=1.2em, itemsep=0.2em, topsep=0.2em}",
    "\\setlength{\\parindent}{0pt}",
    "\\setlength{\\parskip}{0.35em}",
    "\\begin{document}",
  ];

  appendHeader(lines, content);

  for (const section of content.sections) {
    appendSection(lines, section, content.currentLabel);
  }

  lines.push("\\end{document}");

  return lines.join("\n");
}

function appendHeader(lines: string[], content: ExportContent): void {
  lines.push(`{\\LARGE \\textbf{${escapeLatex(content.fullName) || " "}}}\\\\`);

  const contactLine = content.contactParts
    .map(escapeLatex)
    .join(" \\textbar{} ");
  if (contactLine) {
    lines.push(contactLine + "\\\\");
  }

  const linksLine = content.linkParts
    .map((value) => `\\url{${escapeLatexUrl(value)}}`)
    .join(" \\textbar{} ");
  if (linksLine) {
    lines.push(linksLine + "\\\\");
  }

  lines.push("\\vspace{0.4em}");
  lines.push("\\hrule");
  lines.push("\\vspace{0.2em}");

  if (content.summary) {
    lines.push(escapeLatex(content.summary));
    lines.push("");
  }
}

function appendSection(
  lines: string[],
  section: ExportSection,
  currentLabel: string,
): void {
  lines.push(`\\section*{${escapeLatex(section.title)}}`);
  lines.push("\\vspace{-0.4em}");

  switch (section.kind) {
    case "entries":
      for (const entry of section.entries) {
        appendEntry(lines, entry, currentLabel);
      }
      break;
    case "skills":
      lines.push(
        escapeLatex(
          section.skills
            .map((skill) =>
              skill.level ? `${skill.name} - ${skill.level}` : skill.name,
            )
            .join(" ; "),
        ),
      );
      lines.push("");
      break;
    case "languages":
      for (const language of section.languages) {
        const line = [
          language.name,
          language.proficiency,
          language.details ? `(${language.details})` : "",
        ]
          .filter(Boolean)
          .join(" - ");
        lines.push(escapeLatex(line));
      }
      lines.push("");
      break;
    case "extras":
      for (const extra of section.extras) {
        const line = extra.value
          ? `${extra.title}: ${extra.value}`
          : extra.title;
        lines.push(`\\textbf{${escapeLatex(line)}}`);
        if (extra.details) {
          lines.push(escapeLatex(extra.details));
        }
      }
      break;
  }
}

function appendEntry(
  lines: string[],
  entry: ExportEntry,
  currentLabel: string,
): void {
  const title = nonEmpty(entry.titleParts).join(" - ") || entry.titleFallback;
  const dates = formatDateRange(entry.dates, currentLabel, "-");
  lines.push(
    `\\textbf{${escapeLatex(title)}} \\hfill ${escapeLatex(dates)}\\\\`,
  );

  const subtitle = entry.subtitleParts.join(" - ");
  if (subtitle) {
    lines.push(`\\textit{${escapeLatex(subtitle)}}\\\\`);
  }

  if (entry.roleLine) {
    lines.push(escapeLatex(entry.roleLine));
  }

  const links = entry.linkParts
    .map((value) => `\\url{${escapeLatexUrl(value)}}`)
    .join(" \\textbullet{} ");
  if (links) {
    lines.push(links);
  }

  if (entry.technologies.length > 0) {
    lines.push(escapeLatex(entry.technologies.join(", ")));
  }

  if (entry.body) {
    lines.push(escapeLatex(entry.body));
  }
}

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([{}$&#_%])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function escapeLatexUrl(text: string): string {
  return text.replace(/\\/g, "\\textbackslash{}");
}
