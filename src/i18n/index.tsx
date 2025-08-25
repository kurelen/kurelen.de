"use client";

import React, { createContext, useContext } from "react";
import en from "./messages/en";
import de from "./messages/de";

export type Locale = "en" | "de";
export type Messages = typeof en;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type Leaves<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object
          ? Join<K, Leaves<T[K]>>
          : K
        : never;
    }[keyof T]
  : never;

type TKey = Leaves<Messages>;

const dictionaries: Record<Locale, Messages> = { en, de };

function get<T>(obj: T, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
}

type I18nContextValue = { t: <K extends TKey>(key: K) => string };

const I18nCtx = createContext<I18nContextValue>({
  t: (k) => k as string,
});

export function I18nProvider({
  children,
  locale = "en",
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  const dict = dictionaries[locale] ?? en;
  const t: I18nContextValue["t"] = (key) => {
    const v = get<Messages>(dict, key);
    return typeof v === "string" ? v : (key as string);
  };
  return <I18nCtx.Provider value={{ t }}>{children}</I18nCtx.Provider>;
}

export function useT() {
  return useContext(I18nCtx).t;
}
