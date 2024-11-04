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
import { useTranslation } from "react-i18next";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { addGoalList } from "../../services/goal";
import { useEffect, useState } from "react";
import MediaDialog from "../../components/MediaDialog";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useSnack } from "../../context/SnackContext";

export default function Date({ handleStep }: StartProps) {
  const loading = useLoading();
  const snack = useSnack();
  const { goals, setGoals } = useGoals();
  const theme = useTheme();
  const { t } = useTranslation();
  const { goToObjectives } = useCustomNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  // Função para incrementar os meses
  const incrementMonths = (months: number, id: number) => {
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

    setGoals((prevGoals) =>
      prevGoals.map((goal, index) =>
        index === id ? { ...goal, months: nextMonths } : goal
      )
    );
  };

  // Função para decrementar os meses
  const decrementMonths = (months: number, id: number) => {
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
    setGoals((prevGoals) =>
      prevGoals.map((goal, index) =>
        index === id ? { ...goal, months: previousMonths } : goal
      )
    );
  };

  function isDarkMode() {
    return theme.palette.mode === "dark";
  }

  function shortTerm(month: number) {
    if (month === 3) return "#c2052e11";
    if (month === 6) return "#f28d0018";
    return "#05c26a13";
  }

  async function handleAddGoalList() {
    loading.show();
    try {
      await addGoalList(goals);
      goToObjectives();
    } catch {
      snack.error(t("Ocorreu um erro ao adicionar as metas"));
    }
    loading.hide();
  }

  useEffect(() => {
    setOpenDialog(true);
  }, []);

  return (
    <Stack direction={"column"} alignItems={"center"} height={"100%"}>
      <MediaDialog media={mediaArray} open={openDialog} />
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
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
          {t("Voltar")}
        </Button>
      </Stack>
      <Card
        sx={{
          maxWidth: "600px",
          width: "100%",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "none",
          minHeight: "600px",
        }}
      >
        <Stack
          spacing={3}
          flexDirection={"column"}
          justifyContent={"space-between"}
          sx={{ minHeight: "600px" }}
        >
          <Box>
            {goals.slice(0, 5).map((goal, index) => (
              <Card
                key={index}
                sx={{
                  display: "flex",

                  justifyContent: "space-between",
                  flexDirection: { xs: "column", md: "row" },
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  boxShadow: "none",
                  backgroundColor: `${isDarkMode() ? "#242933" : "#f9f9f9"}`,
                  "&:hover": {
                    backgroundColor: `${
                      isDarkMode() ? "#24293345" : "#f5f5f5"
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
                  {goal.name}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: shortTerm(goal.months),
                    borderRadius: "10px",
                    padding: "3px",
                    width: { xs: "100%", md: "130px" },
                    marginTop: { xs: "10px", md: 0 },
                  }}
                  display="flex"
                  alignItems="center"
                  justifyContent={"space-between"}
                >
                  <IconButton
                    size="small"
                    aria-label="decrement months"
                    onClick={() => decrementMonths(goal.months, index)}
                  >
                    <Remove sx={{ width: "15px", height: "15px" }} />
                  </IconButton>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    sx={{ marginX: 1, fontWeight: "bold" }}
                  >
                    {goal.months >= 12
                      ? `${goal.months / 12} ${t("ano")}${
                          goal.months / 12 > 1 ? "s" : ""
                        }`
                      : `${goal.months} ${t("meses")}`}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label="increment months"
                    onClick={() => incrementMonths(goal.months, index)}
                  >
                    <Add sx={{ width: "15px", height: "15px" }} />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
          <CustomButton
            onClick={handleAddGoalList}
            variant="contained"
            size="large"
            label={t("Pronto")}
            disabled={loading.state}
          />
        </Stack>
      </Card>
    </Stack>
  );
}

const mediaArray = [
  {
    title: "Dê um tempo certo para suas metas!",
    description:
      "Escolha prazos que funcionem no seu ritmo e conquiste suas metas sem estresse.",
    media: "tutorial/date.png",
  },
];
