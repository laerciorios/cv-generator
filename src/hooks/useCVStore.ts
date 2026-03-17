"use client";

import { create } from "zustand";
import {
  exportCVDocumentToJson,
  importCVDocumentFromJson,
  loadCVDocumentFromStorage,
  saveCVDocumentToStorage,
  type StorageErrorCode,
} from "@/lib/storage";
import {
  CV_SCHEMA_VERSION,
  createEmptyCVDocument,
  createSectionItem,
  type CVDocument,
  type CVSectionKey,
  type CVTemplate,
  type PersonalInfo,
  type SectionItemMap,
} from "@/types/cv.types";

interface ImportActionResult {
  ok: boolean;
  errorCode: StorageErrorCode | null;
  errorDetails: string | null;
}

interface CVStoreState {
  document: CVDocument;
  isHydrated: boolean;
  lastSavedAt: string | null;
  storageErrorCode: StorageErrorCode | null;
  storageErrorDetails: string | null;
  hydrate: () => void;
  replaceDocument: (document: CVDocument) => void;
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  setTemplate: (template: CVTemplate) => void;
  setSectionVisibility: (section: CVSectionKey, visible: boolean) => void;
  addSectionItem: <K extends CVSectionKey>(
    section: K,
    overrides?: Partial<SectionItemMap[K]>,
  ) => string;
  updateSectionItem: <K extends CVSectionKey>(
    section: K,
    itemId: string,
    updates: Partial<SectionItemMap[K]>,
  ) => void;
  removeSectionItem: (section: CVSectionKey, itemId: string) => void;
  reorderSectionItems: (
    section: CVSectionKey,
    fromIndex: number,
    toIndex: number,
  ) => void;
  setSectionItemVisibility: (
    section: CVSectionKey,
    itemId: string,
    visible: boolean,
  ) => void;
  exportToJson: () => string;
  importFromJson: (json: string) => ImportActionResult;
  resetDocument: () => void;
}

function touchDocument(document: CVDocument): CVDocument {
  return {
    ...document,
    metadata: {
      ...document.metadata,
      schemaVersion: CV_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
    },
  };
}

export const useCVStore = create<CVStoreState>((set, get) => {
  function persistDocument(document: CVDocument) {
    const saveResult = saveCVDocumentToStorage(document);

    set({
      document,
      isHydrated: true,
      lastSavedAt: saveResult.ok ? document.metadata.updatedAt : null,
      storageErrorCode: saveResult.errorCode,
      storageErrorDetails: null,
    });
  }

  return {
    document: createEmptyCVDocument(),
    isHydrated: false,
    lastSavedAt: null,
    storageErrorCode: null,
    storageErrorDetails: null,

    hydrate: () => {
      const result = loadCVDocumentFromStorage();

      set({
        document: result.document,
        isHydrated: true,
        lastSavedAt:
          result.source === "storage"
            ? result.document.metadata.updatedAt
            : null,
        storageErrorCode: result.errorCode,
        storageErrorDetails: result.errorDetails,
      });
    },

    replaceDocument: (document) => {
      persistDocument(touchDocument(document));
    },

    updatePersonalInfo: (updates) => {
      const currentDocument = get().document;

      persistDocument(
        touchDocument({
          ...currentDocument,
          personalInfo: {
            ...currentDocument.personalInfo,
            ...updates,
          },
        }),
      );
    },

    setTemplate: (template) => {
      const currentDocument = get().document;

      if (currentDocument.template === template) {
        return;
      }

      persistDocument(
        touchDocument({
          ...currentDocument,
          template,
        }),
      );
    },

    setSectionVisibility: (section, visible) => {
      const currentDocument = get().document;

      persistDocument(
        touchDocument({
          ...currentDocument,
          sections: {
            ...currentDocument.sections,
            [section]: {
              ...currentDocument.sections[section],
              visible,
            },
          },
        }),
      );
    },

    addSectionItem: (section, overrides = {}) => {
      const currentDocument = get().document;
      const item = createSectionItem(section, overrides);

      persistDocument(
        touchDocument({
          ...currentDocument,
          sections: {
            ...currentDocument.sections,
            [section]: {
              ...currentDocument.sections[section],
              items: [...currentDocument.sections[section].items, item],
            },
          },
        }),
      );

      return item.id;
    },

    updateSectionItem: (section, itemId, updates) => {
      const currentDocument = get().document;

      persistDocument(
        touchDocument({
          ...currentDocument,
          sections: {
            ...currentDocument.sections,
            [section]: {
              ...currentDocument.sections[section],
              items: currentDocument.sections[section].items.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item,
              ),
            },
          },
        }),
      );
    },

    removeSectionItem: (section, itemId) => {
      const currentDocument = get().document;

      persistDocument(
        touchDocument({
          ...currentDocument,
          sections: {
            ...currentDocument.sections,
            [section]: {
              ...currentDocument.sections[section],
              items: currentDocument.sections[section].items.filter(
                (item) => item.id !== itemId,
              ),
            },
          },
        }),
      );
    },

    reorderSectionItems: (section, fromIndex, toIndex) => {
      const currentDocument = get().document;
      const items = [...currentDocument.sections[section].items];

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= items.length ||
        toIndex >= items.length ||
        fromIndex === toIndex
      ) {
        return;
      }

      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);

      persistDocument(
        touchDocument({
          ...currentDocument,
          sections: {
            ...currentDocument.sections,
            [section]: {
              ...currentDocument.sections[section],
              items,
            },
          },
        }),
      );
    },

    setSectionItemVisibility: (section, itemId, visible) => {
      const currentDocument = get().document;

      persistDocument(
        touchDocument({
          ...currentDocument,
          sections: {
            ...currentDocument.sections,
            [section]: {
              ...currentDocument.sections[section],
              items: currentDocument.sections[section].items.map((item) =>
                item.id === itemId ? { ...item, visible } : item,
              ),
            },
          },
        }),
      );
    },

    exportToJson: () => {
      return exportCVDocumentToJson(get().document);
    },

    importFromJson: (json) => {
      const result = importCVDocumentFromJson(json);

      if (!result.ok || !result.document) {
        set({
          storageErrorCode: result.errorCode,
          storageErrorDetails: result.errorDetails,
        });

        return {
          ok: false,
          errorCode: result.errorCode,
          errorDetails: result.errorDetails,
        };
      }

      persistDocument(touchDocument(result.document));

      return {
        ok: true,
        errorCode: null,
        errorDetails: null,
      };
    },

    resetDocument: () => {
      const nextDocument = createEmptyCVDocument();
      persistDocument(nextDocument);
    },
  };
});
