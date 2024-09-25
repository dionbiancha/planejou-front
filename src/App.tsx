import { useState } from "react";
import "./App.css";
import "./translation/i18n";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  return (
    <>
      <h1>Vite + {t("welcome")}</h1>
    </>
  );
}

export default App;
