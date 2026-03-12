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
});
