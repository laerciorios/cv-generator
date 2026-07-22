import type { CVDocument, CVTemplate } from "@/types/cv.types";
import {
  buildExportContent,
  entryTitle,
  formatDateRange,
  type ExportContent,
  type ExportSection,
} from "./content";
import type { ExportLabels } from "./filter";

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

const PDF_TEMPLATE_CONFIGS: Record<CVTemplate, PdfTemplateConfig> = {
  classic: {
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
  },
  compact: {
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
  },
  executive: {
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
  },
};

type PdfContentBlock = Record<string, unknown>;

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

  const content = buildExportContent(doc, labels);
  const template = PDF_TEMPLATE_CONFIGS[content.template];
  const pageWidth = 595.28 - template.pageMargins[0] - template.pageMargins[2];

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

  const blocks: PdfContentBlock[] = [
    ...headerBlocks(content, template, pageWidth),
    ...content.sections.flatMap((section) =>
      sectionBlocks(section, content.currentLabel, template, pageWidth),
    ),
  ];

  const docDefinition = {
    pageSize: "A4",
    pageMargins: template.pageMargins,
    content: blocks,
    styles,
    defaultStyle: { font: "Roboto", fontSize: 10 },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pdfMake as any).createPdf(docDefinition).download(filename);
}

function headerBlocks(
  content: ExportContent,
  template: PdfTemplateConfig,
  pageWidth: number,
): PdfContentBlock[] {
  const blocks: PdfContentBlock[] = [
    {
      text: content.fullName || " ",
      style: "name",
      alignment: template.headerAlignment,
    },
  ];

  const contactLine = content.contactParts.join(template.lineSeparator);
  if (contactLine) {
    blocks.push({
      text: contactLine,
      style: "contacts",
      alignment: template.headerAlignment,
    });
  }

  const linkLine = content.linkParts.join(template.lineSeparator);
  if (linkLine) {
    blocks.push({
      text: linkLine,
      style: "links",
      alignment: template.headerAlignment,
    });
  }

  if (template.drawHeaderDivider) {
    blocks.push(dividerLine(pageWidth, template.dividerColor));
  }

  if (content.summary) {
    blocks.push({
      text: content.summary,
      style: "summary",
      marginTop: 6,
      alignment: template.headerAlignment,
    });
  }

  return blocks;
}

function sectionBlocks(
  section: ExportSection,
  currentLabel: string,
  template: PdfTemplateConfig,
  pageWidth: number,
): PdfContentBlock[] {
  const blocks = sectionHeadingBlock(
    section.title,
    pageWidth,
    template.sectionDividerColor,
    template.sectionHeadingFillColor,
    template.drawSectionDivider,
  );

  switch (section.kind) {
    case "entries":
      for (const entry of section.entries) {
        blocks.push({
          columns: [
            { text: entryTitle(entry), style: "roleTitle", width: "*" },
            {
              text: formatDateRange(entry.dates, currentLabel),
              fontSize: 9,
              color: "#666666",
              alignment: "right",
              width: "auto",
            },
          ],
          marginTop: template.itemTopMargin,
        });

        const subtitle = entry.subtitleParts.join(" · ");
        if (subtitle) {
          blocks.push({ text: subtitle, style: "subtitle" });
        }
        if (entry.roleLine) {
          blocks.push({ text: entry.roleLine, style: "subtitle" });
        }
        const links = entry.linkParts.join("  •  ");
        if (links) {
          blocks.push({ text: links, style: "links" });
        }
        if (entry.technologies.length > 0) {
          blocks.push({
            text: entry.technologies.join(", "),
            style: "subtitle",
          });
        }
        if (entry.body) {
          blocks.push({ text: entry.body, style: "body" });
        }
      }
      break;
    case "skills":
      blocks.push({
        text: section.skills
          .map((skill) =>
            skill.level ? `${skill.name} · ${skill.level}` : skill.name,
          )
          .join("    "),
        style: "skillBadge",
        marginTop: 6,
      });
      break;
    case "languages":
      for (const language of section.languages) {
        const line = [
          language.name,
          language.proficiency,
          language.details ? `(${language.details})` : "",
        ]
          .filter(Boolean)
          .join(" — ");
        blocks.push({ text: line, style: "body", marginTop: 4 });
      }
      break;
    case "extras":
      for (const extra of section.extras) {
        blocks.push({
          text: extra.value ? `${extra.title}: ${extra.value}` : extra.title,
          style: "body",
          bold: true,
          marginTop: 6,
        });
        if (extra.details) {
          blocks.push({ text: extra.details, style: "subtitle" });
        }
      }
      break;
  }

  return blocks;
}

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
