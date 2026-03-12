import type { CVDocument } from "@/types/cv.types";

export interface ExportSectionLabels {
  experience: string;
  education: string;
  skills: string;
  languages: string;
  volunteer: string;
  projects: string;
  extras: string;
}

export interface ExportLabels {
  sections: ExportSectionLabels;
  current: string;
}

/**
 * Returns a new CVDocument with all items filtered to only those that are
 * marked visible. Section-level visibility is preserved as-is so generators
 * can skip entire sections when section.visible is false.
 */
export function filterCVForExport(doc: CVDocument): CVDocument {
  return {
    ...doc,
    sections: {
      experience: {
        ...doc.sections.experience,
        items: doc.sections.experience.items.filter((i) => i.visible),
      },
      education: {
        ...doc.sections.education,
        items: doc.sections.education.items.filter((i) => i.visible),
      },
      languages: {
        ...doc.sections.languages,
        items: doc.sections.languages.items.filter((i) => i.visible),
      },
      skills: {
        ...doc.sections.skills,
        items: doc.sections.skills.items.filter((i) => i.visible),
      },
      volunteer: {
        ...doc.sections.volunteer,
        items: doc.sections.volunteer.items.filter((i) => i.visible),
      },
      projects: {
        ...doc.sections.projects,
        items: doc.sections.projects.items.filter((i) => i.visible),
      },
      extras: {
        ...doc.sections.extras,
        items: doc.sections.extras.items.filter((i) => i.visible),
      },
    },
  };
}
