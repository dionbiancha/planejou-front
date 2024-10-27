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
import RoundedTextField from "../../components/Form/RoundedTextField";
import RoundedSelectField from "../../components/Form/RoundedSelectField";
import { useSnack } from "../../context/SnackContext";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { updateObjective } from "../../services/objective";
import { useParams } from "react-router-dom";
import { listGoalsByUserId } from "../../services/goal";
import EditIcon from "@mui/icons-material/Edit";

export default function NewObjetive() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { goals, setGoals } = useGoals();
  const { goToHome } = useCustomNavigate();
  const [goal, setGoal] = useState<Goal>();
  const [objective, setObjective] = useState("");
  const [objectiveError, setObjectiveError] = useState("");
  const [repeat, setRepeat] = useState<string>("Diariamente");
  const [selectedDailyDays, setSelectedDailyDays] = useState<string[]>(DAYS);
  const [timesPerWeek, setTimesPerWeek] = useState<string>("3");
  const [remindMe, setRemindMe] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<string>("6 am");

  const snack = useSnack();
  const loading = useLoading();
  const { id } = useParams<{ id: string }>();

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

  async function handleEditObjective() {
    try {
      if (!goal?.id || !goal) return;
      if (!goals[0]?.objectives) return;

      const newObjective: Objective = {
        name: objective,
        repeat: repeat as "Diariamente" | "Semanalmente" | "Uma vez",
        perWeek: repeat === "Semanalmente" ? Number(timesPerWeek) : null,
        selectDaily: repeat === "Diariamente" ? selectedDailyDays : null,
        remindMe: remindMe ? selectedHour : null,
      };
      const data = {
        goalId: id ?? "",
        objectiveId: goals[0]?.objectives[0]?.id ?? "",
        updatedData: newObjective,
      };
      await updateObjective(data);
      snack.success("Objetivo modificado com sucesso!");
      goToHome();
    } catch (e) {
      console.error(e);
    }
  }

  async function listGoals() {
    loading.show();
    try {
      const res = await listGoalsByUserId();
      const goalValues = res.find((g: Goal) => g.id === id);

      if (goalValues) {
        const updatedGoal: Goal[] = [
          {
            id: goalValues.id,
            position: goalValues.position,
            name: goalValues.name,
            months: goalValues.months,
            objectives: goals[0]?.objectives || [],
          },
        ];

        setGoals(updatedGoal);
        setObjective(goalValues.name);
        setGoal(goalValues);

        if (updatedGoal[0]?.objectives) {
          const o: Objective = updatedGoal[0]?.objectives[0];

          setObjective(o.name);
          setRepeat(o.repeat);
          setRemindMe(Boolean(o.remindMe));
          setSelectedDailyDays(o.selectDaily ?? []);
        }
      }
    } catch (e) {
      console.error("Erro ao listar as metas:", e);
    }
    loading.hide();
  }
  function getContextValues() {
    listGoals();
    console.log(goals);
  }

  useEffect(() => {
    getContextValues();
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
          onClick={() => goToHome()}
        >
          Voltar
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
            <Stack flexDirection="row" alignItems={"center"}>
              <EditIcon sx={{ marginRight: "5px", color: "text.secondary" }} />
              <Typography variant="h6" color="text.secondary">
                <b>{t("Editar objetivo")}</b>
              </Typography>
            </Stack>

            {loading.state ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="50px"
                sx={{ borderRadius: "15px" }}
              />
            ) : (
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
            )}
            {loading.state ? (
              <Skeleton
                variant="rectangular"
                width="200px"
                height="40px"
                sx={{ borderRadius: "15px" }}
              />
            ) : (
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
            )}

            {repeat === "Diariamente" && (
              <Stack
                sx={{ overflowX: "auto", paddingBottom: "20px" }}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                {DAYS.map((day) => (
                  <Stack alignItems={"center"} justifyContent={"center"}>
                    {loading.state ? (
                      <Skeleton
                        variant="rectangular"
                        width="30px"
                        height="30px"
                        sx={{ borderRadius: "5px", margin: "13px" }}
                      />
                    ) : (
                      <Checkbox
                        size="large"
                        checked={selectedDailyDays.includes(day)}
                        onChange={() => toggleDaySelection(day)}
                      />
                    )}

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
            <Stack flexDirection={"row"} alignItems={"center"} mb={3}>
              <Typography mr={3} variant="subtitle2">
                <b>{t("Lembrar de marcar")}</b>
              </Typography>
              <Checkbox
                size="medium"
                checked={remindMe}
                onChange={() => setRemindMe(!remindMe)}
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
            <Typography mb={3} variant="subtitle2">
              <b>Meta:</b> {goal?.name}
            </Typography>

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
              onClick={handleEditObjective}
              variant="contained"
              size="large"
              label={"Salvar"}
              disabled={disabledButton()}
            />
          </Stack>
        </Stack>
      </Card>
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
