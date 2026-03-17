import type { CVDocument } from "@/types/cv.types";
import type { CVTemplate } from "@/types/cv.types";
import type { ExportLabels } from "./filter";
import { filterCVForExport } from "./filter";

interface PdfTemplateConfig {
  pageMargins: [number, number, number, number];
  nameSize: number;
  contactsSize: number;
  linksSize: number;
  summarySize: number;
  sectionHeadingSize: number;
  sectionHeadingColor: string;
  sectionHeadingTracking: number;
  sectionHeadingFillColor: string | null;
  roleTitleSize: number;
  subtitleSize: number;
  bodySize: number;
  skillSize: number;
  sectionMarginTop: number;
  dividerColor: string;
  sectionDividerColor: string;
  lineSeparator: string;
  headerAlignment: "left" | "center";
  drawHeaderDivider: boolean;
  drawSectionDivider: boolean;
  itemTopMargin: number;
}

function getPdfTemplateConfig(template: CVTemplate): PdfTemplateConfig {
  switch (template) {
    case "compact":
      return {
        pageMargins: [34, 34, 34, 34],
        nameSize: 20,
        contactsSize: 8,
        linksSize: 8,
        summarySize: 9,
        sectionHeadingSize: 8,
        sectionHeadingColor: "#6b7280",
        sectionHeadingTracking: 1.6,
        sectionHeadingFillColor: null,
        roleTitleSize: 10,
        subtitleSize: 8,
        bodySize: 9,
        skillSize: 8,
        sectionMarginTop: 10,
        dividerColor: "#d1d5db",
        sectionDividerColor: "#d1d5db",
        lineSeparator: " | ",
        headerAlignment: "left",
        drawHeaderDivider: false,
        drawSectionDivider: true,
        itemTopMargin: 6,
      };
    case "executive":
      return {
        pageMargins: [44, 44, 44, 44],
        nameSize: 24,
        contactsSize: 10,
        linksSize: 9,
        summarySize: 10,
        sectionHeadingSize: 10,
        sectionHeadingColor: "#ffffff",
        sectionHeadingTracking: 1.2,
        sectionHeadingFillColor: "#1f2937",
        roleTitleSize: 11,
        subtitleSize: 9,
        bodySize: 10,
        skillSize: 9,
        sectionMarginTop: 16,
        dividerColor: "#4b5563",
        sectionDividerColor: "#6b7280",
        lineSeparator: " • ",
        headerAlignment: "center",
        drawHeaderDivider: true,
        drawSectionDivider: false,
        itemTopMargin: 9,
      };
    case "classic":
    default:
      return {
        pageMargins: [40, 40, 40, 40],
        nameSize: 22,
        contactsSize: 9,
        linksSize: 8,
        summarySize: 10,
        sectionHeadingSize: 9,
        sectionHeadingColor: "#666666",
        sectionHeadingTracking: 1,
        sectionHeadingFillColor: null,
        roleTitleSize: 11,
        subtitleSize: 9,
        bodySize: 10,
        skillSize: 9,
        sectionMarginTop: 14,
        dividerColor: "#aaaaaa",
        sectionDividerColor: "#cccccc",
        lineSeparator: " • ",
        headerAlignment: "left",
        drawHeaderDivider: true,
        drawSectionDivider: true,
        itemTopMargin: 8,
      };
  }
}

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
  const template = getPdfTemplateConfig(filtered.template);

  const PAGE_WIDTH = 595.28 - template.pageMargins[0] - template.pageMargins[2];

  // Shared styles
  const styles = {
    name: { fontSize: template.nameSize, bold: true, marginBottom: 2 },
    contacts: {
      fontSize: template.contactsSize,
      color: "#555555",
      marginBottom: 2,
    },
    links: { fontSize: template.linksSize, color: "#777777", marginBottom: 6 },
    summary: {
      fontSize: template.summarySize,
      lineHeight: 1.4,
      marginBottom: 4,
    },
    sectionHeading: {
      fontSize: template.sectionHeadingSize,
      bold: true,
      color: template.sectionHeadingColor,
      characterSpacing: template.sectionHeadingTracking,
      marginTop: template.sectionMarginTop,
      marginBottom: 2,
    },
    roleTitle: { fontSize: template.roleTitleSize, bold: true },
    subtitle: {
      fontSize: template.subtitleSize,
      color: "#666666",
      marginBottom: 2,
    },
    body: { fontSize: template.bodySize, lineHeight: 1.4 },
    skillBadge: { fontSize: template.skillSize, color: "#333333" },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any[] = [];

  // --- Header ---
  content.push({
    text: personalInfo.fullName || " ",
    style: "name",
    alignment: template.headerAlignment,
  });

  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ]
    .filter(Boolean)
    .join(template.lineSeparator);
  if (contactLine) {
    content.push({
      text: contactLine,
      style: "contacts",
      alignment: template.headerAlignment,
    });
  }

  const linkLine = [
    personalInfo.website,
    personalInfo.linkedIn,
    personalInfo.github,
  ]
    .filter(Boolean)
    .join(template.lineSeparator);
  if (linkLine) {
    content.push({
      text: linkLine,
      style: "links",
      alignment: template.headerAlignment,
    });
  }

  // Decorative divider after header
  if (template.drawHeaderDivider) {
    content.push(dividerLine(PAGE_WIDTH, template.dividerColor));
  }

  if (personalInfo.summary) {
    content.push({
      text: personalInfo.summary,
      style: "summary",
      marginTop: 6,
      alignment: template.headerAlignment,
    });
  }

  // --- Sections (same order as preview) ---

  if (sections.experience.visible && sections.experience.items.length > 0) {
    content.push(
      sectionHeadingBlock(
        labels.sections.experience,
        PAGE_WIDTH,
        template.sectionDividerColor,
        template.sectionHeadingFillColor,
        template.drawSectionDivider,
      ),
    );
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
        marginTop: template.itemTopMargin,
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
    content.push(
      sectionHeadingBlock(
        labels.sections.education,
        PAGE_WIDTH,
        template.sectionDividerColor,
        template.sectionHeadingFillColor,
        template.drawSectionDivider,
      ),
    );
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
        marginTop: template.itemTopMargin,
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
    content.push(
      sectionHeadingBlock(
        labels.sections.skills,
        PAGE_WIDTH,
        template.sectionDividerColor,
        template.sectionHeadingFillColor,
        template.drawSectionDivider,
      ),
    );
    const skillText = sections.skills.items
      .map((s) => (s.level ? `${s.name} · ${s.level}` : s.name))
      .join("    ");
    content.push({ text: skillText, style: "skillBadge", marginTop: 6 });
  }

  if (sections.languages.visible && sections.languages.items.length > 0) {
    content.push(
      sectionHeadingBlock(
        labels.sections.languages,
        PAGE_WIDTH,
        template.sectionDividerColor,
        template.sectionHeadingFillColor,
        template.drawSectionDivider,
      ),
    );
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
    content.push(
      sectionHeadingBlock(
        labels.sections.volunteer,
        PAGE_WIDTH,
        template.sectionDividerColor,
        template.sectionHeadingFillColor,
        template.drawSectionDivider,
      ),
    );
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
        marginTop: template.itemTopMargin,
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
    content.push(
      sectionHeadingBlock(
        labels.sections.projects,
        PAGE_WIDTH,
        template.sectionDividerColor,
        template.sectionHeadingFillColor,
        template.drawSectionDivider,
      ),
    );
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
        marginTop: template.itemTopMargin,
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
    content.push(
      sectionHeadingBlock(
        labels.sections.extras,
        PAGE_WIDTH,
        template.sectionDividerColor,
        template.sectionHeadingFillColor,
        template.drawSectionDivider,
      ),
    );
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
    pageMargins: template.pageMargins,
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

type PdfContentBlock = Record<string, unknown>;

function dividerLine(width: number, color: string): PdfContentBlock {
  return {
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: width,
        y2: 0,
        lineWidth: 0.5,
        lineColor: color,
      },
    ],
    marginTop: 4,
    marginBottom: 2,
  };
}

function sectionHeadingBlock(
  title: string,
  width: number,
  color: string,
  fillColor: string | null,
  drawDivider: boolean,
): PdfContentBlock[] {
  const heading = {
    text: title.toUpperCase(),
    style: "sectionHeading",
    ...(fillColor ? { fillColor, color: "#ffffff", margin: [3, 2, 3, 2] } : {}),
  };

  const blocks: PdfContentBlock[] = [heading];

  if (drawDivider) {
    blocks.push({
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: width,
          y2: 0,
          lineWidth: 0.5,
          lineColor: color,
        },
      ],
      marginBottom: 2,
    });
  }

  return blocks;
}
