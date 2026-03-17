import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";
import type { CVDocument } from "@/types/cv.types";
import type { CVTemplate } from "@/types/cv.types";
import type { ExportLabels } from "./filter";
import { filterCVForExport } from "./filter";

const PT = 20; // docx uses twentieths of a point (twips). 1pt = 20 twips.

interface DocxTemplateConfig {
  pageMargin: number;
  nameSize: number;
  contactsSize: number;
  linksSize: number;
  summarySize: number;
  sectionHeadingSize: number;
  sectionHeadingColor: string;
  headingBorderColor: string;
  roleSize: number;
  subtitleSize: number;
  bodySize: number;
  spacingBeforeSection: number;
  headerAlignment: AlignmentType;
  sectionHeadingAlignment: AlignmentType;
  uppercaseName: boolean;
  drawHeadingBorder: boolean;
  lineSeparator: string;
}

function getDocxTemplateConfig(template: CVTemplate): DocxTemplateConfig {
  switch (template) {
    case "compact":
      return {
        pageMargin: 620,
        nameSize: 38,
        contactsSize: 8,
        linksSize: 8,
        summarySize: 9,
        sectionHeadingSize: 8,
        sectionHeadingColor: "6b7280",
        headingBorderColor: "d1d5db",
        roleSize: 10,
        subtitleSize: 8,
        bodySize: 9,
        spacingBeforeSection: 220,
        headerAlignment: AlignmentType.LEFT,
        sectionHeadingAlignment: AlignmentType.LEFT,
        uppercaseName: true,
        drawHeadingBorder: true,
        lineSeparator: " | ",
      };
    case "executive":
      return {
        pageMargin: 760,
        nameSize: 48,
        contactsSize: 10,
        linksSize: 9,
        summarySize: 10,
        sectionHeadingSize: 10,
        sectionHeadingColor: "374151",
        headingBorderColor: "6b7280",
        roleSize: 11,
        subtitleSize: 9,
        bodySize: 10,
        spacingBeforeSection: 320,
        headerAlignment: AlignmentType.CENTER,
        sectionHeadingAlignment: AlignmentType.LEFT,
        uppercaseName: false,
        drawHeadingBorder: false,
        lineSeparator: "  •  ",
      };
    case "classic":
    default:
      return {
        pageMargin: 720,
        nameSize: 44,
        contactsSize: 9,
        linksSize: 8,
        summarySize: 10,
        sectionHeadingSize: 9,
        sectionHeadingColor: "666666",
        headingBorderColor: "cccccc",
        roleSize: 11,
        subtitleSize: 9,
        bodySize: 10,
        spacingBeforeSection: 280,
        headerAlignment: AlignmentType.LEFT,
        sectionHeadingAlignment: AlignmentType.LEFT,
        uppercaseName: false,
        drawHeadingBorder: true,
        lineSeparator: "  •  ",
      };
  }
}

/**
 * Generates a DOCX from the CV document using the docx library and triggers a
 * browser download.
 */
