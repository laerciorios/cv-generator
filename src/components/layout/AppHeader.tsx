import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SaveStatusBadge } from "./SaveStatusBadge";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function AppHeader() {
  const t = useTranslations("home");

  return (
    <header className="bg-background/95 sticky top-0 z-20 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-12 w-full max-w-[100rem] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span
            className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md text-[10px] font-bold tracking-tight select-none"
            aria-hidden="true"
          >
            CV
          </span>
          <h1 className="text-sm font-semibold tracking-tight">{t("title")}</h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <SaveStatusBadge />
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
