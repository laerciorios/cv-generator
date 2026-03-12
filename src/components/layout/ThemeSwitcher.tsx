"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const t = useTranslations("common");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Render a placeholder until mounted to avoid hydration mismatch.
  // next-themes reads localStorage synchronously in useState, so
  // resolvedTheme is set on the client first render but undefined on server.
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled aria-hidden>
        <span className="sr-only">{t("toggleTheme")}</span>
      </Button>
    );
  }

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button variant="outline" size="sm" onClick={() => setTheme(nextTheme)}>
      {resolvedTheme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
      <span className="sr-only">{t("toggleTheme")}</span>
    </Button>
  );
}
