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
import { downloadBlob } from "@/lib/download";
import type { CVDocument, CVTemplate } from "@/types/cv.types";
import {
  buildExportContent,
  entryTitle,
  formatDateRange,
  type ExportContent,
  type ExportSection,
} from "./content";
import type { ExportLabels } from "./filter";

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
  headerAlignment: (typeof AlignmentType)[keyof typeof AlignmentType];
  uppercaseName: boolean;
  drawHeadingBorder: boolean;
  lineSeparator: string;
}

const DOCX_TEMPLATE_CONFIGS: Record<CVTemplate, DocxTemplateConfig> = {
  classic: {
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
    uppercaseName: false,
    drawHeadingBorder: true,
    lineSeparator: "  •  ",
  },
  compact: {
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
    uppercaseName: true,
    drawHeadingBorder: true,
    lineSeparator: " | ",
  },
  executive: {
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
    uppercaseName: false,
    drawHeadingBorder: false,
    lineSeparator: "  •  ",
  },
};

/**
 * Generates a DOCX from the CV document using the docx library and triggers a
 * browser download.
 */
export async function generateAndDownloadDOCX(
  doc: CVDocument,
  labels: ExportLabels,
  filename: string,
): Promise<void> {
  const content = buildExportContent(doc, labels);
  const template = DOCX_TEMPLATE_CONFIGS[content.template];

  const children: Paragraph[] = [
    ...headerParagraphs(content, template),
    ...content.sections.flatMap((section) =>
      sectionParagraphs(section, content.currentLabel, template),
    ),
  ];

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
  downloadBlob(blob, filename);
}

function headerParagraphs(
  content: ExportContent,
  template: DocxTemplateConfig,
): Paragraph[] {
  const name = content.fullName || " ";
  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: template.uppercaseName ? name.toUpperCase() : name,
          bold: true,
          size: template.nameSize * 2,
        }),
      ],
      spacing: { after: 60 },
      alignment: template.headerAlignment,
    }),
  ];

  const contactLine = content.contactParts.join(template.lineSeparator);
  if (contactLine) {
    paragraphs.push(
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

  const linkLine = content.linkParts.join(template.lineSeparator);
  if (linkLine) {
    paragraphs.push(
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

  if (content.summary) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: content.summary,
            size: template.summarySize * PT,
          }),
        ],
        spacing: { after: 120 },
        alignment: template.headerAlignment,
      }),
    );
  }

  return paragraphs;
}

function sectionParagraphs(
  section: ExportSection,
  currentLabel: string,
  template: DocxTemplateConfig,
): Paragraph[] {
  const paragraphs: Paragraph[] = [sectionHeading(section.title, template)];

  switch (section.kind) {
    case "entries":
      for (const entry of section.entries) {
        paragraphs.push(
          roleRow(
            entryTitle(entry),
            formatDateRange(entry.dates, currentLabel),
            template,
          ),
        );

        const subtitle = entry.subtitleParts.join(" · ");
        if (subtitle) paragraphs.push(subtitleRow(subtitle, template));
        if (entry.roleLine) {
          paragraphs.push(subtitleRow(entry.roleLine, template));
        }
        const links = entry.linkParts.join("  •  ");
        if (links) paragraphs.push(subtitleRow(links, template));
        if (entry.technologies.length > 0) {
          paragraphs.push(subtitleRow(entry.technologies.join(", "), template));
        }
        if (entry.body) paragraphs.push(bodyRow(entry.body, template));
      }
      break;
    case "skills":
      paragraphs.push(
        bodyRow(
          section.skills
            .map((skill) =>
              skill.level ? `${skill.name} · ${skill.level}` : skill.name,
            )
            .join("    "),
          template,
        ),
      );
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
        paragraphs.push(bodyRow(line, template));
      }
      break;
    case "extras":
      for (const extra of section.extras) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: extra.value
                  ? `${extra.title}: ${extra.value}`
                  : extra.title,
                bold: true,
                size: template.bodySize * PT,
              }),
            ],
            spacing: { before: 80, after: 40 },
          }),
        );
        if (extra.details) {
          paragraphs.push(subtitleRow(extra.details, template));
        }
      }
      break;
  }

  return paragraphs;
}

function sectionHeading(
  title: string,
  template: DocxTemplateConfig,
): Paragraph {
  return new Paragraph({
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
    alignment: AlignmentType.LEFT,
  });
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
