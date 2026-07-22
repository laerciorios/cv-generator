import type {
  CVDocument,
  CVSectionKey,
  CVTemplate,
  ExtraItem,
  LanguageItem,
  SkillItem,
} from "@/types/cv.types";
import type { ExportLabels } from "./filter";
import { filterCVForExport } from "./filter";

/**
 * Format-agnostic export model. buildExportContent owns document traversal,
 * visibility filtering, and section ordering so PDF, DOCX, and LaTeX outputs
 * stay in parity by construction. Renderers only decide separators/styling.
 */

export interface ExportDates {
  start: string;
  end: string;
  current: boolean;
}

export interface ExportEntry {
  id: string;
  /** Joined by the renderer; falls back to titleFallback when all empty. */
  titleParts: string[];
  titleFallback: string;
  dates: ExportDates;
  subtitleParts: string[];
  roleLine: string;
  linkParts: string[];
  technologies: string[];
  body: string;
}

export type ExportSection = { key: CVSectionKey; title: string } & (
  | { kind: "entries"; entries: ExportEntry[] }
  | { kind: "skills"; skills: SkillItem[] }
  | { kind: "languages"; languages: LanguageItem[] }
  | { kind: "extras"; extras: ExtraItem[] }
);

export interface ExportContent {
  template: CVTemplate;
  fullName: string;
  contactParts: string[];
  linkParts: string[];
  summary: string;
  sections: ExportSection[];
  currentLabel: string;
}

/** Shared order for exported sections, mirrored by the preview. */
export const EXPORT_SECTION_ORDER: readonly CVSectionKey[] = [
  "experience",
  "education",
  "skills",
  "languages",
  "volunteer",
  "projects",
  "extras",
];

export function nonEmpty(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value));
}

export function formatDateRange(
  dates: ExportDates,
  currentLabel: string,
  dash = "–",
): string {
  const from = dates.start || dash;
  const to = dates.current ? currentLabel : dates.end || dash;
  return `${from} ${dash} ${to}`;
}

export function entryTitle(entry: ExportEntry, separator = " · "): string {
  return nonEmpty(entry.titleParts).join(separator) || entry.titleFallback;
}

interface DatedItem {
  id: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

function emptyEntry(item: DatedItem): ExportEntry {
  return {
    id: item.id,
    titleParts: [],
    titleFallback: "",
    dates: {
      start: item.startDate,
      end: item.endDate,
      current: item.current,
    },
    subtitleParts: [],
    roleLine: "",
    linkParts: [],
    technologies: [],
    body: "",
  };
}

export function buildExportContent(
  doc: CVDocument,
  labels: ExportLabels,
): ExportContent {
  const { personalInfo, sections, template } = filterCVForExport(doc);

  const sectionBuilders: Record<CVSectionKey, () => ExportSection> = {
    experience: () => ({
      key: "experience",
      kind: "entries",
      title: labels.sections.experience,
      entries: sections.experience.items.map((item) => ({
        ...emptyEntry(item),
        titleParts: [item.role],
        subtitleParts: nonEmpty([item.company, item.location]),
        body: item.summary,
      })),
    }),
    education: () => ({
      key: "education",
      kind: "entries",
      title: labels.sections.education,
      entries: sections.education.items.map((item) => ({
        ...emptyEntry(item),
        titleParts: [item.degree, item.fieldOfStudy],
        titleFallback: item.institution,
        subtitleParts: nonEmpty([item.institution, item.location]),
        body: item.summary,
      })),
    }),
    skills: () => ({
      key: "skills",
      kind: "skills",
      title: labels.sections.skills,
      skills: sections.skills.items,
    }),
    languages: () => ({
      key: "languages",
      kind: "languages",
      title: labels.sections.languages,
      languages: sections.languages.items,
    }),
    volunteer: () => ({
      key: "volunteer",
      kind: "entries",
      title: labels.sections.volunteer,
      entries: sections.volunteer.items.map((item) => ({
        ...emptyEntry(item),
        titleParts: [item.role],
        subtitleParts: nonEmpty([item.organization, item.location]),
        body: item.summary,
      })),
    }),
    projects: () => ({
      key: "projects",
      kind: "entries",
      title: labels.sections.projects,
      entries: sections.projects.items.map((item) => ({
        ...emptyEntry(item),
        titleParts: [item.name],
        roleLine: item.role,
        linkParts: nonEmpty([item.website, item.github]),
        technologies: item.technologies,
        body: item.summary,
      })),
    }),
    extras: () => ({
      key: "extras",
      kind: "extras",
      title: labels.sections.extras,
      extras: sections.extras.items,
    }),
  };

  return {
    template,
    fullName: personalInfo.fullName,
    contactParts: nonEmpty([
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
    ]),
    linkParts: nonEmpty([
      personalInfo.website,
      personalInfo.linkedIn,
      personalInfo.github,
    ]),
    summary: personalInfo.summary ?? "",
    sections: EXPORT_SECTION_ORDER.filter(
      (key) => sections[key].visible && sections[key].items.length > 0,
    ).map((key) => sectionBuilders[key]()),
    currentLabel: labels.current,
  };
}
