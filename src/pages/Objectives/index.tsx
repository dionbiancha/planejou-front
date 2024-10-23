import {
  Box,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { format, startOfWeek, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Add, MoreVertOutlined } from "@mui/icons-material";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { useGoals } from "../../context";
import {
  listObjectivesByUserId,
  markObjectiveAsCompleted,
  MarkObjectiveAsCompletedProps,
  ObjectiveListProps,
} from "../../services/objective";
import { useEffect, useState } from "react";
import { useDataUser } from "../../context/UserContext/useUser";

function generateNextSevenDays() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = subDays(new Date(), 6 - i); // Para começar do dia atual e ir para trás
    days.push({
      dayOfWeek: format(date, "EEE", { locale: ptBR }), // Seg, Ter, etc.
      dayOfMonth: format(date, "d"), // Dia do mês
      date: format(date, "yyyy-MM-dd"),
    });
  }
  return days; // Não é necessário inverter, pois já está na ordem correta
}

function getLastMonday() {
  const today = new Date();
  const lastMonday = startOfWeek(today, { weekStartsOn: 1 }); // 1 representa segunda-feira
  return lastMonday;
}

export function Objectives() {
  const { t } = useTranslation();
  const { goToNewObjetive } = useCustomNavigate();
  const theme = useTheme();
  const [objectives, setObjectives] = useState<ObjectiveListProps[]>([]);
  const { goals } = useGoals();
  const [showDetails, setShowDetails] = useState<string[]>([]);
  const { setIncompleteObjectivesToday } = useDataUser();

  const totalObjectives = goals.reduce(
    (acc, goal) => acc + (goal.objectives?.length || 0),
    0
  );

  function getIncompleteObjectivesToday() {
    const today = new Date().toISOString().split("T")[0];
    const incompleteObjectivesToday = objectives.reduce((acc, goal) => {
      return (
        acc +
        (goal.objectives?.filter((o) => !o.completedDays?.includes(today))
          ?.length || 0)
      );
    }, 0);
    setIncompleteObjectivesToday(incompleteObjectivesToday);
    console.log("incompleteObjectivesToday", incompleteObjectivesToday);
  }

  function handleShowDetails(id: string | undefined) {
    if (!id) return;
    if (showDetails.includes(id)) {
      setShowDetails(showDetails.filter((showId) => showId !== id));
    } else {
      setShowDetails([...showDetails, id]);
    }
  }

  async function listObjectives() {
    try {
      const res = await listObjectivesByUserId();
      setObjectives(res);
    } catch (e) {
      console.log(e);
    }
  }

  async function markObjective(data: MarkObjectiveAsCompletedProps) {
    try {
      setObjectives((prev) => {
        const newObjectives = prev.map((o) => {
          if (o.goalId === data.goalId) {
            return {
              ...o,
              objectives: o.objectives?.map((objective) => {
                if (objective.id === data.objectiveId) {
                  return {
                    ...objective,
                    completedDays: objective.completedDays?.includes(
                      new Date().toISOString().split("T")[0]
                    )
                      ? objective.completedDays?.filter(
                          (day) =>
                            day !== new Date().toISOString().split("T")[0]
                        )
                      : [
                          ...(objective.completedDays || []),
                          new Date().toISOString().split("T")[0],
                        ],
                  };
                }
                return objective;
              }),
            };
          }
          return o;
        });
        return newObjectives;
      });
      await markObjectiveAsCompleted(data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    listObjectives();
  }, []);

  useEffect(() => {
    getIncompleteObjectivesToday();
  }, [objectives]);

  return (
    <>
      <Stack flexDirection={"row"}>
        <Box sx={{ width: "100%" }}>
          <Stack flexDirection="column" sx={{ marginRight: "20px" }}>
            <Stack direction="row" alignItems="center" justifyContent="start">
              <Box sx={{ color: theme.palette.text.secondary }} component={"b"}>
                {totalObjectives} {t("OBJETIVOS")}
              </Box>
              <IconButton color="inherit" onClick={() => goToNewObjetive()}>
                <Add
                  sx={{
                    color: theme.palette.text.secondary,
                    height: "25px",
                    width: "25px",
                  }}
                />
              </IconButton>
            </Stack>
            <Collapse
              sx={{ width: "100%" }}
              in={objectives.length > 0}
              timeout="auto"
              unmountOnExit
            >
              <Grid container spacing={2}>
                {objectives.map((o) =>
                  o.objectives?.map((objective, index) => {
                    const objectiveDone = objective.completedDays?.includes(
                      new Date().toISOString().split("T")[0]
                    );

                    function getLastObjectiveDone(date: string) {
                      return objective.completedDays?.includes(date);
                    }

                    function getNumberMissingDays() {
                      const lastMonday = getLastMonday();

                      const objectiveDays = objective.selectDaily;
                      const numberOfDays = objective.perWeek;

                      const weekDays = [];
                      for (
                        let i = 0;
                        i <= (objectiveDays?.length ?? numberOfDays ?? 0);
                        i++
                      ) {
                        const day = new Date(lastMonday);
                        day.setDate(lastMonday.getDate() + i);
                        weekDays.push(format(day, "yyyy-MM-dd"));
                      }

                      const completedCount = weekDays.filter((day) =>
                        objective?.completedDays?.includes(day)
                      ).length;

                      return completedCount;
                    }
                    return (
                      <Grid item xs={12} md={6} sm={12} key={index}>
                        <Card
                          sx={{
                            boxShadow: "none",
                            padding: "10px",
                            borderRadius: "10px",
                            width: "100%",
                            opacity: objectiveDone ? 0.5 : 1,
                          }}
                        >
                          <Stack
                            spacing={3}
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="center"
                              sx={{ width: "100%" }}
                            >
                              <IconButton onClick={() => {}}>
                                <MoreVertOutlined />
                              </IconButton>

                              <Typography
                                onClick={() => handleShowDetails(objective.id)}
                                noWrap={false} // Permite a quebra de linha
                                sx={{
                                  cursor: "pointer",
                                  width: "100%",
                                  wordBreak: "break-word",
                                  textDecoration: objectiveDone
                                    ? "line-through"
                                    : "none",
                                }}
                              >
                                <b>{objective?.name}</b>
                              </Typography>
                            </Stack>
                            <Checkbox
                              size="large"
                              checked={objectiveDone}
                              onChange={() =>
                                markObjective({
                                  goalId: o.goalId,
                                  objectiveId: objective.id,
                                })
                              }
                            />
                          </Stack>

                          <Collapse
                            in={showDetails?.includes(objective.id ?? "")}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Stack>
                              <Stack
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                                padding={2}
                              >
                                {generateNextSevenDays()
                                  .reverse()
                                  .map((day, index) => (
                                    <Stack key={index} alignItems="center">
                                      <Typography
                                        sx={{
                                          fontSize: "10px",
                                          color: getLastObjectiveDone(day.date)
                                            ? theme.palette.primary.main
                                            : "",
                                          textDecoration: getLastObjectiveDone(
                                            day.date
                                          )
                                            ? "line-through"
                                            : "none",
                                        }}
                                        variant="subtitle2"
                                      >
                                        {day.dayOfWeek.slice(0, 3)}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "15px",
                                          color: getLastObjectiveDone(day.date)
                                            ? theme.palette.primary.main
                                            : "",
                                          textDecoration: getLastObjectiveDone(
                                            day.date
                                          )
                                            ? "line-through"
                                            : "none",
                                        }}
                                        variant="h6"
                                      >
                                        {day.dayOfMonth}
                                      </Typography>
                                    </Stack>
                                  ))}
                              </Stack>
                              <Divider sx={{ opacity: 0.5, marginY: "5px" }} />
                              <Stack
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                                mt={1}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  <b>Ganhos</b>
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  <b>+30 XP</b>
                                </Typography>
                              </Stack>
                              <Stack
                                flexDirection={"row"}
                                justifyContent={"space-between"}
                                mt={1}
                              >
                                {objective.repeat !== "Uma vez" && (
                                  <>
                                    <Typography
                                      sx={{
                                        fontSize: "13px",
                                        color: objectiveDone
                                          ? theme.palette.primary.main
                                          : theme.palette.warning.main,
                                      }}
                                    >
                                      <b>Ofensiva</b>
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "13px",
                                        color: objectiveDone
                                          ? theme.palette.primary.main
                                          : theme.palette.warning.main,
                                      }}
                                    >
                                      <b>
                                        {getNumberMissingDays()} de{" "}
                                        {objective.perWeek ??
                                          objective.selectDaily?.length}
                                      </b>
                                    </Typography>
                                  </>
                                )}
                              </Stack>
                            </Stack>
                          </Collapse>
                        </Card>
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </Collapse>
          </Stack>
        </Box>
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            width: "300px",
          }}
        ></Box>
      </Stack>
    </>
  );
}
