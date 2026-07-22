import {
  CV_SCHEMA_VERSION,
  CV_SECTION_KEYS,
  DEFAULT_CV_TEMPLATE,
  type BaseSectionItem,
  type CVDocument,
  type CVSectionKey,
  type CVSections,
  type PersonalInfo,
  type SectionItemMap,
} from "@/types/cv.types";

function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  // Fallback must stay UUID-shaped so ids always pass schema validation.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.trunc(Math.random() * 16);
    const value = char === "x" ? random : (random % 4) + 8;
    return value.toString(16);
  });
}

function createTimestamp(): string {
  return new Date().toISOString();
}

type SectionItemDefaults = {
  [K in CVSectionKey]: () => Omit<SectionItemMap[K], keyof BaseSectionItem>;
};

const sectionItemDefaults: SectionItemDefaults = {
  experience: () => ({
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
    highlights: [],
  }),
  education: () => ({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
  }),
  languages: () => ({
    name: "",
    proficiency: "",
    details: "",
  }),
  skills: () => ({
    name: "",
    category: "",
    level: "",
  }),
  volunteer: () => ({
    role: "",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
  }),
  projects: () => ({
    name: "",
    role: "",
    website: "",
    github: "",
    startDate: "",
    endDate: "",
    current: false,
    summary: "",
    technologies: [],
  }),
  extras: () => ({
    title: "",
    value: "",
    details: "",
  }),
};

export function createSectionItem<K extends CVSectionKey>(
  section: K,
  overrides: Partial<SectionItemMap[K]> = {},
): SectionItemMap[K] {
  return {
    id: createId(),
    visible: true,
    ...sectionItemDefaults[section](),
    ...overrides,
  } as SectionItemMap[K];
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

export function createEmptySections(): CVSections {
  return Object.fromEntries(
    CV_SECTION_KEYS.map((section) => [section, { visible: true, items: [] }]),
  ) as unknown as CVSections;
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
          createSectionItem("experience", {
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
          createSectionItem("education", {
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
          createSectionItem("languages", {
            name: "English",
            proficiency: "Advanced",
            details: "Professional working proficiency.",
          }),
        ],
      },
      skills: {
        visible: true,
        items: [
          createSectionItem("skills", {
            name: "React",
            category: "Frontend",
            level: "Expert",
          }),
        ],
      },
      volunteer: {
        visible: true,
        items: [
          createSectionItem("volunteer", {
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
          createSectionItem("projects", {
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
          createSectionItem("extras", {
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
