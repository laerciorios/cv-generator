"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ExportPanel } from "@/components/export/ExportPanel";
import { PersonalInfoSection } from "@/components/form/PersonalInfoSection";
import { SectionEditor } from "@/components/form/SectionEditor";
import {
  SectionNav,
  type EditorSectionKey,
} from "@/components/layout/SectionNav";
import { CVPreview } from "@/components/preview/CVPreview";
import { useCVStore } from "@/hooks/useCVStore";
import { cn } from "@/lib/utils";

export function CVEditorWorkspace() {
  const t = useTranslations("editor");
  const { hydrate, isHydrated } = useCVStore();
  const [activeSection, setActiveSection] =
    useState<EditorSectionKey>("personal");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isHydrated) {
      hydrate();
    }
  }, [hydrate, isHydrated]);

  return (
    <section className="grid gap-4">
      {/* Mobile-only: toggle between editor and preview */}
      <div
        className="bg-card flex gap-1 rounded-2xl border p-1 lg:hidden"
        role="tablist"
        aria-label={t("mobileView.label")}
      >
        <button
          role="tab"
          aria-selected={!showPreview}
          className={cn(
            "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
            !showPreview
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setShowPreview(false)}
        >
          {t("mobileView.showEditor")}
        </button>
        <button
          role="tab"
          aria-selected={showPreview}
          className={cn(
            "flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
            showPreview
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={() => setShowPreview(true)}
        >
          {t("mobileView.showPreview")}
        </button>
      </div>

      <SectionNav activeSection={activeSection} onChange={setActiveSection} />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className={cn("grid gap-4", showPreview && "hidden lg:grid")}>
          {activeSection === "personal" ? (
            <PersonalInfoSection />
          ) : (
            <SectionEditor key={activeSection} section={activeSection} />
          )}
          <ExportPanel />
        </div>
        <div className={cn(!showPreview && "hidden lg:block")}>
          <CVPreview />
        </div>
      </div>
    </section>
  );
}
