import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { headers } from "next/headers";
import { getSiteData } from "@/lib/siteData";
import SidebarMenu from "@/components/call-center/sidebar-menu/sidebar-menu";
import Header from "@/components/call-center/header/header";
import Breadcrumb from "@/components/call-center/breadcrumb/breadcrumb";

export default async function DashboardLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Redirect to the home page with the current locale
  redirect(`/${locale}`);

  // The code below won't execute due to the redirect above
  const headersList = await headers();
  const domain = headersList.get("host");

  const data = await getSiteData(domain);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div data-locale={locale} className="p-[24px]">
        {/* 
        <div className="flex flex-row w-[calc(100vw-48px)] h-[calc(100vh-48px)]">
          <SidebarMenu />
          <div className="flex flex-col w-full h-full">
            <Header />
            {children}
          </div>
        </div>
        */}
      </div>
    </NextIntlClientProvider>
  );
}
