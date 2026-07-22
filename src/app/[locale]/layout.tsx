import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { routing } from "@/i18n/routing";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<LocaleLayoutProps>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="mx-auto w-full max-w-[100rem] flex-1 px-4 py-5 sm:px-6">
            {children}
          </main>
        </div>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
