export const CV_SCHEMA_VERSION = 1;

export const CV_TEMPLATES = ["classic", "compact", "executive"] as const;
export type CVTemplate = (typeof CV_TEMPLATES)[number];
export const DEFAULT_CV_TEMPLATE: CVTemplate = "classic";

export const CV_SECTION_KEYS = [
  "experience",
  "education",
  "languages",
  "skills",
  "volunteer",
  "projects",
  "extras",
] as const;

export type CVSectionKey = (typeof CV_SECTION_KEYS)[number];

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  photo?: string;
}

export interface CVMetadata {
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface BaseSectionItem {
  id: string;
  visible: boolean;
}

export interface ExperienceItem extends BaseSectionItem {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  highlights: string[];
}

export interface EducationItem extends BaseSectionItem {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
}

export interface LanguageItem extends BaseSectionItem {
  name: string;
  proficiency: string;
  details: string;
}

export interface SkillItem extends BaseSectionItem {
  name: string;
  category: string;
  level: string;
}

export interface VolunteerItem extends BaseSectionItem {
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
}

export interface ProjectItem extends BaseSectionItem {
  name: string;
  role: string;
  website: string;
  github: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary: string;
  technologies: string[];
}

export interface ExtraItem extends BaseSectionItem {
  title: string;
  value: string;
  details: string;
}

export interface SectionState<T extends BaseSectionItem> {
  visible: boolean;
  items: T[];
}

export interface CVSections {
  experience: SectionState<ExperienceItem>;
  education: SectionState<EducationItem>;
  languages: SectionState<LanguageItem>;
  skills: SectionState<SkillItem>;
  volunteer: SectionState<VolunteerItem>;
  projects: SectionState<ProjectItem>;
  extras: SectionState<ExtraItem>;
}

export interface CVDocument {
  id: string;
  template: CVTemplate;
  personalInfo: PersonalInfo;
  sections: CVSections;
  metadata: CVMetadata;
}

export type SectionItemMap = {
  experience: ExperienceItem;
  education: EducationItem;
  languages: LanguageItem;
  skills: SkillItem;
  volunteer: VolunteerItem;
  projects: ProjectItem;
  extras: ExtraItem;
};

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `cv_${Math.random().toString(36).slice(2, 10)}`;
}

function createTimestamp() {
  return new Date().toISOString();
}

function createBaseSectionItem(): BaseSectionItem {
  return {
    id: createId(),
    visible: true,
  };
}

function createSectionState<T extends BaseSectionItem>(): SectionState<T> {
  return {
    visible: true,
    items: [],
  };
}

export function createEmptyPersonalInfo(): PersonalInfo {
  return {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    website: "",
    linkedIn: "",
    github: "",
    photo: "",
  };
}

export function createEmptyExperienceItem(
  overrides: Partial<ExperienceItem> = {},
): ExperienceItem {
  return {
    ...createBaseSectionItem(),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
    highlights: [],
    ...overrides,
  };
}

export function createEmptyEducationItem(
  overrides: Partial<EducationItem> = {},
): EducationItem {
  return {
    ...createBaseSectionItem(),
    institution: "",
    degree: "",
    fieldOfStudy: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
    ...overrides,
  };
}

export function createEmptyLanguageItem(
  overrides: Partial<LanguageItem> = {},
): LanguageItem {
  return {
    ...createBaseSectionItem(),
    name: "",
    proficiency: "",
    details: "",
    ...overrides,
  };
}

export function createEmptySkillItem(
  overrides: Partial<SkillItem> = {},
): SkillItem {
  return {
    ...createBaseSectionItem(),
    name: "",
    category: "",
    level: "",
    ...overrides,
  };
}

export function createEmptyVolunteerItem(
  overrides: Partial<VolunteerItem> = {},
): VolunteerItem {
  return {
    ...createBaseSectionItem(),
    role: "",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
    ...overrides,
  };
}

export function createEmptyProjectItem(
  overrides: Partial<ProjectItem> = {},
): ProjectItem {
  return {
    ...createBaseSectionItem(),
    name: "",
    role: "",
    website: "",
    github: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
    technologies: [],
    ...overrides,
  };
}

export function createEmptyExtraItem(
  overrides: Partial<ExtraItem> = {},
): ExtraItem {
  return {
    ...createBaseSectionItem(),
    title: "",
    value: "",
    details: "",
    ...overrides,
  };
}

export function createEmptySections(): CVSections {
  return {
    experience: createSectionState<ExperienceItem>(),
    education: createSectionState<EducationItem>(),
    languages: createSectionState<LanguageItem>(),
    skills: createSectionState<SkillItem>(),
    volunteer: createSectionState<VolunteerItem>(),
    projects: createSectionState<ProjectItem>(),
    extras: createSectionState<ExtraItem>(),
  };
}

