import { setRequestLocale } from "next-intl/server";
import { CVEditorWorkspace } from "@/components/editor/CVEditorWorkspace";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CVEditorWorkspace />;
}
