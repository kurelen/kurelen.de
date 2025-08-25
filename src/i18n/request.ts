import { getRequestConfig, setRequestLocale } from "next-intl/server";

export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) as string | undefined;
  const safeLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  setRequestLocale(safeLocale);

  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default,
  };
});