export function createEmptyCVDocument(): CVDocument {
  const timestamp = createTimestamp();

  return {
    id: createId(),
    template: DEFAULT_CV_TEMPLATE,
    personalInfo: createEmptyPersonalInfo(),
    sections: createEmptySections(),
    metadata: {
      createdAt: timestamp,
      updatedAt: timestamp,
      schemaVersion: CV_SCHEMA_VERSION,
    },
  };
}

export function createSectionItem<K extends CVSectionKey>(
  section: K,
  overrides: Partial<SectionItemMap[K]> = {},
): SectionItemMap[K] {
  switch (section) {
    case "experience":
      return createEmptyExperienceItem(
        overrides as Partial<ExperienceItem>,
      ) as SectionItemMap[K];
    case "education":
      return createEmptyEducationItem(
        overrides as Partial<EducationItem>,
      ) as SectionItemMap[K];
    case "languages":
      return createEmptyLanguageItem(
        overrides as Partial<LanguageItem>,
      ) as SectionItemMap[K];
    case "skills":
      return createEmptySkillItem(
        overrides as Partial<SkillItem>,
      ) as SectionItemMap[K];
    case "volunteer":
      return createEmptyVolunteerItem(
        overrides as Partial<VolunteerItem>,
      ) as SectionItemMap[K];
    case "projects":
      return createEmptyProjectItem(
        overrides as Partial<ProjectItem>,
      ) as SectionItemMap[K];
    case "extras":
      return createEmptyExtraItem(
        overrides as Partial<ExtraItem>,
      ) as SectionItemMap[K];
    default:
      throw new Error(`Unsupported section: ${section satisfies never}`);
  }
}

export function createSampleCVDocument(): CVDocument {
  const document = createEmptyCVDocument();

  return {
    ...document,
    personalInfo: {
      fullName: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+55 11 99999-9999",
      location: "Sao Paulo, Brazil",
      summary:
        "Product-minded software engineer focused on frontend architecture, UX quality, and developer experience.",
      website: "https://alexjohnson.dev",
      linkedIn: "https://linkedin.com/in/alexjohnson",
      github: "https://github.com/alexjohnson",
      photo: "",
    },
    sections: {
      experience: {
        visible: true,
        items: [
          createEmptyExperienceItem({
            role: "Senior Frontend Engineer",
            company: "Studio North",
            location: "Remote",
            startDate: "2022-01",
            current: true,
            summary:
              "Led a resume builder redesign with a shared design system and measurable performance gains.",
            highlights: [
              "Reduced preview render time by 34%.",
              "Standardized localization and theme tokens.",
            ],
          }),
        ],
      },
      education: {
        visible: true,
        items: [
          createEmptyEducationItem({
            institution: "Federal University",
            degree: "BSc Computer Science",
            fieldOfStudy: "Software Engineering",
            startDate: "2015-02",
            endDate: "2018-12",
            summary:
              "Focused on distributed systems and human-computer interaction.",
          }),
        ],
      },
      languages: {
        visible: true,
        items: [
          createEmptyLanguageItem({
            name: "English",
            proficiency: "Advanced",
            details: "Professional working proficiency.",
          }),
        ],
      },
      skills: {
        visible: true,
        items: [
          createEmptySkillItem({
            name: "React",
            category: "Frontend",
            level: "Expert",
          }),
        ],
      },
      volunteer: {
        visible: true,
        items: [
          createEmptyVolunteerItem({
            role: "Mentor",
            organization: "Open Source Saturdays",
            startDate: "2023-03",
            current: true,
            summary:
              "Mentor early-career developers on UI architecture and portfolio strategy.",
          }),
        ],
      },
      projects: {
        visible: true,
        items: [
          createEmptyProjectItem({
            name: "CV Generator",
            role: "Creator",
            website: "https://cv-generator.app",
            github: "https://github.com/example/cv-generator",
            startDate: "2026-03",
            current: true,
            summary: "Client-side CV builder with PDF and DOCX export.",
            technologies: ["Next.js", "TypeScript", "Zustand"],
          }),
        ],
      },
      extras: {
        visible: true,
        items: [
          createEmptyExtraItem({
            title: "Availability",
            value: "Open to remote roles",
            details: "Can work across LATAM and EU time zones.",
          }),
        ],
      },
    },
    metadata: {
      ...document.metadata,
      updatedAt: createTimestamp(),
    },
  };
}
