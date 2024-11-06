import {
  Box,
  Card,
  Stack,
  Typography,
  Button,
  Checkbox,
  useTheme,
  Skeleton,
} from "@mui/material";
import CustomButton from "../../components/Button/CustomButton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGoals } from "../../context";
import { ArrowBack } from "@mui/icons-material";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { Goal, Objective } from "../../context/GoalContext/GoalContext";
import RoundedSelectGoalField from "../../features/RoundedSelectGoalField";
import RoundedTextField from "../../components/Form/RoundedTextField";
import RoundedSelectField from "../../components/Form/RoundedSelectField";
import { useSnack } from "../../context/SnackContext";
import { listGoalsByUserId } from "../../services/goal";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { addObjective } from "../../services/objective";

export default function NewObjective() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { goToObjectives } = useCustomNavigate();
  const [goal, setGoal] = useState<Goal>();
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const [objective, setObjective] = useState("");
  const [objectiveError, setObjectiveError] = useState("");
  const [repeat, setRepeat] = useState<string>("Diariamente");
  const [selectedDailyDays, setSelectedDailyDays] = useState<string[]>(DAYS);
  const [timesPerWeek, setTimesPerWeek] = useState<string>("3");
  const [remindMe] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<string>("6 am");
  const { goals, setGoals } = useGoals();
  const snack = useSnack();
  const loading = useLoading();

  const toggleDaySelection = (day: string) => {
    setSelectedDailyDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((selectedDay) => selectedDay !== day)
        : [...prevSelectedDays, day]
    );
  };

  function disabledButton() {
    if (repeat === "Diariamente") {
      return (
        Boolean(objectiveError) ||
        !objective ||
        !goal ||
        selectedDailyDays.length === 0
      );
    }
    if (repeat === "Semanalmente") {
      return Boolean(objectiveError) || !objective || !goal || !timesPerWeek;
    }
    if (repeat === "Uma vez") {
      return Boolean(objectiveError) || !objective || !goal;
    }
  }

  function getInfoText() {
    if (repeat === "Diariamente") {
      return t(
        "Bora cumprir seus objetivos nos dias que você marcou, tudo no esquema!"
      );
    }
    if (repeat === "Semanalmente") {
      return t(
        "Pode fazer qualquer dia da semana, só bate o número de vezes que tá de boa!"
      );
    }
    if (repeat === "Uma vez") {
      return t("Só precisa alcançar o objetivo uma vez e já tá feito!");
    }
  }

  function validateObjectiveName() {
    if (objective.length > 30) {
      setObjectiveError(
        t(
          "O nome do hábito deve ser curto, exemplo: 'Parar de fumar' (máximo de 30 caracteres)."
        )
      );
    } else {
      setObjectiveError("");
    }
  }

  async function handleAddObjective() {
    try {
      if (!goal?.id || !goal) return;
      const newObjective: Objective = {
        name: objective,
        repeat: repeat as "Diariamente" | "Semanalmente" | "Uma vez",
        perWeek: repeat === "Semanalmente" ? Number(timesPerWeek) : null,
        selectDaily: repeat === "Diariamente" ? selectedDailyDays : null,
        remindMe: remindMe ? selectedHour : null,
      };
      const data = {
        goal: goal,
        objectives: newObjective,
      };
      await addObjective(data);
      snack.success("Objetivo criado com sucesso!");
      goToObjectives();
    } catch (e) {
      console.error(e);
    }
  }

  async function listGoals() {
    loading.show();
    try {
      const res = await listGoalsByUserId();
      setGoals(res);
    } catch (e) {
      console.error("Erro ao listar as metas:", e);
    }
    loading.hide();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    listGoals();
  }, []);

  return (
    <Stack direction={"column"} alignItems={"center"} height={"100%"}>
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
          onClick={() => goToObjectives()}
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
          <Stack spacing={3}>
            {loading.state ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"50px"}
                sx={{ borderRadius: "15px" }}
              />
            ) : (
              <RoundedSelectGoalField
                items={goals}
                label={t("Minha meta é...")}
                onChange={(goal) => {
                  setGoal(goal);
                }}
                value={goal}
                fullWidth
                placeholder={t("Selecione uma meta")}
              />
            )}

            <RoundedTextField
              fullWidth
              label={t("Objetivo")}
              variant="outlined"
              error={Boolean(objectiveError)}
              helperText={objectiveError ? t(objectiveError) : ""}
              value={objective}
              onBlur={validateObjectiveName}
              onChange={(event) => setObjective(event.target.value)}
              placeholder={t("Vou alcançar minha meta se...")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                },
              }}
            />
            <Stack flexDirection={"row"} alignItems={"center"}>
              <Typography mr={3} variant="subtitle2">
                <b>{t("Repete")}</b>
              </Typography>
              <RoundedSelectField
                size="small"
                items={REPEAT_OPTIONS}
                onChange={(e) => setRepeat(e.target.value)}
                value={repeat}
                placeholder={t("Selecione uma opção")}
              />
            </Stack>
            {repeat === "Diariamente" && (
              <Stack
                sx={{ overflowX: "auto", paddingBottom: "20px" }}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                {DAYS.map((day) => (
                  <Stack alignItems={"center"} justifyContent={"center"}>
                    <Checkbox
                      size="large"
                      checked={selectedDailyDays.includes(day)}
                      onChange={() => toggleDaySelection(day)}
                    />
                    <Typography variant="subtitle1">{day.charAt(0)}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}

            {repeat === "Semanalmente" && (
              <Stack flexDirection={"row"} alignItems={"center"}>
                <Typography mr={3} variant="subtitle2">
                  <b>{t("Por semana")}</b>
                </Typography>
                <RoundedSelectField
                  size="small"
                  items={["1", "2", "3", "4", "5", "6", "7"]}
                  onChange={(e) => setTimesPerWeek(e.target.value)}
                  value={timesPerWeek}
                  placeholder={t("Selecione uma opção")}
                />
              </Stack>
            )}
            <Stack
              sx={{ opacity: 0.2 }}
              flexDirection={"row"}
              alignItems={"center"}
              mb={3}
            >
              <Typography mr={3} variant="subtitle2">
                <b>{t("Lembrar de marcar")}</b>
              </Typography>
              <Checkbox
                size="medium"
                checked={remindMe}
                onChange={() => {
                  // setRemindMe(!remindMe)
                }}
              />
            </Stack>
            {remindMe && (
              <Stack flexDirection={"row"} alignItems={"center"}>
                <Typography mr={3} variant="subtitle2">
                  <b>{t("As")}</b>
                </Typography>
                <RoundedSelectField
                  size="small"
                  items={HOURS}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  value={selectedHour}
                  placeholder={t("Selecione uma opção")}
                />
              </Stack>
            )}
          </Stack>

          <Stack>
            <Box
              sx={{
                padding: "20px",
                width: "100%",

                borderRadius: "15px",
                mb: "20px",
                backgroundColor: theme.palette.primary.light,
              }}
            >
              <Typography variant="subtitle2">{getInfoText()}</Typography>
            </Box>
            <CustomButton
              onClick={handleAddObjective}
              variant="contained"
              size="large"
              label={"Criar Objetivo"}
              disabled={disabledButton()}
            />
          </Stack>
        </Stack>
      </Card>

      <Box
        sx={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          padding: "15px",
          mt: "15px",
        }}
      >
        <Typography color="textSecondary" variant="subtitle2">
          "{t(currentTip)}"
        </Typography>
      </Box>
    </Stack>
  );
}

const REPEAT_OPTIONS = ["Diariamente", "Semanalmente", "Uma vez"];

const HOURS = [
  "0 am",
  "1 am",
  "2 am",
  "3 am",
  "4 am",
  "5 am",
  "6 am",
  "7 am",
  "8 am",
  "9 am",
  "10 am",
  "11 am",
  "12 pm",
  "1 pm",
  "2 pm",
  "3 pm",
  "4 pm",
  "5 pm",
  "6 pm",
  "7 pm",
  "8 pm",
  "9 pm",
  "10 pm",
  "11 pm",
];

const DAYS = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

const tips = [
  "Garanta que seu objetivo possa ser medido, para acompanhar o progresso.",
  "Seu objetivo tem que caber no bolso, no tempo e na energia. Nada de tentar comprar uma ferrari se você mal tem uma bicicleta!",
  "Bora ser pé no chão: seu objetivo precisa ser viável. Não adianta querer subir o Everest se você ainda se perde no Google Maps!",
  "O objetivo tem que fazer sentido com seus planos. Tipo, não adianta querer ser vegano se a sua comida favorita ainda é churrasco!",
  "Comece seus objetivos com verbos que indicam ação, como 'implementar', 'aumentar', 'reduzir', ou 'melhorar'. Isso traz clareza sobre o que precisa ser feito.",
];
