import { cvDocumentSchema, formatZodIssues } from "@/lib/schemas";
import { createEmptyCVDocument, type CVDocument } from "@/types/cv.types";

export const CV_DOCUMENT_STORAGE_KEY = "cv-generator.document";

export type StorageErrorCode =
  | "browser-unavailable"
  | "stored-data-invalid"
  | "stored-data-unparseable"
  | "save-failed"
  | "clear-failed"
  | "invalid-json-document"
  | "invalid-json-file";

export interface StorageLoadResult {
  document: CVDocument;
  source: "storage" | "fallback";
  errorCode: StorageErrorCode | null;
  errorDetails: string | null;
}

export interface StorageMutationResult {
  ok: boolean;
  errorCode: StorageErrorCode | null;
}

export interface ImportResult extends StorageMutationResult {
  document: CVDocument | null;
  errorDetails: string | null;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadCVDocumentFromStorage(): StorageLoadResult {
  if (!isBrowser()) {
    return {
      document: createEmptyCVDocument(),
      source: "fallback",
      errorCode: null,
      errorDetails: null,
    };
  }

  const rawValue = window.localStorage.getItem(CV_DOCUMENT_STORAGE_KEY);

  if (!rawValue) {
    return {
      document: createEmptyCVDocument(),
      source: "fallback",
      errorCode: null,
      errorDetails: null,
    };
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const result = cvDocumentSchema.safeParse(parsedValue);

    if (!result.success) {
      window.localStorage.removeItem(CV_DOCUMENT_STORAGE_KEY);

      return {
        document: createEmptyCVDocument(),
        source: "fallback",
        errorCode: "stored-data-invalid",
        errorDetails: formatZodIssues(result.error),
      };
    }

    return {
      document: result.data,
      source: "storage",
      errorCode: null,
      errorDetails: null,
    };
  } catch {
    window.localStorage.removeItem(CV_DOCUMENT_STORAGE_KEY);

    return {
      document: createEmptyCVDocument(),
      source: "fallback",
      errorCode: "stored-data-unparseable",
      errorDetails: null,
    };
  }
}

export function saveCVDocumentToStorage(
  document: CVDocument,
): StorageMutationResult {
  if (!isBrowser()) {
    return {
      ok: false,
      errorCode: "browser-unavailable",
    };
  }

  try {
    window.localStorage.setItem(
      CV_DOCUMENT_STORAGE_KEY,
      JSON.stringify(document),
    );

    return {
      ok: true,
      errorCode: null,
    };
  } catch {
    return {
      ok: false,
      errorCode: "save-failed",
    };
  }
}

export function clearCVDocumentStorage(): StorageMutationResult {
  if (!isBrowser()) {
    return {
      ok: false,
      errorCode: "browser-unavailable",
    };
  }

  try {
    window.localStorage.removeItem(CV_DOCUMENT_STORAGE_KEY);

    return {
      ok: true,
      errorCode: null,
    };
  } catch {
    return {
      ok: false,
      errorCode: "clear-failed",
    };
  }
}

export function exportCVDocumentToJson(document: CVDocument) {
  return JSON.stringify(document, null, 2);
}

export function importCVDocumentFromJson(json: string): ImportResult {
  try {
    const parsedValue = JSON.parse(json);
    const result = cvDocumentSchema.safeParse(parsedValue);

    if (!result.success) {
      return {
        ok: false,
        document: null,
        errorCode: "invalid-json-document",
        errorDetails: formatZodIssues(result.error),
      };
    }

    return {
      ok: true,
      document: result.data,
      errorCode: null,
      errorDetails: null,
    };
  } catch {
    return {
      ok: false,
      document: null,
      errorCode: "invalid-json-file",
      errorDetails: null,
    };
  }
}
