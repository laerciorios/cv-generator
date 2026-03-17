"use client";

import { useState } from "react";
import { useCVStore } from "@/hooks/useCVStore";
import { generateAndDownloadPDF } from "@/lib/exporters/pdf.generator";
import { generateAndDownloadDOCX } from "@/lib/exporters/docx.generator";
import { generateAndDownloadLatex } from "@/lib/exporters/latex.generator";
import type { ExportLabels } from "@/lib/exporters/filter";

type ExportFormat = "pdf" | "docx" | "latex";

interface UseExportReturn {
  loading: ExportFormat | null;
  error: string | null;
  exportPDF: (labels: ExportLabels, filename: string) => Promise<void>;
  exportDOCX: (labels: ExportLabels, filename: string) => Promise<void>;
  exportLatex: (labels: ExportLabels, filename: string) => Promise<void>;
  exportJSON: (filename: string) => void;
}

export function useExport(): UseExportReturn {
  const { document, exportToJson } = useCVStore();
  const [loading, setLoading] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function exportPDF(
    labels: ExportLabels,
    filename: string,
  ): Promise<void> {
    setLoading("pdf");
    setError(null);
    try {
      await generateAndDownloadPDF(document, labels, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  }

  async function exportDOCX(
    labels: ExportLabels,
    filename: string,
  ): Promise<void> {
    setLoading("docx");
    setError(null);
    try {
      await generateAndDownloadDOCX(document, labels, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  }

  async function exportLatex(
    labels: ExportLabels,
    filename: string,
  ): Promise<void> {
    setLoading("latex");
    setError(null);
    try {
      generateAndDownloadLatex(document, labels, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(null);
    }
  }

  function exportJSON(filename: string): void {
    const json = exportToJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return { loading, error, exportPDF, exportDOCX, exportLatex, exportJSON };
}
