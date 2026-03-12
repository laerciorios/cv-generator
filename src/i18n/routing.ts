import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt-br", "en", "es"],
  defaultLocale: "pt-br",
});

export type AppLocale = (typeof routing.locales)[number];

export const APP_LOCALE_COOKIE = "cv-generator.locale";

export function isAppLocale(locale: string | undefined): locale is AppLocale {
  return Boolean(locale && routing.locales.includes(locale as AppLocale));
}
