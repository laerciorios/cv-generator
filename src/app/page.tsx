import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { APP_LOCALE_COOKIE, isAppLocale, routing } from "@/i18n/routing";

export default async function Home() {
  const cookieStore = await cookies();
  const persistedLocale =
    cookieStore.get(APP_LOCALE_COOKIE)?.value ??
    cookieStore.get("NEXT_LOCALE")?.value;
  const locale = isAppLocale(persistedLocale)
    ? persistedLocale
    : routing.defaultLocale;

  redirect(`/${locale}`);
}
