"use client";

import { useTranslations } from "next-intl";
import { useCVStore } from "@/hooks/useCVStore";

export function SaveStatusBadge() {
  const t = useTranslations("header");
  const { isHydrated, lastSavedAt, storageErrorCode } = useCVStore();

  if (!isHydrated || !lastSavedAt || storageErrorCode) {
    return null;
  }

  return (
    <div
      className="text-muted-foreground hidden items-center gap-1.5 font-mono text-[11px] tracking-wide uppercase sm:flex"
      role="status"
      aria-live="polite"
      aria-label={t("saveStatus.saved")}
    >
      <span className="bg-success size-1.5 rounded-full" aria-hidden="true" />
      {t("saveStatus.saved")}
    </div>
  );
}
