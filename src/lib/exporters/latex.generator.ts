import type { CVDocument } from "@/types/cv.types";
import type { ExportLabels } from "./filter";
import { filterCVForExport } from "./filter";

/**
 * Generates a LaTeX source file (.tex) from the current CV document and
 * triggers a browser download.
 */
export function generateAndDownloadLatex(
  doc: CVDocument,
  labels: ExportLabels,
  filename: string,
): void {
  const filtered = filterCVForExport(doc);
  const latex = buildLatexDocument(filtered, labels);

  const blob = new Blob([latex], { type: "application/x-tex" });
  triggerDownload(blob, filename);
}

function buildLatexDocument(doc: CVDocument, labels: ExportLabels): string {
  const { personalInfo, sections } = doc;
  const lines: string[] = [];

  lines.push("\\documentclass[11pt,a4paper]{article}");
  lines.push("\\usepackage[utf8]{inputenc}");
  lines.push("\\usepackage[T1]{fontenc}");
  lines.push("\\usepackage[margin=1.8cm]{geometry}");
  lines.push("\\usepackage[hidelinks]{hyperref}");
  lines.push("\\usepackage{enumitem}");
  lines.push(
    "\\setlist[itemize]{leftmargin=1.2em, itemsep=0.2em, topsep=0.2em}",
  );
  lines.push("\\setlength{\\parindent}{0pt}");
  lines.push("\\setlength{\\parskip}{0.35em}");
  lines.push("\\begin{document}");

  if (personalInfo.fullName) {
    lines.push(`{\\LARGE \\textbf{${escapeLatex(personalInfo.fullName)}}}\\\\`);
  } else {
    lines.push("{\\LARGE \\textbf{ }}\\\\");
  }

  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ]
    .filter(Boolean)
    .map((value) => escapeLatex(value!))
    .join(" \\textbar{} ");
  if (contactLine) {
    lines.push(contactLine + "\\\\");
  }

  const linksLine = [
    personalInfo.website,
    personalInfo.linkedIn,
    personalInfo.github,
  ]
    .filter(Boolean)
    .map((value) => `\\url{${escapeLatexUrl(value!)}}`)
    .join(" \\textbar{} ");
  if (linksLine) {
    lines.push(linksLine + "\\\\");
  }

  lines.push("\\vspace{0.4em}");
  lines.push("\\hrule");
  lines.push("\\vspace{0.2em}");

  if (personalInfo.summary) {
    lines.push(escapeLatex(personalInfo.summary));
    lines.push("");
  }

  if (sections.experience.visible && sections.experience.items.length > 0) {
    appendSectionTitle(lines, labels.sections.experience);
    for (const item of sections.experience.items) {
      appendRoleRow(
        lines,
        item.role,
        dateRange(item.startDate, item.endDate, item.current, labels.current),
      );
      appendSubline(lines, [item.company, item.location]);
      appendTextBlock(lines, item.summary);
    }
  }

  if (sections.education.visible && sections.education.items.length > 0) {
    appendSectionTitle(lines, labels.sections.education);
    for (const item of sections.education.items) {
      const degreeLabel = [item.degree, item.fieldOfStudy]
        .filter(Boolean)
        .join(" - ");
      appendRoleRow(
        lines,
        degreeLabel || item.institution,
        dateRange(item.startDate, item.endDate, item.current, labels.current),
      );
      appendSubline(lines, [item.institution, item.location]);
      appendTextBlock(lines, item.summary);
    }
  }

  if (sections.skills.visible && sections.skills.items.length > 0) {
    appendSectionTitle(lines, labels.sections.skills);
    const skillText = sections.skills.items
      .map((s) => (s.level ? `${s.name} - ${s.level}` : s.name))
      .join(" ; ");
    lines.push(escapeLatex(skillText));
    lines.push("");
  }

  if (sections.languages.visible && sections.languages.items.length > 0) {
    appendSectionTitle(lines, labels.sections.languages);
    for (const item of sections.languages.items) {
      const langLine = [
        item.name,
        item.proficiency,
        item.details ? `(${item.details})` : "",
      ]
        .filter(Boolean)
        .join(" - ");
      lines.push(escapeLatex(langLine));
    }
    lines.push("");
  }

  if (sections.volunteer.visible && sections.volunteer.items.length > 0) {
    appendSectionTitle(lines, labels.sections.volunteer);
    for (const item of sections.volunteer.items) {
      appendRoleRow(
        lines,
        item.role,
        dateRange(item.startDate, item.endDate, item.current, labels.current),
      );
      appendSubline(lines, [item.organization, item.location]);
      appendTextBlock(lines, item.summary);
    }
  }

  if (sections.projects.visible && sections.projects.items.length > 0) {
    appendSectionTitle(lines, labels.sections.projects);
    for (const item of sections.projects.items) {
      appendRoleRow(
        lines,
        item.name,
        dateRange(item.startDate, item.endDate, item.current, labels.current),
      );
      appendTextBlock(lines, item.role);

      const projectLinks = [item.website, item.github]
        .filter(Boolean)
        .map((value) => `\\url{${escapeLatexUrl(value)}}`)
        .join(" \\textbullet{} ");
      if (projectLinks) {
        lines.push(projectLinks);
      }

      if (item.technologies.length > 0) {
        lines.push(escapeLatex(item.technologies.join(", ")));
      }

      appendTextBlock(lines, item.summary);
    }
  }

  if (sections.extras.visible && sections.extras.items.length > 0) {
    appendSectionTitle(lines, labels.sections.extras);
    for (const item of sections.extras.items) {
      const extraLine = item.value
        ? `${item.title}: ${item.value}`
        : item.title;
      lines.push(`\\textbf{${escapeLatex(extraLine)}}`);
      appendTextBlock(lines, item.details);
    }
  }

  lines.push("\\end{document}");

  return lines.join("\n");
}

function appendSectionTitle(lines: string[], title: string): void {
  lines.push(`\\section*{${escapeLatex(title)}}`);
  lines.push("\\vspace{-0.4em}");
}

function appendRoleRow(lines: string[], role: string, dates: string): void {
  lines.push(
    `\\textbf{${escapeLatex(role)}} \\hfill ${escapeLatex(dates)}\\\\`,
  );
}

function appendSubline(lines: string[], values: string[]): void {
  const text = values.filter(Boolean).join(" - ");
  if (!text) {
    return;
  }
  lines.push(`\\textit{${escapeLatex(text)}}\\\\`);
}

function appendTextBlock(lines: string[], text: string): void {
  if (!text) {
    return;
  }
  lines.push(escapeLatex(text));
}

function dateRange(
  start: string,
  end: string,
  current: boolean,
  currentLabel: string,
): string {
  const from = start || "-";
  const to = current ? currentLabel : end || "-";
  return `${from} - ${to}`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
