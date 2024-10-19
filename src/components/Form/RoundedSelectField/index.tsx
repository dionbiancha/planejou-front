import React from "react";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

// Define as props do componente
interface RoundedSelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (event: SelectChangeEvent) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  items: string[];
  size?: "small" | "medium";
}

const RoundedSelectField: React.FC<RoundedSelectFieldProps> = ({
  label,
  placeholder,
  fullWidth = true,
  value,
  onChange,
  error = false,
  items,
  size,
  ...props
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Box
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "15px",
        },
      }}
    >
      <FormControl fullWidth={fullWidth} error={error}>
        {label && <InputLabel>{label}</InputLabel>}
        <Select
          label={label}
          value={value}
          onChange={handleChange}
          size={size}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
          {...props}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {items.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RoundedSelectField;
