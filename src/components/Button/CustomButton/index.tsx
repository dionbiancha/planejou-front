import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

interface CustomButtonProps {
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
  label,
  size = "medium",
  variant = "contained",
  disabled,
  borderRadius = 20,
  loading = false,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        borderRadius: borderRadius,
        fontWeight: "bold",
        boxShadow: "none",
        color: "#FFF",
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
