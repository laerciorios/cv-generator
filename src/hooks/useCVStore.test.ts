import { CV_DOCUMENT_STORAGE_KEY } from "@/lib/storage";
import { useCVStore } from "@/hooks/useCVStore";
import { createSampleCVDocument } from "@/types/cv.types";

function resetStore() {
  useCVStore.setState(useCVStore.getInitialState(), true);
}

describe("useCVStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("hydrates with fallback data when localStorage is empty", () => {
    const store = useCVStore.getState();

    expect(store.isHydrated).toBe(false);

    store.hydrate();

    const hydrated = useCVStore.getState();
    expect(hydrated.isHydrated).toBe(true);
    expect(hydrated.document.id).toBeTruthy();
    expect(hydrated.storageErrorCode).toBeNull();
  });

  it("updates personal info and persists the document", () => {
    const store = useCVStore.getState();
    store.hydrate();

    useCVStore.getState().updatePersonalInfo({
      fullName: "Taylor Rivera",
      email: "taylor.rivera@example.com",
    });

    const nextState = useCVStore.getState();
    const persistedRaw = window.localStorage.getItem(CV_DOCUMENT_STORAGE_KEY);

    expect(nextState.document.personalInfo.fullName).toBe("Taylor Rivera");
    expect(nextState.document.personalInfo.email).toBe(
      "taylor.rivera@example.com",
    );
    expect(nextState.lastSavedAt).toBe(nextState.document.metadata.updatedAt);
    expect(persistedRaw).toContain("Taylor Rivera");
  });

  it("supports add, reorder, visibility and remove actions", () => {
    const store = useCVStore.getState();
    store.hydrate();

    const firstId = useCVStore.getState().addSectionItem("skills", {
      name: "React",
    });
    const secondId = useCVStore.getState().addSectionItem("skills", {
      name: "TypeScript",
    });

    useCVStore.getState().reorderSectionItems("skills", 0, 1);
    useCVStore.getState().setSectionItemVisibility("skills", secondId, false);
    useCVStore.getState().removeSectionItem("skills", firstId);

    const skills = useCVStore.getState().document.sections.skills.items;

    expect(skills).toHaveLength(1);
    expect(skills[0]?.id).toBe(secondId);
    expect(skills[0]?.visible).toBe(false);
  });

  it("imports valid JSON and reports invalid JSON", () => {
    const sample = createSampleCVDocument();
    const validJson = JSON.stringify(sample);

    const validResult = useCVStore.getState().importFromJson(validJson);

    expect(validResult.ok).toBe(true);
    expect(useCVStore.getState().document.id).toBe(sample.id);

    const invalidResult = useCVStore.getState().importFromJson('{"foo":1}');

    expect(invalidResult.ok).toBe(false);
    expect(invalidResult.errorCode).toBe("invalid-json-document");
    expect(useCVStore.getState().storageErrorCode).toBe(
      "invalid-json-document",
    );
  });
});
