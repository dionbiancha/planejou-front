import {
  Box,
  Card,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useEffect, useState } from "react";
import { Goal } from "../../context/GoalContext/GoalContext";
import { listGoalsByUserId } from "../../services/goal";
import { MoreVertOutlined } from "@mui/icons-material";
import BorderLinearProgress from "../../components/BorderLinearProgress";
import { useTranslation } from "react-i18next";
import {
  listObjectivesByUserId,
  ObjectiveListProps,
} from "../../services/objective";
import CompletedDaysGrid from "../../components/CompletedDaysGrid";
import MyDivision from "../../features/MyDivision";

export function List() {
  const loading = useLoading();
  const theme = useTheme();
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [objectives, setObjectives] = useState<ObjectiveListProps[]>([]);
  const [showDetails, setShowDetails] = useState<string[]>([]);

  const CAPTION = [
    {
      name: "Completo",
      color: theme.palette.primary.main,
    },
    {
      name: "Incompleto",
      color: theme.palette.background.default,
    },
    {
      name: "Hoje",
      color: theme.palette.warning.main,
    },
  ];

  function handleShowDetails(id: string | undefined) {
    if (!id) return;
    if (showDetails.includes(id)) {
      setShowDetails(showDetails.filter((showId) => showId !== id));
    } else {
      setShowDetails([...showDetails, id]);
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

  function doLater(position: number) {
    return position + 1 > 5;
  }

  function showDivider(position: number) {
    return position + 1 === 5;
  }

  async function listObjectives() {
    try {
      const res = await listObjectivesByUserId();
      setObjectives(res);
    } catch (e) {
      console.log(e);
    }
  }

  function getCompletedObjectives(goalId: string) {
    const objectivesByGoal = objectives.find((obj) => obj.goalId === goalId);
    if (!objectivesByGoal) return 0;
    let totalRepeat = 0;
    let completedDays = 0;
    objectivesByGoal.objectives.map((value) => {
      totalRepeat += value.totalRepeat || 0;
      completedDays += value.completedDays?.length || 0;
    });
    const value = (completedDays * 100) / totalRepeat;
    if (isNaN(value)) return 0;
    return value;
  }

  useEffect(() => {
    listGoals();
    listObjectives();
  }, []);

  return (
    <>
      <Stack flexDirection={"row"}>
        <Collapse
          sx={{ width: "100%" }}
          in={goals.length > 0}
          timeout="auto"
          unmountOnExit
        >
          <Stack width={"100%"} spacing={3}>
            {goals.map((goal, index) => (
              <>
                <Card
                  key={index}
                  sx={{
                    boxShadow: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    width: "99%",
                    opacity: doLater(index) ? 0.5 : 1,
                    cursor: "pointer",
                  }}
                >
                  <Stack direction="row" alignItems="center">
                    <IconButton onClick={() => {}}>
                      <MoreVertOutlined />
                    </IconButton>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      width={"100%"}
                      onClick={() => handleShowDetails(goal.id)}
                    >
                      <Typography
                        noWrap={false} // Permite a quebra de linha
                        sx={{ wordBreak: "break-word" }}
                      >
                        <b>{goal.name}</b>
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box sx={{ width: "100%", padding: "5px" }}>
                    <BorderLinearProgress
                      sx={{ height: "5px" }}
                      variant="determinate"
                      value={getCompletedObjectives(goal.id || "")}
                    />
                  </Box>
                  <Collapse
                    in={showDetails?.includes(goal.id ?? "")}
                    timeout="auto"
                    unmountOnExit
                    sx={{ marginTop: "20px" }}
                  >
                    <CompletedDaysGrid
                      completedDays={objectives
                        .find((g) => g.goalId === goal.id)
                        ?.objectives.map((e) => e.completedDays)
                        .reduce((acc, curr) => acc?.concat(curr ?? ""), [])}
                    />
                    <Stack ml={3.5} flexDirection={"row"} alignItems={"center"}>
                      {CAPTION.map((caption) => (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          margin={1}
                          key={caption.name}
                        >
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              margin: 1,
                              borderRadius: "2px",
                              backgroundColor: caption.color,
                            }}
                          />
                          <Typography
                            sx={{ fontSize: "12px" }}
                            variant="subtitle2"
                          >
                            {t(caption.name)}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    <Typography variant="body2" color="text.secondary" m={1}>
                      <b>{t("Estatísticas")}</b>
                    </Typography>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        sx={{
                          width: "100%",
                          padding: "15px",
                          borderRadius: "10px",
                          border: `2px solid ${theme.palette.background.default}`,
                        }}
                      >
                        <Box
                          width="35px"
                          height="35px"
                          mr={2}
                          component={"img"}
                          src="icons/objective.png"
                        />
                        <Stack direction={"column"}>
                          <Typography variant="h6">
                            <b>
                              {objectives.find((g) => g.goalId === goal.id)
                                ?.objectives.length ?? 0}
                            </b>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>{t("Objetivos")}</b>
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        sx={{
                          mt: { xs: 1, md: 0 },
                          width: "100%",
                          padding: "15px",
                          borderRadius: "10px",
                          border: `2px solid ${theme.palette.background.default}`,
                        }}
                      >
                        <Box
                          width="35px"
                          height="35px"
                          mr={2}
                          component={"img"}
                          src="icons/checked.png"
                        />
                        <Stack direction={"column"}>
                          <Typography variant="h6">
                            <b>
                              {objectives
                                .find((g) => g.goalId === goal.id)
                                ?.objectives.reduce(
                                  (acc, obj) =>
                                    acc + (obj.completedDays?.length || 0),
                                  0
                                ) ?? 0}
                            </b>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <b>{t("Check")}</b>
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Collapse>
                </Card>
                {showDivider(index) && (
                  <Divider sx={{ color: theme.palette.divider }}>
                    {t("DEPOIS")}
                  </Divider>
                )}
              </>
            ))}
          </Stack>
        </Collapse>

        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            width: "600px",
          }}
        >
          <MyDivision />
        </Box>
      </Stack>
    </>
  );
}
