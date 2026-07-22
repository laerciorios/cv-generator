import {
  buildExportContent,
  entryTitle,
  formatDateRange,
} from "@/lib/exporters/content";
import type { ExportLabels } from "@/lib/exporters/filter";
import { createSampleCVDocument, createSectionItem } from "@/lib/cv-factories";

const labels: ExportLabels = {
  sections: {
    experience: "Experience",
    education: "Education",
    languages: "Languages",
    skills: "Skills",
    volunteer: "Volunteer",
    projects: "Projects",
    extras: "Extras",
  },
  current: "Current",
};

describe("buildExportContent", () => {
  it("keeps the shared section order and skips hidden or empty sections", () => {
    const sample = createSampleCVDocument();
    sample.sections.education.visible = false;
    sample.sections.languages.items = [];

    const content = buildExportContent(sample, labels);

    expect(content.sections.map((section) => section.key)).toEqual([
      "experience",
      "skills",
      "volunteer",
      "projects",
      "extras",
    ]);
  });

  it("filters hidden items and exposes header parts", () => {
    const sample = createSampleCVDocument();
    sample.sections.experience.items.push(
      createSectionItem("experience", { role: "Hidden role", visible: false }),
    );

    const content = buildExportContent(sample, labels);
    const experience = content.sections.find(
      (section) => section.key === "experience",
    );

    expect(experience?.kind).toBe("entries");
    if (experience?.kind === "entries") {
      expect(experience.entries).toHaveLength(1);
      expect(experience.entries[0]?.titleParts).toEqual([
        "Senior Frontend Engineer",
      ]);
    }

    expect(content.fullName).toBe(sample.personalInfo.fullName);
    expect(content.contactParts).toEqual([
      sample.personalInfo.email,
      sample.personalInfo.phone,
      sample.personalInfo.location,
    ]);
    expect(content.currentLabel).toBe("Current");
  });

  it("falls back to the institution when education title parts are empty", () => {
    const sample = createSampleCVDocument();
    sample.sections.education.items = [
      createSectionItem("education", { institution: "Federal University" }),
    ];

    const content = buildExportContent(sample, labels);
    const education = content.sections.find(
      (section) => section.key === "education",
    );

    expect(education?.kind).toBe("entries");
    if (education?.kind === "entries") {
      expect(entryTitle(education.entries[0]!)).toBe("Federal University");
    }
  });
});

describe("formatDateRange", () => {
  it("uses the dash as placeholder for missing dates", () => {
    expect(
      formatDateRange({ start: "", end: "", current: false }, "Current"),
    ).toBe("– – –");
  });

  it("uses the current label and custom dash when provided", () => {
    expect(
      formatDateRange({ start: "2020-01", end: "", current: true }, "Now", "-"),
    ).toBe("2020-01 - Now");
  });
});
