import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#05c26a", // Cor principal para o modo claro
      light: "#05c26a13", // Cor de destaque para o modo claro
    },
    success: {
      main: "#05c26a", // Cor principal para os sucessos
    },
    background: {
      default: "#F5F5F5", // Cor de fundo padrão para o modo claro
      paper: "#FFFFFF", // Cor de fundo para elementos como cards
    },
    text: {
      primary: "#000000", // Cor principal para o texto
      secondary: "#4F4F4F", // Cor secundária para o texto
    },
    error: {
      main: "#f87272", // Cor principal para os erros
    },
    warning: {
      main: "#FBBD23", // Cor principal para os avisos
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#05c26a", // Cor principal para o modo escuro
    },
    success: {
      main: "#05c26a", // Cor principal para os sucessos
    },
    background: {
      default: "#242933", // Cor de fundo padrão para o modo escuro
      paper: "#2A303C", // Cor de fundo para elementos como cards
    },
    text: {
      primary: "#A5ACBA", // Cor principal para o texto
      secondary: "#A6ADBA", // Cor secundária para o texto
    },
    error: {
      main: "#f87272", // Cor principal para os erros
    },
    warning: {
      main: "#FBBD23", // Cor principal para os avisos
    },
  },
});
