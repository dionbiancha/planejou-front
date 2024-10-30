import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation";
import ptTranslation from "./locales/pt/translation";
import esTranslation from "./locales/es/translation";

i18n
  .use(LanguageDetector) // Detecta a linguagem automaticamente (opcional)
  .use(initReactI18next) // Conecta com o React
  .init({
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
    fallbackLng: "en", // Idioma padrão se o detectado não estiver disponível
    interpolation: {
      escapeValue: false, // React já escapa por padrão
    },
  });

export default i18n;
