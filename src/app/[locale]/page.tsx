import { getTranslations, setRequestLocale } from "next-intl/server";
import { CVEditorWorkspace } from "@/components/editor/CVEditorWorkspace";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <div className="grid gap-6">
      <section className="bg-card grid gap-4 rounded-2xl border p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("welcomeTitle")}
        </h2>
        <p className="text-muted-foreground">{t("welcomeDescription")}</p>
      </section>
      <CVEditorWorkspace />
    </div>
  );
}
