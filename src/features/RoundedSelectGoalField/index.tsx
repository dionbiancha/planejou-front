import React from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { Goal } from "../../context/GoalContext/GoalContext";

// Define as props do componente
interface RoundedSelectGoalFieldProps {
  label: string;
  placeholder?: string;
  value?: Goal;
  onChange: (goal: Goal) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  items: Goal[];
}

const RoundedSelectGoalField: React.FC<RoundedSelectGoalFieldProps> = ({
  label,
  placeholder,
  fullWidth = true,
  value,
  onChange,
  error = false,
  items,
  ...props
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value;
    const selectedGoal = items.find((item) => item.id === selectedId);

    if (selectedGoal) {
      onChange(selectedGoal); // Passa o objeto Goal completo
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
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          value={value?.id || ""}
          onChange={handleChange}
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
          {items.slice(0, 5).map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default RoundedSelectGoalField;
