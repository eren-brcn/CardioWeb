import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import tr from "./locales/tr/translation.json";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";
import es from "./locales/es/translation.json";

const storageKey = "cardioweb_language";
const savedLang = localStorage.getItem(storageKey);
const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
const supportedLanguages = ["en", "tr", "de", "fr", "es"];
const initialLang = supportedLanguages.includes(savedLang)
  ? savedLang
  : supportedLanguages.includes(browserLang)
    ? browserLang
    : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
    de: { translation: de },
    fr: { translation: fr },
    es: { translation: es }
  },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

i18n.on("languageChanged", (lang) => {
  localStorage.setItem(storageKey, lang);
});

export default i18n;
