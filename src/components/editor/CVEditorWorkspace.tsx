"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
    <div className="flex flex-col gap-4">
      {/* Mobile-only: toggle between editor and preview */}
      <div
        className="bg-secondary flex gap-0.5 self-start rounded-lg p-0.5 lg:hidden"
        role="tablist"
        aria-label={t("mobileView.label")}
      >
        {(
          [
            { preview: false, label: t("mobileView.showEditor") },
            { preview: true, label: t("mobileView.showPreview") },
          ] as const
        ).map((tab) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={showPreview === tab.preview}
            className={cn(
              "focus-visible:border-ring focus-visible:ring-ring/50 rounded-md border border-transparent px-3 py-1.5 text-[0.8rem] font-medium transition-colors outline-none focus-visible:ring-3",
              showPreview === tab.preview
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setShowPreview(tab.preview)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-x-6 gap-y-4 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:grid-cols-[11rem_minmax(0,26rem)_minmax(0,1fr)] 2xl:grid-cols-[12.5rem_minmax(0,30rem)_minmax(0,1fr)]">
        <div
          className={cn(
            "min-w-0 lg:col-span-2 xl:sticky xl:top-16 xl:col-span-1",
            showPreview && "hidden lg:block",
          )}
        >
          <SectionNav
            activeSection={activeSection}
            onChange={setActiveSection}
          />
        </div>

        <div className={cn("min-w-0", showPreview && "hidden lg:block")}>
          {activeSection === "personal" ? (
            <PersonalInfoSection />
          ) : (
            <SectionEditor key={activeSection} section={activeSection} />
          )}
        </div>

        <div className={cn("min-w-0", !showPreview && "hidden lg:block")}>
          <CVPreview />
        </div>
      </div>
    </div>
  );
}
