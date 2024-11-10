import {
  Box,
  Card,
  Checkbox,
  Collapse,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { format, startOfWeek, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Add, MoreVertOutlined } from "@mui/icons-material";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";

import {
  deleteObjective,
  listObjectivesByUserId,
  markObjectiveAsCompleted,
  MarkObjectiveAsCompletedProps,
} from "../../services/objective";
import { useEffect, useState } from "react";
import { useDataUser } from "../../context/UserContext/useUser";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useSnack } from "../../context/SnackContext";
import MyDivision from "../../features/MyDivision";
import ConfettiExplosion from "react-confetti-explosion";
import { useObjectives } from "../../context/ObjectiveContext/useObjective";
import { getUserRanking } from "../../services/user";
import CustomButton from "../../components/Button/CustomButton";

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

interface selectObjectiveProps {
  goalId: string;
  objectiveId: string;
  name: string;
}

export function Objectives() {
  const { t } = useTranslation();
  const loading = useLoading();
  const { userData, setMyPosition } = useDataUser();
  const snack = useSnack();
  const { goToNewObjetive, goToEditObjetive, goToLandingPage } =
    useCustomNavigate();
  const theme = useTheme();
  const { objectives, setObjectives, setEditObjective } = useObjectives();
  const [showDetails, setShowDetails] = useState<string[]>([]);
  const { setUserData } = useDataUser();
  const [isExploding, setIsExploding] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectObjective, setSelectObjective] = useState<selectObjectiveProps>(
    {} as selectObjectiveProps
  );
  const [menuState, setMenuState] = useState<{
    [key: string]: { anchorEl: HTMLElement | null; open: boolean };
  }>({});

  const newDate = new Date()
    .toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/")
    .reverse()
    .join("-");

  const handleClick = (event: React.MouseEvent<HTMLElement>, name: string) => {
    setMenuState({
      ...menuState,
      [name]: {
        anchorEl: event.currentTarget,
        open: true,
      },
    });
  };

  const handleClose = (name: string) => {
    setMenuState({
      ...menuState,
      [name]: {
        anchorEl: null,
        open: false,
      },
    });
  };

  // function totalObjectives() {
  //   return (
  //     objectives?.reduce(
  //       (acc, goal) => acc + (goal.objectives?.length || 0),
  //       0
  //     ) || 0
  //   );
  // }

  function getIncompleteObjectivesToday() {
    const today = newDate;
    const incompleteObjectivesToday = objectives.reduce((acc, goal) => {
      return (
        acc +
        (goal.objectives?.filter((o) => !o.completedDays?.includes(today))
          ?.length || 0)
      );
    }, 0);
    setUserData((prev) => ({ ...prev, incompleteObjectivesToday }));
  }

  function handleShowDetails(id: string | undefined) {
    if (!id) return;
    if (showDetails.includes(id)) {
      setShowDetails(showDetails.filter((showId) => showId !== id));
    } else {
      setShowDetails([...showDetails, id]);
    }
  }

  function freeTrialValidation() {
    const expiredDate = userData?.testEndDate;

    if (expiredDate && userData.isPremium === false) {
      const currentDate = new Date();
      const expirationDate = expiredDate.toDate(); // Convert Timestamp to Date

      if (currentDate > expirationDate) {
        // Redirecionar ou tomar alguma ação
        goToLandingPage(); // ajuste o caminho conforme necessário
        return true;
      }
    }
    return false;
  }

  async function markObjective(
    data: MarkObjectiveAsCompletedProps,
    objectiveDone?: boolean
  ) {
    if (freeTrialValidation()) {
      snack.error(t("Seu período de teste expirou!"));
      return;
    }
    try {
      setObjectives((prev) => {
        const newObjectives = prev.map((o) => {
          if (o.goalId === data.objectives.goalId) {
            return {
              ...o,
              objectives: o.objectives?.map((objective) => {
                if (objective.id === data.objectiveId) {
                  return {
                    ...objective,
                    completedDays: objective.completedDays?.includes(newDate)
                      ? objective.completedDays?.filter(
                          (day) => day !== newDate
                        )
                      : [...(objective.completedDays || []), newDate],
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
      if (objectiveDone) {
        setUserData((prev) => ({
          ...prev,
          xp: prev.xp - data.xp,
          totalXp: prev.totalXp - data.xp,
        }));
      } else {
        setUserData((prev) => ({
          ...prev,
          xp: prev.xp + data.xp,
          totalXp: prev.totalXp + data.xp,
        }));
      }

      await markObjectiveAsCompleted(data);
      await handleGetDivision(userData.league);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleGetDivision(league: number) {
    loading.show();
    try {
      const ranking = await getUserRanking(league);
      setMyPosition(ranking.position);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
    loading.hide();
  }

  async function handleDeleteObjective() {
    loading.show();
    setOpenDeleteDialog(false);
    try {
      await deleteObjective({
        goalId: selectObjective.goalId,
        objectiveId: selectObjective.objectiveId,
      });
      handlelistObjectives();
      snack.success(t("Objetivo excluído com sucesso!"));
    } catch (e) {
      console.log(e);
      snack.error(t("Erro ao excluir objetivo!"));
    }
    loading.hide();
  }

  async function handlelistObjectives() {
    try {
      const res = await listObjectivesByUserId();
      setObjectives(res);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getIncompleteObjectivesToday();
  }, [objectives]);

  return (
    <>
      <DeleteDialog
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        title={t("Tem certeza?")}
        description={t(
          "Se você excluir esse objetivo, todos os seus registros serão perdidos para sempre."
        )}
        textButtonCancel={t("Cancelar")}
        textButtonConfirm={t(`Excluir`)}
        onConfirm={handleDeleteObjective}
      />
      <Stack flexDirection={{ xs: "column-reverse", lg: "row" }}>
        <Box sx={{ width: "100%" }}>
          <Stack flexDirection="column">
            <Collapse
              sx={{ width: "100%" }}
              in={objectives.length > 0}
              timeout="auto"
              unmountOnExit
            >
              <Grid container spacing={2}>
                {objectives.map((o) =>
                  o.objectives?.map((objective, index) => {
                    const objectiveDone =
                      objective.completedDays?.includes(newDate);

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
                      if (completedCount === 0) return 1;
                      return completedCount + 1;
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
                              <IconButton
                                onClick={(event) =>
                                  handleClick(event, objective.name)
                                }
                              >
                                <MoreVertOutlined />
                              </IconButton>
                              <Menu
                                id={`basic-menu-${objective.name}`}
                                anchorEl={menuState[objective.name]?.anchorEl}
                                open={menuState[objective.name]?.open || false}
                                onClose={() => handleClose(objective.name)}
                                PaperProps={{
                                  sx: {
                                    padding: "5px",
                                    marginLeft: "20px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                  },
                                }}
                              >
                                <MenuItem
                                  sx={{ opacity: 0.3 }}
                                  onClick={() => {
                                    handleClose(objective.name);
                                  }}
                                >
                                  <ListItemIcon>
                                    <ReplayIcon
                                      sx={{
                                        width: "20px",
                                      }}
                                    />
                                  </ListItemIcon>
                                  {t("Lembrar")}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    if (freeTrialValidation()) {
                                      snack.error(
                                        t("Seu período de teste expirou!")
                                      );
                                      return;
                                    }
                                    setEditObjective({
                                      goalId: o.goalId,
                                      objective: objective,
                                    });
                                    goToEditObjetive();
                                    handleClose(objective.name);
                                  }}
                                >
                                  <ListItemIcon>
                                    <EditIcon
                                      sx={{
                                        width: "20px",
                                      }}
                                    />
                                  </ListItemIcon>
                                  {t("Editar")}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    if (freeTrialValidation()) {
                                      snack.error(
                                        t("Seu período de teste expirou!")
                                      );
                                      return;
                                    }
                                    setSelectObjective({
                                      goalId: o.goalId,
                                      objectiveId: objective.id ?? "",
                                      name: objective.name,
                                    });
                                    setOpenDeleteDialog(true);
                                    handleClose(objective.name);
                                  }}
                                >
                                  <ListItemIcon>
                                    <DeleteIcon sx={{ width: "20px" }} />
                                  </ListItemIcon>
                                  {t("Excluir")}
                                </MenuItem>
                              </Menu>
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
                            {isExploding && objectiveDone && (
                              <ConfettiExplosion
                                particleCount={50}
                                particleSize={8}
                              />
                            )}
                            <Checkbox
                              size="large"
                              checked={objectiveDone}
                              onChange={() => {
                                if (!objectiveDone) {
                                  setIsExploding(true);
                                } else {
                                  setIsExploding(false);
                                }
                                markObjective(
                                  {
                                    objectives: o,
                                    objectiveId: objective.id,
                                    xp:
                                      (objectiveDone
                                        ? getNumberMissingDays() === 1
                                          ? 1
                                          : getNumberMissingDays() - 1
                                        : getNumberMissingDays()) * 30,
                                  },
                                  objectiveDone
                                );
                              }}
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
                                  <b>
                                    {objectiveDone ? t("Próximo") : t("Ganhos")}
                                  </b>
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "13px",
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  <b>{`+${getNumberMissingDays() * 30} XP`}</b>
                                </Typography>
                              </Stack>
                              {getNumberMissingDays() > 1 && (
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
                                        <b>{t("Bonus")}</b>
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
                              )}
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
            width: "600px",
          }}
        >
          <Box sx={{ marginLeft: "20px", width: "100%", mb: "20px" }}>
            <CustomButton
              icon={
                <Add
                  sx={{
                    height: "25px",
                    width: "25px",
                  }}
                />
              }
              variant="contained"
              fullWidth
              onClick={() => goToNewObjetive()}
              disabled={loading.state}
              size="medium"
              label="Adicionar objetivo"
            />
          </Box>
          <MyDivision />
        </Box>
      </Stack>
    </>
  );
}
