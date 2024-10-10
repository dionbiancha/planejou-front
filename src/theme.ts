import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#05c26a", // Cor principal para o modo claro
    },
    background: {
      default: "#F5F5F5", // Cor de fundo padrão para o modo claro
      paper: "#FFFFFF", // Cor de fundo para elementos como cards
    },
    text: {
      primary: "#000000", // Cor principal para o texto
      secondary: "#4F4F4F", // Cor secundária para o texto
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#05c26a", // Cor principal para o modo escuro
    },
    background: {
      default: "#121212", // Cor de fundo padrão para o modo escuro
      paper: "#1D1D1D", // Cor de fundo para elementos como cards
    },
    text: {
      primary: "#FFF", // Cor principal para o texto
      secondary: "#A0A0A0", // Cor secundária para o texto
    },
  },
});
