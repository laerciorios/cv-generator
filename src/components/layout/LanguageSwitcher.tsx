"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { APP_LOCALE_COOKIE, type AppLocale } from "@/i18n/routing";
import { useEffect } from "react";

const locales = ["pt-br", "en", "es"] as const;

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function persistLocaleCookie(locale: AppLocale) {
  const cookieSuffix = `path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;

  document.cookie = `${APP_LOCALE_COOKIE}=${locale}; ${cookieSuffix}`;
  document.cookie = `NEXT_LOCALE=${locale}; ${cookieSuffix}`;
}

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    persistLocaleCookie(locale as AppLocale);
  }, [locale]);

  return (
    <label className="flex min-w-0 items-center gap-2 text-sm font-medium">
      <span className="text-muted-foreground hidden sm:inline">
        {t("language")}
      </span>
      <select
        value={locale}
        aria-label={t("language")}
        className="bg-background w-24 rounded-md border px-2 py-1 sm:w-auto"
        onChange={(event) => {
          const nextLocale = event.target.value as AppLocale;
          persistLocaleCookie(nextLocale);
          router.replace(pathname, { locale: nextLocale });
        }}
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {t(`locales.${value}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
