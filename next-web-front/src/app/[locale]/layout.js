import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { headers } from "next/headers";
import { getSiteData } from "@/lib/siteData";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const headersList = await headers();
  const domain = headersList.get("host");

  const data = await getSiteData(domain);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div data-locale={locale}>{children}</div>
    </NextIntlClientProvider>
  );
}
