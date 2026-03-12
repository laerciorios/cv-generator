import { filterCVForExport } from "@/lib/exporters/filter";
import { createSampleCVDocument } from "@/types/cv.types";

describe("filterCVForExport", () => {
  it("keeps only visible items while preserving section visibility", () => {
    const sample = createSampleCVDocument();

    sample.sections.experience.visible = false;
    sample.sections.experience.items = [
      {
        ...sample.sections.experience.items[0],
        id: crypto.randomUUID(),
        visible: true,
      },
      {
        ...sample.sections.experience.items[0],
        id: crypto.randomUUID(),
        visible: false,
      },
    ];

    const filtered = filterCVForExport(sample);

    expect(filtered.sections.experience.visible).toBe(false);
    expect(filtered.sections.experience.items).toHaveLength(1);
    expect(filtered.sections.experience.items[0]?.visible).toBe(true);
  });

  it("does not mutate the original document", () => {
    const sample = createSampleCVDocument();
    sample.sections.skills.items = [
      {
        ...sample.sections.skills.items[0],
        id: crypto.randomUUID(),
        visible: false,
      },
    ];

    const filtered = filterCVForExport(sample);

    expect(filtered.sections.skills.items).toHaveLength(0);
    expect(sample.sections.skills.items).toHaveLength(1);
  });
});
