import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./translation/i18n.ts";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <Analytics />
    <App />
  </I18nextProvider>
);
