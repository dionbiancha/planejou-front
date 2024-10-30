import React from "react";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

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
  endIcon?: React.ReactNode;
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
  endIcon,
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
      autoComplete="off"
      InputProps={{
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : undefined,
      }}
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
