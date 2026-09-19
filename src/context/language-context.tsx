import React, { createContext, useContext, useState, useEffect } from "react";
import { fr, TranslationType } from "@/locales/fr";
import { en } from "@/locales/en";

export type Locale = "fr" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationType;
}

const translations: Record<Locale, TranslationType> = {
  fr,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("qtransit_locale");
    return (saved as Locale) || "fr";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("qtransit_locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
