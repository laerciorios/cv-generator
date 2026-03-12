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
      className="text-muted-foreground flex items-center gap-1.5 text-xs"
      role="status"
      aria-live="polite"
      aria-label={t("saveStatus.saved")}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-green-500"
        aria-hidden="true"
      />
      {t("saveStatus.saved")}
    </div>
  );
}
