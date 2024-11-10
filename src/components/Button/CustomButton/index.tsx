import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

interface CustomButtonProps {
  icon?: React.ReactNode;
  fullWidth?: boolean;
  color?: string;
  onClick: () => void;
  label: string;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
  borderRadius?: number;
  loading?: boolean; // Nova prop para exibir o estado de carregamento
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  icon,
  label,
  color,
  size = "medium",
  variant = "contained",
  disabled,
  borderRadius = 20,
  loading = false,
  fullWidth,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      startIcon={icon}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        backgroundColor: color,
        width: fullWidth ? "100%" : "auto",
        borderRadius: borderRadius,
        fontWeight: "bold",
        boxShadow: "none",
        color: "#FFF",
        textTransform: "none",
      }}
      variant={variant}
      size={size}
    >
      {loading ? (
        <CircularProgress color="inherit" size={20} sx={{ padding: "3px" }} />
      ) : (
        t(label) // Texto traduzido
      )}
    </Button>
  );
};

export default CustomButton;
