import "@/app/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import HeaderBar from "@/components/layout/HeaderBar";

export const metadata: Metadata = {
  title: "kurelen.de",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <HeaderBar />
          <main className="mx-auto max-w-5xl p-4">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
