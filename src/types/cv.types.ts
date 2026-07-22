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

export type SectionItemMap = {
  experience: ExperienceItem;
  education: EducationItem;
  languages: LanguageItem;
  skills: SkillItem;
  volunteer: VolunteerItem;
  projects: ProjectItem;
  extras: ExtraItem;
};

export type CVSections = {
  [K in CVSectionKey]: SectionState<SectionItemMap[K]>;
};

export interface CVDocument {
  id: string;
  template: CVTemplate;
  personalInfo: PersonalInfo;
  sections: CVSections;
  metadata: CVMetadata;
}
