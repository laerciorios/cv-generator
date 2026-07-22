"use client";

import { useState } from "react";
import { useCVStore } from "@/hooks/useCVStore";
import { downloadBlob } from "@/lib/download";
import { generateAndDownloadDOCX } from "@/lib/exporters/docx.generator";
import type { ExportLabels } from "@/lib/exporters/filter";
import { generateAndDownloadLatex } from "@/lib/exporters/latex.generator";
import { generateAndDownloadPDF } from "@/lib/exporters/pdf.generator";

export type ExportFormat = "pdf" | "docx" | "latex" | "json";

interface UseExportReturn {
  loading: ExportFormat | null;
  error: string | null;
  exportDocument: (
    format: ExportFormat,
    labels: ExportLabels,
    filename: string,
  ) => Promise<void>;
}

export function useExport(): UseExportReturn {
  const { document, exportToJson } = useCVStore();
  const [loading, setLoading] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function exportDocument(
    format: ExportFormat,
    labels: ExportLabels,
    filename: string,
  ): Promise<void> {
    setLoading(format);
    setError(null);

    try {
      switch (format) {
        case "pdf":
          await generateAndDownloadPDF(document, labels, filename);
          break;
        case "docx":
          await generateAndDownloadDOCX(document, labels, filename);
          break;
        case "latex":
          generateAndDownloadLatex(document, labels, filename);
          break;
        case "json":
          downloadBlob(
            new Blob([exportToJson()], { type: "application/json" }),
            filename,
          );
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  }

  return { loading, error, exportDocument };
}
