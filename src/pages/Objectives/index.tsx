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
import { useGoals } from "../../context";
import {
  deleteObjective,
  listObjectivesByUserId,
  markObjectiveAsCompleted,
  MarkObjectiveAsCompletedProps,
  ObjectiveListProps,
} from "../../services/objective";
import { useEffect, useState } from "react";
import { useDataUser } from "../../context/UserContext/useUser";
import { getHasList } from "../../services/goal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useSnack } from "../../context/SnackContext";

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
  const snack = useSnack();
  const { goToNewObjetive, goToStart, goToEditObjetive } = useCustomNavigate();
  const theme = useTheme();
  const [objectives, setObjectives] = useState<ObjectiveListProps[]>([]);
  const { setGoals } = useGoals();
  const [showDetails, setShowDetails] = useState<string[]>([]);
  const { setUserData } = useDataUser();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectObjective, setSelectObjective] = useState<selectObjectiveProps>(
    {} as selectObjectiveProps
  );
  const [menuState, setMenuState] = useState<{
    [key: string]: { anchorEl: HTMLElement | null; open: boolean };
  }>({});

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

  const totalObjectives = objectives.length;

  function getIncompleteObjectivesToday() {
    const today = new Date().toISOString().split("T")[0];
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

  async function listObjectives() {
    try {
      const res = await listObjectivesByUserId();
      setObjectives(res);
    } catch (e) {
      console.log(e);
    }
  }

  async function markObjective(
    data: MarkObjectiveAsCompletedProps,
    objectiveDone?: boolean
  ) {
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
      if (objectiveDone) {
        setUserData((prev) => ({ ...prev, xp: prev.xp + data.xp }));
      } else {
        setUserData((prev) => ({ ...prev, xp: prev.xp - data.xp }));
      }

      await markObjectiveAsCompleted(data);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleHasList() {
    try {
      const res = await getHasList();
      setUserData((prev) => ({ ...prev, hasList: res }));
      if (!res) {
        goToStart();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteObjective() {
    loading.show();
    setOpenDeleteDialog(false);
    try {
      await deleteObjective({
        goalId: selectObjective.goalId,
        objectiveId: selectObjective.objectiveId,
      });
      listObjectives();
      snack.success("Objetivo excluído com sucesso!");
    } catch (e) {
      console.log(e);
      snack.error("Erro ao excluir objetivo!");
    }
    loading.hide();
  }

  useEffect(() => {
    handleHasList();
    listObjectives();
  }, []);

  useEffect(() => {
    getIncompleteObjectivesToday();
  }, [objectives]);

  return (
    <>
      <DeleteDialog
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        title="Tem certeza?"
        description="Se você excluir esse objetivo, todos os seus registros serão perdidos para sempre."
        textButtonCancel="Cancelar"
        textButtonConfirm={`Excluir`}
        objetive={selectObjective.name}
        onConfirm={handleDeleteObjective}
      />
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
                      if (completedCount === 0) return 1;
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
                                  onClick={() => handleClose(objective.name)}
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
                                    setGoals([
                                      {
                                        position: "",
                                        name: "",
                                        months: 1,
                                        objectives: [objective],
                                      },
                                    ]);
                                    goToEditObjetive(o.goalId ?? "");
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
                            <Checkbox
                              size="large"
                              checked={objectiveDone}
                              onChange={() => {
                                markObjective(
                                  {
                                    goalId: o.goalId,
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
                                  <b>{objectiveDone ? "Próximo" : "Ganhos"}</b>
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
