import {
  Box,
  Card,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

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

export function Objectives() {
  const { t } = useTranslation();
  const { goToNewObjetive } = useCustomNavigate();
  const theme = useTheme();
  const [objectives, setObjectives] = useState<ObjectiveListProps[]>([]);
  const { goals } = useGoals();

  const totalObjectives = goals.reduce(
    (acc, goal) => acc + (goal.objectives?.length || 0),
    0
  );

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
            <Grid container spacing={2}>
              {objectives.map((o) =>
                o.objectives?.map((objective, index) => {
                  const objectiveDone = objective.completedDays?.includes(
                    new Date().toISOString().split("T")[0]
                  );
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
                          >
                            <IconButton onClick={() => {}}>
                              <MoreVertOutlined />
                            </IconButton>

                            <Typography
                              noWrap={false} // Permite a quebra de linha
                              sx={{
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
                      </Card>
                    </Grid>
                  );
                })
              )}
            </Grid>
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
