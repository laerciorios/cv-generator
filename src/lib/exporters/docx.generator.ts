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
import type { ExportLabels } from "./filter";
import { filterCVForExport } from "./filter";

const PT = 20; // docx uses twentieths of a point (twips). 1pt = 20 twips.

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

  const children: Paragraph[] = [];

  // --- Header ---
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: personalInfo.fullName || " ",
          bold: true,
          size: 44 * 2,
        }),
      ],
      spacing: { after: 60 },
    }),
  );

  const contactLine = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ]
    .filter(Boolean)
    .join("  •  ");
  if (contactLine) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: contactLine, size: 9 * PT, color: "555555" }),
        ],
        spacing: { after: 40 },
      }),
    );
  }

  const linkLine = [
    personalInfo.website,
    personalInfo.linkedIn,
    personalInfo.github,
  ]
    .filter(Boolean)
    .join("  •  ");
  if (linkLine) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: linkLine, size: 8 * PT, color: "888888" }),
        ],
        spacing: { after: 60 },
      }),
    );
  }

  if (personalInfo.summary) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: personalInfo.summary, size: 10 * PT })],
        spacing: { after: 120 },
      }),
    );
  }

  // --- Sections (same order as preview and PDF) ---

  if (sections.experience.visible && sections.experience.items.length > 0) {
    children.push(...sectionHeading(labels.sections.experience));
    for (const item of sections.experience.items) {
      children.push(
        roleRow(
          item.role,
          dateRange(item.startDate, item.endDate, item.current, labels.current),
        ),
      );
      const expSub = [item.company, item.location].filter(Boolean).join(" · ");
      if (expSub) children.push(subtitleRow(expSub));
      if (item.summary) children.push(bodyRow(item.summary));
    }
  }

  if (sections.education.visible && sections.education.items.length > 0) {
    children.push(...sectionHeading(labels.sections.education));
    for (const item of sections.education.items) {
      const degreeLabel =
        [item.degree, item.fieldOfStudy].filter(Boolean).join(" · ") ||
        item.institution;
      children.push(
        roleRow(
          degreeLabel,
          dateRange(item.startDate, item.endDate, item.current, labels.current),
        ),
      );
      const eduSub = [item.institution, item.location]
        .filter(Boolean)
        .join(" · ");
      if (eduSub) children.push(subtitleRow(eduSub));
      if (item.summary) children.push(bodyRow(item.summary));
    }
  }

  if (sections.skills.visible && sections.skills.items.length > 0) {
    children.push(...sectionHeading(labels.sections.skills));
    const skillText = sections.skills.items
      .map((s) => (s.level ? `${s.name} · ${s.level}` : s.name))
      .join("    ");
    children.push(bodyRow(skillText));
  }

  if (sections.languages.visible && sections.languages.items.length > 0) {
    children.push(...sectionHeading(labels.sections.languages));
    for (const item of sections.languages.items) {
      const langLine = [
        item.name,
        item.proficiency,
        item.details ? `(${item.details})` : "",
      ]
        .filter(Boolean)
        .join(" — ");
      children.push(bodyRow(langLine));
    }
  }

  if (sections.volunteer.visible && sections.volunteer.items.length > 0) {
    children.push(...sectionHeading(labels.sections.volunteer));
    for (const item of sections.volunteer.items) {
      children.push(
        roleRow(
          item.role,
          dateRange(item.startDate, item.endDate, item.current, labels.current),
        ),
      );
      const volSub = [item.organization, item.location]
        .filter(Boolean)
        .join(" · ");
      if (volSub) children.push(subtitleRow(volSub));
      if (item.summary) children.push(bodyRow(item.summary));
    }
  }

  if (sections.projects.visible && sections.projects.items.length > 0) {
    children.push(...sectionHeading(labels.sections.projects));
    for (const item of sections.projects.items) {
      children.push(
        roleRow(
          item.name,
          dateRange(item.startDate, item.endDate, item.current, labels.current),
        ),
      );
      if (item.role) children.push(subtitleRow(item.role));
      const projectLinks = [item.website, item.github]
        .filter(Boolean)
        .join("  •  ");
      if (projectLinks) children.push(subtitleRow(projectLinks));
      if (item.technologies.length > 0) {
        children.push(subtitleRow(item.technologies.join(", ")));
      }
      if (item.summary) children.push(bodyRow(item.summary));
    }
  }

  if (sections.extras.visible && sections.extras.items.length > 0) {
    children.push(...sectionHeading(labels.sections.extras));
    for (const item of sections.extras.items) {
      const extraLine = item.value
        ? `${item.title}: ${item.value}`
        : item.title;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: extraLine, bold: true, size: 10 * PT }),
          ],
          spacing: { before: 80, after: 40 },
        }),
      );
      if (item.details) children.push(subtitleRow(item.details));
    }
  }

  const document = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch margins
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

function sectionHeading(title: string): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 9 * PT,
          color: "666666",
          characterSpacing: 20,
        }),
      ],
      spacing: { before: 280, after: 60 },
      border: {
        bottom: {
          color: "cccccc",
          space: 4,
          style: BorderStyle.SINGLE,
          size: 4,
        },
      },
    }),
  ];
}

/** Role/title on the left, dates right-aligned using a tab stop. */
function roleRow(role: string, dates: string): Paragraph {
  return new Paragraph({
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    children: [
      new TextRun({ text: role, bold: true, size: 11 * PT }),
      new TextRun({ text: "\t" + dates, size: 9 * PT, color: "666666" }),
    ],
    spacing: { before: 100, after: 40 },
    alignment: AlignmentType.LEFT,
  });
}

function subtitleRow(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 9 * PT, color: "666666" })],
    spacing: { after: 40 },
  });
}

function bodyRow(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 10 * PT })],
    spacing: { after: 60 },
  });
}
