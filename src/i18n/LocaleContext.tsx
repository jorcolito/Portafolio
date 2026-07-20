"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "es" | "en";

const STORAGE_KEY = "jorge-colamarco.locale.v1";

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.title = selectLocale(
    locale,
    "Jorge Colamarco — Portafolio interactivo",
    "Jorge Colamarco — Interactive portfolio",
  );
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  text: (spanish: string, english: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function selectLocale<T>(locale: Locale, spanish: T, english: T): T {
  return locale === "en" ? english : spanish;
}

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>("es");

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    applyDocumentLocale(nextLocale);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {
      // The preference still works for this visit when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private or hardened browser modes can deny storage access.
    }
    const preferred: Locale =
      stored === "es" || stored === "en"
        ? stored
        : window.navigator.language.toLowerCase().startsWith("en")
          ? "en"
          : "es";

    const frame = window.requestAnimationFrame(() => {
      setLocaleState(preferred);
      applyDocumentLocale(preferred);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      text: (spanish, english) => selectLocale(locale, spanish, english),
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      <div data-locale={locale}>{children}</div>
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }
  return value;
}
