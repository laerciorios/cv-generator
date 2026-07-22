"use client";

import { EyeOff, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCVStore } from "@/hooks/useCVStore";
import { cn } from "@/lib/utils";
import { CV_SECTION_KEYS, type CVSectionKey } from "@/types/cv.types";

export type EditorSectionKey = "personal" | CVSectionKey;

const EDITOR_SECTIONS: readonly EditorSectionKey[] = [
  "personal",
  ...CV_SECTION_KEYS,
];

interface SectionNavProps {
  activeSection: EditorSectionKey;
  onChange: (section: EditorSectionKey) => void;
}

/**
 * Section navigation: a vertical rail on xl screens, a horizontally
 * scrollable tab row below that. Shows item counts and hidden-section
 * indicators so the document structure is scannable at a glance.
 */
export function SectionNav({ activeSection, onChange }: SectionNavProps) {
  const t = useTranslations("editor");
  const tSections = useTranslations("sections");
  const { document } = useCVStore();

  return (
    <nav
      aria-label={tSections("title")}
      className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 xl:m-0 xl:flex-col xl:overflow-visible xl:p-0 [&::-webkit-scrollbar]:hidden"
    >
      {EDITOR_SECTIONS.map((section) => {
        const isActive = activeSection === section;
        const state =
          section === "personal" ? null : document.sections[section];

        return (
          <button
            key={section}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onChange(section)}
            className={cn(
              "focus-visible:border-ring focus-visible:ring-ring/50 flex shrink-0 items-center gap-2 rounded-md border border-transparent px-2.5 py-1.5 text-[0.8rem] whitespace-nowrap outline-none focus-visible:ring-3 xl:justify-between",
              isActive
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-1.5">
              {section === "personal" ? (
                <User className="size-3.5" aria-hidden="true" />
              ) : null}
              {t(`sections.${section}`)}
            </span>

            {state ? (
              <span className="flex items-center gap-1.5">
                {!state.visible ? (
                  <EyeOff
                    className="size-3.5"
                    aria-label={tSections("visibility.hidden")}
                  />
                ) : null}
                {state.items.length > 0 ? (
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      isActive ? "text-muted-foreground" : "opacity-70",
                    )}
                  >
                    {state.items.length}
                  </span>
                ) : null}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
