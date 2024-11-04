import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation";
import ptTranslation from "./locales/pt/translation";
import esTranslation from "./locales/es/translation";

// Configura o detector de linguagem para verificar o localStorage
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: "localStorageLanguageDetector",
  lookup() {
    return localStorage.getItem("language") || undefined;
  },
  cacheUserLanguage(lng) {
    localStorage.setItem("language", lng);
  },
});

i18n
  .use(languageDetector) // Usa o detector de linguagem personalizado
  .use(initReactI18next) // Conecta com o React
  .init({
    detection: {
      order: ["localStorageLanguageDetector", "navigator"], // Primeiro verifica no localStorage, depois no navegador
      caches: ["localStorage"], // Cacheia a seleção de linguagem no localStorage
    },
    resources: {
      en: {
        translation: enTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
      es: {
        translation: esTranslation,
      },
    },
    fallbackLng: "pt-BR", // Idioma padrão se o detectado não estiver disponível
    interpolation: {
      escapeValue: false, // React já escapa por padrão
    },
  });

export default i18n;
