"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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

export function SectionNav({ activeSection, onChange }: SectionNavProps) {
  const t = useTranslations("editor");
  const tSections = useTranslations("sections");

  return (
    <nav
      className="bg-card flex flex-wrap items-center gap-2 rounded-2xl border p-3 shadow-sm"
      aria-label={tSections("title")}
    >
      {EDITOR_SECTIONS.map((section) => (
        <Button
          key={section}
          size="sm"
          variant={activeSection === section ? "default" : "outline"}
          onClick={() => onChange(section)}
        >
          {t(`sections.${section}`)}
        </Button>
      ))}
    </nav>
  );
}
