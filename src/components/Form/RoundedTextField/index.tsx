import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

// Define as props do componente
interface RoundedTextFieldProps
  extends Omit<TextFieldProps, "error" | "helperText"> {
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  variant?: TextFieldProps["variant"];
}

const RoundedTextField: React.FC<RoundedTextFieldProps> = ({
  label,
  placeholder,
  fullWidth = true,
  value,
  onChange,
  variant = "outlined",
  error = false,
  helperText = "",
  ...props
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      variant={variant}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "15px", // Ajuste o valor conforme necessário
        },
      }}
      {...props}
    />
  );
};

export default RoundedTextField;
