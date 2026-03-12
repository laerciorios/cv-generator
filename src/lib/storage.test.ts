import {
  CV_DOCUMENT_STORAGE_KEY,
  exportCVDocumentToJson,
  importCVDocumentFromJson,
  loadCVDocumentFromStorage,
  saveCVDocumentToStorage,
} from "@/lib/storage";
import { createSampleCVDocument } from "@/types/cv.types";

describe("storage", () => {
  it("returns fallback document when storage is empty", () => {
    const result = loadCVDocumentFromStorage();

    expect(result.source).toBe("fallback");
    expect(result.errorCode).toBeNull();
    expect(result.document.id).toBeTruthy();
  });

  it("saves and loads a valid document from localStorage", () => {
    const sample = createSampleCVDocument();
    const saveResult = saveCVDocumentToStorage(sample);

    expect(saveResult.ok).toBe(true);

    const loaded = loadCVDocumentFromStorage();

    expect(loaded.source).toBe("storage");
    expect(loaded.errorCode).toBeNull();
    expect(loaded.document.id).toBe(sample.id);
    expect(loaded.document.personalInfo.fullName).toBe(
      sample.personalInfo.fullName,
    );
  });

  it("discards unparseable stored JSON", () => {
    window.localStorage.setItem(CV_DOCUMENT_STORAGE_KEY, "{invalid");

    const result = loadCVDocumentFromStorage();

    expect(result.source).toBe("fallback");
    expect(result.errorCode).toBe("stored-data-unparseable");
    expect(window.localStorage.getItem(CV_DOCUMENT_STORAGE_KEY)).toBeNull();
  });

  it("discards invalid stored document shape", () => {
    const sample = createSampleCVDocument();
    sample.metadata.schemaVersion = 999;
    window.localStorage.setItem(
      CV_DOCUMENT_STORAGE_KEY,
      JSON.stringify(sample),
    );

    const result = loadCVDocumentFromStorage();

    expect(result.source).toBe("fallback");
    expect(result.errorCode).toBe("stored-data-invalid");
    expect(result.errorDetails).toContain("metadata.schemaVersion");
    expect(window.localStorage.getItem(CV_DOCUMENT_STORAGE_KEY)).toBeNull();
  });

  it("exports and imports JSON with schema validation", () => {
    const sample = createSampleCVDocument();
    const json = exportCVDocumentToJson(sample);

    const validImport = importCVDocumentFromJson(json);

    expect(validImport.ok).toBe(true);
    expect(validImport.errorCode).toBeNull();
    expect(validImport.document?.id).toBe(sample.id);

    const invalidImport = importCVDocumentFromJson('{"not":"cv"}');

    expect(invalidImport.ok).toBe(false);
    expect(invalidImport.errorCode).toBe("invalid-json-document");
  });
});
