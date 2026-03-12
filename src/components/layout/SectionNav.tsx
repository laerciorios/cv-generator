"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export type EditorSectionKey =
  | "personal"
  | "experience"
  | "education"
  | "languages"
  | "skills"
  | "volunteer"
  | "projects"
  | "extras";

interface SectionNavProps {
  activeSection: EditorSectionKey;
  onChange: (section: EditorSectionKey) => void;
}

const availableSections: EditorSectionKey[] = [
  "personal",
  "experience",
  "education",
  "languages",
  "skills",
  "volunteer",
  "projects",
  "extras",
];
const upcomingSections: EditorSectionKey[] = [];

export function SectionNav({ activeSection, onChange }: SectionNavProps) {
  const t = useTranslations("editor");
  const tSections = useTranslations("sections");

  return (
    <nav
      className="bg-card flex flex-wrap items-center gap-2 rounded-2xl border p-3 shadow-sm"
      aria-label={tSections("title")}
    >
      {availableSections.map((section) => (
        <Button
          key={section}
          size="sm"
          variant={activeSection === section ? "default" : "outline"}
          onClick={() => onChange(section)}
        >
          {t(`sections.${section}`)}
        </Button>
      ))}

      {upcomingSections.length > 0 ? (
        <div className="bg-border h-6 w-px" aria-hidden />
      ) : null}

      {upcomingSections.map((section) => (
        <Button key={section} size="sm" variant="outline" disabled>
          {t(`sections.${section}`)}
        </Button>
      ))}
    </nav>
  );
}
