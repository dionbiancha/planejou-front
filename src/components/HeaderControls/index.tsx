import React, { useEffect } from "react";
import { Box, IconButton, Select, MenuItem } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { useTranslation } from "react-i18next";
import { useDataUser } from "../../context/UserContext/useUser";

const HeaderControls: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userData, setUserData } = useDataUser();

  function onToggleDarkMode() {
    setUserData((prev) => ({
      ...prev,
      darkMode:
        prev.darkMode === "Desabilitado" ? "Habilitado" : "Desabilitado",
    }));
    localStorage.setItem(
      "darkMode",
      userData.darkMode === "Desabilitado" ? "Habilitado" : "Desabilitado"
    );
  }

  function onLanguageChange(language: string) {
    i18n.changeLanguage(language);
    setUserData((prev) => ({ ...prev, language }));
    localStorage.setItem("language", language);
  }

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    if (!darkMode) {
      localStorage.setItem("darkMode", "Desabilitado");
      setUserData((prev) => ({
        ...prev,
        darkMode: "Desabilitado",
      }));
    }
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ padding: "16px", position: "absolute", top: 0, left: 0, right: 0 }}
    >
      <Box
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "15px",
          },
        }}
      >
        <Select
          value={userData.language ?? i18n.language}
          onChange={(e) => onLanguageChange(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 120, height: 40 }}
        >
          <MenuItem value="en">
            <img
              src={flags.en}
              alt="English Flag"
              style={{ width: 20, marginRight: 8 }}
            />
            {t("Inglês")}
          </MenuItem>
          <MenuItem value="pt-BR">
            <img
              src={flags.pt}
              alt="Português Flag"
              style={{ width: 20, marginRight: 8 }}
            />
            {t("Português")}
          </MenuItem>
          <MenuItem value="es">
            <img
              src={flags.es}
              alt="Español Flag"
              style={{ width: 20, marginRight: 8 }}
            />
            {t("Espanhol")}
          </MenuItem>
        </Select>
      </Box>
      <IconButton onClick={onToggleDarkMode} aria-label="Toggle dark mode">
        <Brightness4Icon />
      </IconButton>
    </Box>
  );
};

export default HeaderControls;

const flags = {
  en: "https://flagpedia.net/data/flags/h80/us.png",
  pt: "https://flagpedia.net/data/flags/h80/br.png",
  es: "https://flagpedia.net/data/flags/h80/es.png",
};
