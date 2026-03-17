import { cvDocumentSchema } from "@/lib/schemas";
import { createSampleCVDocument } from "@/types/cv.types";

describe("cvDocumentSchema", () => {
  it("accepts a valid CV document", () => {
    const sample = createSampleCVDocument();

    const result = cvDocumentSchema.safeParse(sample);

    expect(result.success).toBe(true);
  });

  it("rejects invalid URL fields", () => {
    const sample = createSampleCVDocument();
    sample.personalInfo.website = "not-a-valid-url";

    const result = cvDocumentSchema.safeParse(sample);

    expect(result.success).toBe(false);
  });

  it("rejects an unsupported schema version", () => {
    const sample = createSampleCVDocument();
    sample.metadata.schemaVersion = 999;

    const result = cvDocumentSchema.safeParse(sample);

    expect(result.success).toBe(false);
  });

  it("fills default template for legacy documents", () => {
    const sample = createSampleCVDocument();
    const legacyDocument = { ...sample };
    delete (legacyDocument as { template?: string }).template;

    const result = cvDocumentSchema.safeParse(legacyDocument);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.template).toBe("classic");
    }
  });
});
