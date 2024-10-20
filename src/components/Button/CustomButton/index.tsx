import React from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next"; // Supondo que você esteja usando i18next

interface CustomButtonProps {
  onClick: () => void; // Função a ser chamada quando o botão é clicado
  label: string; // Texto do botão
  size?: "small" | "medium" | "large"; // Tamanhos do botão
  variant?: "text" | "outlined" | "contained"; // Tipos de variante do botão
  disabled?: boolean; // Botão desabilitado
  borderRadius?: number; // Raio do botão
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  label,
  size = "medium",
  variant = "contained",
  disabled,
  borderRadius = "20px",
}) => {
  const { t } = useTranslation();

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      sx={{
        borderRadius: borderRadius,
        fontWeight: "bold",
        boxShadow: "none",
        color: "#FFF", // Cor do texto baseado no modo
      }}
      variant={variant}
      size={size}
    >
      {t(label)} {/* Tradução do texto */}
    </Button>
  );
};

export default CustomButton;
