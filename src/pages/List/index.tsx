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

export function List() {
  const loading = useLoading();
  const theme = useTheme();
  const { t } = useTranslation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [objectives, setObjectives] = useState<ObjectiveListProps[]>([]);

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
    return (completedDays * 100) / totalRepeat;
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
                    >
                      <IconButton onClick={() => {}}>
                        <MoreVertOutlined />
                      </IconButton>

                      <Typography
                        noWrap={false} // Permite a quebra de linha
                        sx={{ wordBreak: "break-word" }}
                      >
                        <b>{goal.name}</b>
                      </Typography>
                    </Stack>
                    <Typography variant="h4">{index + 1}</Typography>
                  </Stack>
                  <Box sx={{ width: "100%", padding: "5px" }}>
                    <BorderLinearProgress
                      sx={{ height: "5px" }}
                      variant="determinate"
                      value={getCompletedObjectives(goal.id || "")}
                    />
                  </Box>
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
            width: "300px",
          }}
        ></Box>
      </Stack>
    </>
  );
}
