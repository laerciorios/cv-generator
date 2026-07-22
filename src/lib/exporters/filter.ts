import {
  CV_SECTION_KEYS,
  type CVDocument,
  type CVSections,
} from "@/types/cv.types";

export type ExportSectionLabels = Record<
  (typeof CV_SECTION_KEYS)[number],
  string
>;

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
    sections: Object.fromEntries(
      CV_SECTION_KEYS.map((key) => {
        const section = doc.sections[key];

        return [
          key,
          {
            ...section,
            items: section.items.filter((item) => item.visible),
          },
        ];
      }),
    ) as CVSections,
  };
}
