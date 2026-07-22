"use client";

import {
  FileCode2,
  FileDown,
  FileJson,
  FileType,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useExport, type ExportFormat } from "@/hooks/useExport";
import { CV_SECTION_KEYS } from "@/types/cv.types";
import type { ExportSectionLabels } from "@/lib/exporters/filter";

interface ExportAction {
  format: ExportFormat;
  icon: LucideIcon;
  labelKey: string;
  filenameKey: string;
  variant: "default" | "outline";
}

const EXPORT_ACTIONS: readonly ExportAction[] = [
  {
    format: "pdf",
    icon: FileDown,
    labelKey: "actions.exportPdf",
    filenameKey: "filenamePdf",
    variant: "default",
  },
  {
    format: "docx",
    icon: FileType,
    labelKey: "actions.exportDocx",
    filenameKey: "filenameDocx",
    variant: "outline",
  },
  {
    format: "latex",
    icon: FileCode2,
    labelKey: "actions.exportLatex",
    filenameKey: "filenameLatex",
    variant: "outline",
  },
  {
    format: "json",
    icon: FileJson,
    labelKey: "actions.exportJson",
    filenameKey: "filenameJson",
    variant: "outline",
  },
];

export function ExportPanel() {
  const t = useTranslations("export");
  const tEditor = useTranslations("editor");
  const { loading, error, exportDocument } = useExport();

  const labels = {
    sections: Object.fromEntries(
      CV_SECTION_KEYS.map((key) => [key, tEditor(`sections.${key}`)]),
    ) as ExportSectionLabels,
    current: tEditor("current"),
  };

  return (
    <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {EXPORT_ACTIONS.map((action) => {
          const Icon = action.icon;
          const isLoading = loading === action.format;

          return (
            <Button
              key={action.format}
              variant={action.variant}
              onClick={() =>
                exportDocument(action.format, labels, t(action.filenameKey))
              }
              disabled={loading !== null}
            >
              {isLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Icon />
              )}
              {isLoading ? t("loading") : t(action.labelKey)}
            </Button>
          );
        })}
      </div>

      {error ? (
        <p className="text-destructive rounded-lg border border-current px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}
    </section>
  );
}
