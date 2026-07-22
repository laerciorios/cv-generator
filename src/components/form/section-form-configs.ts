import type { CVSectionKey, SectionItemMap } from "@/types/cv.types";

export type SectionFieldKind =
  | "text"
  | "textarea"
  | "checkbox"
  | "select"
  | "list";

export interface SectionFieldConfig {
  /** Item property edited by this field. */
  name: string;
  kind: SectionFieldKind;
  /** Spans the full form row instead of a single grid column. */
  fullWidth?: boolean;
  /** Option values for "select" fields, translated via optionsKeyPrefix. */
  options?: readonly string[];
  /** editor namespace prefix for select option labels (incl. ".select"). */
  optionsKeyPrefix?: string;
  /** Disables the field while the item is marked as current. */
  disabledWhenCurrent?: boolean;
}

export interface SectionFormConfig {
  columns: 2 | 3;
  /** editor namespace prefix for field labels (e.g. "experience.role"). */
  labelPrefix: string;
  descriptionKey: string;
  emptyKey: string;
  untitledKey: string;
  /** First non-empty value among these fields becomes the card title. */
  titleFields: readonly string[];
  fields: readonly SectionFieldConfig[];
}

/** Typed view used at definition time so field names stay schema-checked. */
type SectionFormConfigDef<K extends CVSectionKey> = Omit<
  SectionFormConfig,
  "titleFields" | "fields"
> & {
  titleFields: ReadonlyArray<Extract<keyof SectionItemMap[K], string>>;
  fields: ReadonlyArray<
    SectionFieldConfig & { name: Extract<keyof SectionItemMap[K], string> }
  >;
};

const configs: { [K in CVSectionKey]: SectionFormConfigDef<K> } = {
  experience: {
    columns: 2,
    labelPrefix: "experience",
    descriptionKey: "experienceDescription",
    emptyKey: "emptyExperience",
    untitledKey: "untitledExperience",
    titleFields: ["role"],
    fields: [
      { name: "role", kind: "text" },
      { name: "company", kind: "text" },
      { name: "location", kind: "text" },
      { name: "current", kind: "checkbox" },
      { name: "startDate", kind: "text" },
      { name: "endDate", kind: "text", disabledWhenCurrent: true },
      { name: "summary", kind: "textarea", fullWidth: true },
    ],
  },
  education: {
    columns: 2,
    labelPrefix: "education",
    descriptionKey: "educationDescription",
    emptyKey: "emptyEducation",
    untitledKey: "untitledEducation",
    titleFields: ["degree", "institution"],
    fields: [
      { name: "institution", kind: "text" },
      { name: "degree", kind: "text" },
      { name: "fieldOfStudy", kind: "text" },
      { name: "location", kind: "text" },
      { name: "startDate", kind: "text" },
      { name: "endDate", kind: "text", disabledWhenCurrent: true },
      { name: "current", kind: "checkbox", fullWidth: true },
      { name: "summary", kind: "textarea", fullWidth: true },
    ],
  },
  languages: {
    columns: 2,
    labelPrefix: "language",
    descriptionKey: "languagesDescription",
    emptyKey: "emptyLanguages",
    untitledKey: "untitledLanguage",
    titleFields: ["name"],
    fields: [
      { name: "name", kind: "text" },
      {
        name: "proficiency",
        kind: "select",
        options: ["basic", "intermediate", "advanced", "fluent", "native"],
        optionsKeyPrefix: "language.proficiencyOptions",
      },
      { name: "details", kind: "textarea", fullWidth: true },
    ],
  },
  skills: {
    columns: 3,
    labelPrefix: "skill",
    descriptionKey: "skillsDescription",
    emptyKey: "emptySkills",
    untitledKey: "untitledSkill",
    titleFields: ["name"],
    fields: [
      { name: "name", kind: "text" },
      { name: "category", kind: "text" },
      { name: "level", kind: "text" },
    ],
  },
  volunteer: {
    columns: 2,
    labelPrefix: "volunteer",
    descriptionKey: "volunteerDescription",
    emptyKey: "emptyVolunteer",
    untitledKey: "untitledVolunteer",
    titleFields: ["role"],
    fields: [
      { name: "role", kind: "text" },
      { name: "organization", kind: "text" },
      { name: "location", kind: "text" },
      { name: "current", kind: "checkbox" },
      { name: "startDate", kind: "text" },
      { name: "endDate", kind: "text", disabledWhenCurrent: true },
      { name: "summary", kind: "textarea", fullWidth: true },
    ],
  },
  projects: {
    columns: 2,
    labelPrefix: "project",
    descriptionKey: "projectsDescription",
    emptyKey: "emptyProjects",
    untitledKey: "untitledProject",
    titleFields: ["name"],
    fields: [
      { name: "name", kind: "text" },
      { name: "role", kind: "text" },
      { name: "website", kind: "text" },
      { name: "github", kind: "text" },
      { name: "current", kind: "checkbox", fullWidth: true },
      { name: "startDate", kind: "text" },
      { name: "endDate", kind: "text", disabledWhenCurrent: true },
      { name: "technologies", kind: "list", fullWidth: true },
      { name: "summary", kind: "textarea", fullWidth: true },
    ],
  },
  extras: {
    columns: 2,
    labelPrefix: "extra",
    descriptionKey: "extrasDescription",
    emptyKey: "emptyExtras",
    untitledKey: "untitledExtra",
    titleFields: ["title"],
    fields: [
      { name: "title", kind: "text" },
      { name: "value", kind: "text" },
      { name: "details", kind: "textarea", fullWidth: true },
    ],
  },
};

export const SECTION_FORM_CONFIGS: Record<CVSectionKey, SectionFormConfig> =
  configs;