export async function generateAndDownloadDOCX(
  doc: CVDocument,
  labels: ExportLabels,
  filename: string,
): Promise<void> {
  const filtered = filterCVForExport(doc);
  const { personalInfo, sections } = filtered;
  const template = getDocxTemplateConfig(filtered.template);

  const children: Paragraph[] = [];

  // --- Header ---
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: formatName(personalInfo.fullName, template),
          bold: true,
          size: template.nameSize * 2,
        }),
      ],
      spacing: { after: 60 },
      alignment: template.headerAlignment,
    }),
  );

  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ]
    .filter(Boolean)
    .join(template.lineSeparator);
  if (contactLine) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactLine,
            size: template.contactsSize * PT,
            color: "555555",
          }),
        ],
        spacing: { after: 40 },
        alignment: template.headerAlignment,
      }),
    );
  }

  const linkLine = [
    personalInfo.website,
    personalInfo.linkedIn,
    personalInfo.github,
  ]
    .filter(Boolean)
    .join(template.lineSeparator);
  if (linkLine) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: linkLine,
            size: template.linksSize * PT,
            color: "888888",
          }),
        ],
        spacing: { after: 60 },
        alignment: template.headerAlignment,
      }),
    );
  }

  if (personalInfo.summary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: template.summarySize * PT,
          }),
        ],
        spacing: { after: 120 },
        alignment: template.headerAlignment,
      }),
    );
  }

  // --- Sections (same order as preview and PDF) ---

  if (sections.experience.visible && sections.experience.items.length > 0) {
    children.push(...sectionHeading(labels.sections.experience, template));
    for (const item of sections.experience.items) {
      children.push(
        roleRow(
          item.role,
          dateRange(item.startDate, item.endDate, item.current, labels.current),
          template,
        ),
      );
      const expSub = [item.company, item.location].filter(Boolean).join(" · ");
      if (expSub) children.push(subtitleRow(expSub, template));
      if (item.summary) children.push(bodyRow(item.summary, template));
    }
  }

  if (sections.education.visible && sections.education.items.length > 0) {
    children.push(...sectionHeading(labels.sections.education, template));
    for (const item of sections.education.items) {
      const degreeLabel =
        [item.degree, item.fieldOfStudy].filter(Boolean).join(" · ") ||
        item.institution;
      children.push(
        roleRow(
          degreeLabel,
          dateRange(item.startDate, item.endDate, item.current, labels.current),
          template,
        ),
      );
      const eduSub = [item.institution, item.location]
        .filter(Boolean)
        .join(" · ");
      if (eduSub) children.push(subtitleRow(eduSub, template));
      if (item.summary) children.push(bodyRow(item.summary, template));
    }
  }

  if (sections.skills.visible && sections.skills.items.length > 0) {
    children.push(...sectionHeading(labels.sections.skills, template));
    const skillText = sections.skills.items
      .map((s) => (s.level ? `${s.name} · ${s.level}` : s.name))
      .join("    ");
    children.push(bodyRow(skillText, template));
  }

  if (sections.languages.visible && sections.languages.items.length > 0) {
    children.push(...sectionHeading(labels.sections.languages, template));
    for (const item of sections.languages.items) {
      const langLine = [
        item.name,
        item.proficiency,
        item.details ? `(${item.details})` : "",
      ]
        .filter(Boolean)
        .join(" — ");
      children.push(bodyRow(langLine, template));
    }
  }

  if (sections.volunteer.visible && sections.volunteer.items.length > 0) {
    children.push(...sectionHeading(labels.sections.volunteer, template));
    for (const item of sections.volunteer.items) {
      children.push(
        roleRow(
          item.role,
          dateRange(item.startDate, item.endDate, item.current, labels.current),
          template,
        ),
      );
      const volSub = [item.organization, item.location]
        .filter(Boolean)
        .join(" · ");
      if (volSub) children.push(subtitleRow(volSub, template));
      if (item.summary) children.push(bodyRow(item.summary, template));
    }
  }

  if (sections.projects.visible && sections.projects.items.length > 0) {
    children.push(...sectionHeading(labels.sections.projects, template));
    for (const item of sections.projects.items) {
      children.push(
        roleRow(
          item.name,
          dateRange(item.startDate, item.endDate, item.current, labels.current),
          template,
        ),
      );
      if (item.role) children.push(subtitleRow(item.role, template));
      const projectLinks = [item.website, item.github]
        .filter(Boolean)
        .join("  •  ");
      if (projectLinks) children.push(subtitleRow(projectLinks, template));
      if (item.technologies.length > 0) {
        children.push(subtitleRow(item.technologies.join(", "), template));
      }
      if (item.summary) children.push(bodyRow(item.summary, template));
    }
  }

  if (sections.extras.visible && sections.extras.items.length > 0) {
    children.push(...sectionHeading(labels.sections.extras, template));
    for (const item of sections.extras.items) {
      const extraLine = item.value
        ? `${item.title}: ${item.value}`
        : item.title;
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: extraLine,
              bold: true,
              size: template.bodySize * PT,
            }),
          ],
          spacing: { before: 80, after: 40 },
        }),
      );
      if (item.details) children.push(subtitleRow(item.details, template));
    }
  }

  const document = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: template.pageMargin,
              right: template.pageMargin,
              bottom: template.pageMargin,
              left: template.pageMargin,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(document);
  triggerDownload(blob, filename);
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

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function sectionHeading(
  title: string,
  template: DocxTemplateConfig,
): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: template.sectionHeadingSize * PT,
          color: template.sectionHeadingColor,
          characterSpacing: 20,
        }),
      ],
      spacing: { before: template.spacingBeforeSection, after: 60 },
      ...(template.drawHeadingBorder
        ? {
            border: {
              bottom: {
                color: template.headingBorderColor,
                space: 4,
                style: BorderStyle.SINGLE,
                size: 4,
              },
            },
          }
        : {}),
      alignment: template.sectionHeadingAlignment,
    }),
  ];
}

/** Role/title on the left, dates right-aligned using a tab stop. */
function roleRow(
  role: string,
  dates: string,
  template: DocxTemplateConfig,
): Paragraph {
  return new Paragraph({
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    children: [
      new TextRun({
        text: role,
        bold: true,
        size: template.roleSize * PT,
      }),
      new TextRun({
        text: "\t" + dates,
        size: template.subtitleSize * PT,
        color: "666666",
      }),
    ],
    spacing: { before: 100, after: 40 },
    alignment: AlignmentType.LEFT,
  });
}

function subtitleRow(text: string, template: DocxTemplateConfig): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: template.subtitleSize * PT,
        color: "666666",
      }),
    ],
    spacing: { after: 40 },
  });
}

function bodyRow(text: string, template: DocxTemplateConfig): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: template.bodySize * PT })],
    spacing: { after: 60 },
  });
}

function formatName(name: string, template: DocxTemplateConfig): string {
  const safeName = name || " ";
  return template.uppercaseName ? safeName.toUpperCase() : safeName;
}
