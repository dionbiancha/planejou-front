import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { StartProps, Step } from "../../types";
import CustomButton from "../../components/Button/CustomButton";
import { useGoals } from "../../context";
import { ArrowBack, Add, Remove } from "@mui/icons-material";
import { useState } from "react";

export default function Date({ handleStep }: StartProps) {
  const { goals } = useGoals();
  const theme = useTheme();

  // Estado para controlar a quantidade de meses
  const [months, setMonths] = useState<number>(3);

  // Função para incrementar os meses
  const incrementMonths = () => {
    const nextMonths =
      months === 3
        ? 6
        : months === 6
        ? 12
        : months === 12
        ? 24
        : months === 24
        ? 48
        : 3;
    setMonths(nextMonths);
  };

  // Função para decrementar os meses
  const decrementMonths = () => {
    const previousMonths =
      months === 48
        ? 24
        : months === 24
        ? 12
        : months === 12
        ? 6
        : months === 6
        ? 3
        : 3;
    setMonths(previousMonths);
  };

  function isDarkMode() {
    return theme.palette.mode === "dark";
  }

  return (
    <Stack direction={"column"} alignItems={"center"} height={"100%"}>
      <Box
        sx={{
          maxWidth: "600px",
          width: "100%",
          padding: "10px",
        }}
      >
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBack sx={{ height: "20px" }} />}
          onClick={() => handleStep(Step.Goal)}
        >
          Voltar
        </Button>
      </Box>
      <Card
        sx={{
          maxWidth: "600px",
          width: "100%",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "none",
          maxHeight: "600px",
          height: "100%",
        }}
      >
        <Stack
          spacing={3}
          flexDirection={"column"}
          justifyContent={"space-between"}
          height={"100%"}
        >
          <Box>
            {goals.slice(0, 5).map((goal, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  boxShadow: "none",
                  backgroundColor: `${isDarkMode() ? "#333" : "#f9f9f9"}`,
                  "&:hover": {
                    backgroundColor: `${
                      isDarkMode() ? "#33333384" : "#f5f5f5"
                    }`,
                  },
                }}
              >
                <Typography color="textPrimary">
                  <Box
                    component={"span"}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      marginRight: "10px",
                      color: "text.secondary",
                    }}
                  >
                    {index + 1}.
                  </Box>
                  {goal.content}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: "#05c26a13",
                    borderRadius: "10px",
                    padding: "3px",
                    width: "130px",
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent={"space-between"}
                >
                  <IconButton
                    size="small"
                    aria-label="decrement months"
                    onClick={decrementMonths}
                  >
                    <Remove sx={{ width: "15px", height: "15px" }} />
                  </IconButton>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    sx={{ marginX: 1, fontWeight: "bold" }}
                  >
                    {months >= 12
                      ? `${months / 12} ano${months / 12 > 1 ? "s" : ""}`
                      : `${months} meses`}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label="increment months"
                    onClick={incrementMonths}
                  >
                    <Add sx={{ width: "15px", height: "15px" }} />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
          <CustomButton
            onClick={() => handleStep(Step.Objective)}
            variant="contained"
            size="large"
            label={"Próximo"}
            // disabled={disabledButton()}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
