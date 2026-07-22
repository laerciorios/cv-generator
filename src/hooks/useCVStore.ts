"use client";

import { create } from "zustand";
import { createEmptyCVDocument, createSectionItem } from "@/lib/cv-factories";
import {
  exportCVDocumentToJson,
  importCVDocumentFromJson,
  loadCVDocumentFromStorage,
  saveCVDocumentToStorage,
  type StorageErrorCode,
} from "@/lib/storage";
import {
  CV_SCHEMA_VERSION,
  type BaseSectionItem,
  type CVDocument,
  type CVSections,
  type CVSectionKey,
  type CVTemplate,
  type PersonalInfo,
  type SectionItemMap,
  type SectionState,
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

type AnySectionState = SectionState<BaseSectionItem>;

/**
 * Internally the section state is handled through the BaseSectionItem shape;
 * the strictly typed store API guarantees callers pass matching items.
 */
function withSection(
  document: CVDocument,
  section: CVSectionKey,
  update: (state: AnySectionState) => AnySectionState,
): CVDocument {
  return {
    ...document,
    sections: {
      ...document.sections,
      [section]: update(document.sections[section] as AnySectionState),
    } as CVSections,
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

  function commitDocument(document: CVDocument) {
    persistDocument(touchDocument(document));
  }

  function commitSection(
    section: CVSectionKey,
    update: (state: AnySectionState) => AnySectionState,
  ) {
    commitDocument(withSection(get().document, section, update));
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
      commitDocument(document);
    },

    updatePersonalInfo: (updates) => {
      const currentDocument = get().document;

      commitDocument({
        ...currentDocument,
        personalInfo: {
          ...currentDocument.personalInfo,
          ...updates,
        },
      });
    },

    setTemplate: (template) => {
      const currentDocument = get().document;

      if (currentDocument.template === template) {
        return;
      }

      commitDocument({ ...currentDocument, template });
    },

    setSectionVisibility: (section, visible) => {
      commitSection(section, (state) => ({ ...state, visible }));
    },

    addSectionItem: (section, overrides = {}) => {
      const item = createSectionItem(section, overrides);

      commitSection(section, (state) => ({
        ...state,
        items: [...state.items, item],
      }));

      return item.id;
    },

    updateSectionItem: (section, itemId, updates) => {
      commitSection(section, (state) => ({
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item,
        ),
      }));
    },

    removeSectionItem: (section, itemId) => {
      commitSection(section, (state) => ({
        ...state,
        items: state.items.filter((item) => item.id !== itemId),
      }));
    },

    reorderSectionItems: (section, fromIndex, toIndex) => {
      const itemCount = get().document.sections[section].items.length;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= itemCount ||
        toIndex >= itemCount ||
        fromIndex === toIndex
      ) {
        return;
      }

      commitSection(section, (state) => {
        const items = [...state.items];
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);

        return { ...state, items };
      });
    },

    setSectionItemVisibility: (section, itemId, visible) => {
      commitSection(section, (state) => ({
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, visible } : item,
        ),
      }));
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

      commitDocument(result.document);

      return {
        ok: true,
        errorCode: null,
        errorDetails: null,
      };
    },

    resetDocument: () => {
      persistDocument(createEmptyCVDocument());
    },
  };
});
