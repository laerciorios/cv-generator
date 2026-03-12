import type { CVDocument } from "@/types/cv.types";
import type { ExportLabels } from "./filter";
import { filterCVForExport } from "./filter";

/**
 * Generates a PDF from the CV document using pdfmake and triggers a browser
 * download. pdfmake and its VFS fonts are loaded dynamically to avoid SSR
 * issues.
 */
export async function generateAndDownloadPDF(
  doc: CVDocument,
  labels: ExportLabels,
  filename: string,
): Promise<void> {
  // Dynamic imports keep pdfmake out of the server bundle.
  const pdfMake = (await import("pdfmake/build/pdfmake")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vfsFonts = (await import("pdfmake/build/vfs_fonts")) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfMake as any).vfs = vfsFonts.default ?? vfsFonts;

  const filtered = filterCVForExport(doc);
  const { personalInfo, sections } = filtered;

  const PAGE_WIDTH = 515; // usable width in points for A4 with 40pt margins

  // Shared styles
  const styles = {
    name: { fontSize: 22, bold: true, marginBottom: 2 },
    contacts: { fontSize: 9, color: "#555555", marginBottom: 2 },
    links: { fontSize: 8, color: "#777777", marginBottom: 6 },
    summary: { fontSize: 10, lineHeight: 1.4, marginBottom: 4 },
    sectionHeading: {
      fontSize: 9,
      bold: true,
      color: "#666666",
      characterSpacing: 1,
      marginTop: 14,
      marginBottom: 2,
    },
    roleTitle: { fontSize: 11, bold: true },
    subtitle: { fontSize: 9, color: "#666666", marginBottom: 2 },
    body: { fontSize: 10, lineHeight: 1.4 },
    skillBadge: { fontSize: 9, color: "#333333" },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any[] = [];

  // --- Header ---
  content.push({ text: personalInfo.fullName || " ", style: "name" });

  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ]
    .filter(Boolean)
    .join(" • ");
  if (contactLine) {
    content.push({ text: contactLine, style: "contacts" });
  }

  const linkLine = [
    personalInfo.website,
    personalInfo.linkedIn,
    personalInfo.github,
  ]
    .filter(Boolean)
    .join("  •  ");
  if (linkLine) {
    content.push({ text: linkLine, style: "links" });
  }

  // Decorative divider after header
  content.push(dividerLine(PAGE_WIDTH));

  if (personalInfo.summary) {
    content.push({
      text: personalInfo.summary,
      style: "summary",
      marginTop: 6,
    });
  }

  // --- Sections (same order as preview) ---

  if (sections.experience.visible && sections.experience.items.length > 0) {
    content.push(sectionHeadingBlock(labels.sections.experience, PAGE_WIDTH));
    for (const item of sections.experience.items) {
      content.push({
        columns: [
          { text: item.role, style: "roleTitle", width: "*" },
          {
            text: dateRange(
              item.startDate,
              item.endDate,
              item.current,
              labels.current,
            ),
            fontSize: 9,
            color: "#666666",
            alignment: "right",
            width: "auto",
          },
        ],
        marginTop: 8,
      });
      const expSub = [item.company, item.location].filter(Boolean).join(" · ");
      if (expSub) {
        content.push({ text: expSub, style: "subtitle" });
      }
      if (item.summary) {
        content.push({ text: item.summary, style: "body" });
      }
    }
  }

  if (sections.education.visible && sections.education.items.length > 0) {
    content.push(sectionHeadingBlock(labels.sections.education, PAGE_WIDTH));
    for (const item of sections.education.items) {
      const degreeLabel = [item.degree, item.fieldOfStudy]
        .filter(Boolean)
        .join(" · ");
      content.push({
        columns: [
          {
            text: degreeLabel || item.institution,
            style: "roleTitle",
            width: "*",
          },
          {
            text: dateRange(
              item.startDate,
              item.endDate,
              item.current,
              labels.current,
            ),
            fontSize: 9,
            color: "#666666",
            alignment: "right",
            width: "auto",
          },
        ],
        marginTop: 8,
      });
      const eduSub = [item.institution, item.location]
        .filter(Boolean)
        .join(" · ");
      if (eduSub) {
        content.push({ text: eduSub, style: "subtitle" });
      }
      if (item.summary) {
        content.push({ text: item.summary, style: "body" });
      }
    }
  }

  if (sections.skills.visible && sections.skills.items.length > 0) {
    content.push(sectionHeadingBlock(labels.sections.skills, PAGE_WIDTH));
    const skillText = sections.skills.items
      .map((s) => (s.level ? `${s.name} · ${s.level}` : s.name))
      .join("    ");
    content.push({ text: skillText, style: "skillBadge", marginTop: 6 });
  }

  if (sections.languages.visible && sections.languages.items.length > 0) {
    content.push(sectionHeadingBlock(labels.sections.languages, PAGE_WIDTH));
    for (const item of sections.languages.items) {
      const langLine = [
        item.name,
        item.proficiency,
        item.details ? `(${item.details})` : "",
      ]
        .filter(Boolean)
        .join(" — ");
      content.push({ text: langLine, style: "body", marginTop: 4 });
    }
  }

  if (sections.volunteer.visible && sections.volunteer.items.length > 0) {
    content.push(sectionHeadingBlock(labels.sections.volunteer, PAGE_WIDTH));
    for (const item of sections.volunteer.items) {
      content.push({
        columns: [
          { text: item.role, style: "roleTitle", width: "*" },
          {
            text: dateRange(
              item.startDate,
              item.endDate,
              item.current,
              labels.current,
            ),
            fontSize: 9,
            color: "#666666",
            alignment: "right",
            width: "auto",
          },
        ],
        marginTop: 8,
      });
      const volSub = [item.organization, item.location]
        .filter(Boolean)
        .join(" · ");
      if (volSub) {
        content.push({ text: volSub, style: "subtitle" });
      }
      if (item.summary) {
        content.push({ text: item.summary, style: "body" });
      }
    }
  }

  if (sections.projects.visible && sections.projects.items.length > 0) {
    content.push(sectionHeadingBlock(labels.sections.projects, PAGE_WIDTH));
    for (const item of sections.projects.items) {
      content.push({
        columns: [
          { text: item.name, style: "roleTitle", width: "*" },
          {
            text: dateRange(
              item.startDate,
              item.endDate,
              item.current,
              labels.current,
            ),
            fontSize: 9,
            color: "#666666",
            alignment: "right",
            width: "auto",
          },
        ],
        marginTop: 8,
      });
      if (item.role) {
        content.push({ text: item.role, style: "subtitle" });
      }
      const projectLinks = [item.website, item.github]
        .filter(Boolean)
        .join("  •  ");
      if (projectLinks) {
        content.push({ text: projectLinks, style: "links" });
      }
      if (item.technologies.length > 0) {
        content.push({
          text: item.technologies.join(", "),
          style: "subtitle",
        });
      }
      if (item.summary) {
        content.push({ text: item.summary, style: "body" });
      }
    }
  }

  if (sections.extras.visible && sections.extras.items.length > 0) {
    content.push(sectionHeadingBlock(labels.sections.extras, PAGE_WIDTH));
    for (const item of sections.extras.items) {
      const extraLine = item.value
        ? `${item.title}: ${item.value}`
        : item.title;
      content.push({
        text: extraLine,
        style: "body",
        bold: true,
        marginTop: 6,
      });
      if (item.details) {
        content.push({ text: item.details, style: "subtitle" });
      }
    }
  }

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40] as [number, number, number, number],
    content,
    styles,
    defaultStyle: { font: "Roboto", fontSize: 10 },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfMake as any).createPdf(docDefinition).download(filename);
}

// --- Helpers ---

function dateRange(
  start: string,
  end: string,
  current: boolean,
  currentLabel: string,
): string {
  const from = start || "–";
  const to = current ? currentLabel : end || "–";
  return `${from} – ${to}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dividerLine(width: number): any {
  return {
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: width,
        y2: 0,
        lineWidth: 0.5,
        lineColor: "#aaaaaa",
      },
    ],
    marginTop: 4,
    marginBottom: 2,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sectionHeadingBlock(title: string, width: number): any[] {
  return [
    {
      text: title.toUpperCase(),
      style: "sectionHeading",
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: width,
          y2: 0,
          lineWidth: 0.5,
          lineColor: "#cccccc",
        },
      ],
      marginBottom: 2,
    },
  ];
}
