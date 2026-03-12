"use client";

import { FileDown, FileJson, FileType } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useExport } from "@/hooks/useExport";

export function ExportPanel() {
  const t = useTranslations("export");
  const tEditor = useTranslations("editor");
  const { loading, error, exportPDF, exportDOCX, exportJSON } = useExport();

  const labels = {
    sections: {
      experience: tEditor("sections.experience"),
      education: tEditor("sections.education"),
      skills: tEditor("sections.skills"),
      languages: tEditor("sections.languages"),
      volunteer: tEditor("sections.volunteer"),
      projects: tEditor("sections.projects"),
      extras: tEditor("sections.extras"),
    },
    current: tEditor("current"),
  };

  return (
    <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => exportPDF(labels, t("filenamePdf"))}
          disabled={loading !== null}
        >
          {loading === "pdf" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <FileDown />
          )}
          {loading === "pdf" ? t("loading") : t("actions.exportPdf")}
        </Button>

        <Button
          variant="outline"
          onClick={() => exportDOCX(labels, t("filenameDocx"))}
          disabled={loading !== null}
        >
          {loading === "docx" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <FileType />
          )}
          {loading === "docx" ? t("loading") : t("actions.exportDocx")}
        </Button>

        <Button
          variant="outline"
          onClick={() => exportJSON(t("filenameJson"))}
          disabled={loading !== null}
        >
          <FileJson />
          {t("actions.exportJson")}
        </Button>
      </div>

      {error ? (
        <p className="text-destructive rounded-lg border border-current px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}
    </section>
  );
}
