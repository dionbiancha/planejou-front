import {
  Box,
  Card,
  Collapse,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import BorderLinearProgress from "../../components/BorderLinearProgress";
import { useTranslation } from "react-i18next";
import CompletedDaysGrid from "../../components/CompletedDaysGrid";
import MyDivision from "../../features/MyDivision";
import { useGoals } from "../../context";
import { useObjectives } from "../../context/ObjectiveContext/useObjective";
import CustomButton from "../../components/Button/CustomButton";
import EditIcon from "@mui/icons-material/Edit";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";

export function List() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { goals } = useGoals();
  const { objectives } = useObjectives();
  const [showDetails, setShowDetails] = useState<string[]>([]);
  const { goToEditList } = useCustomNavigate();

  function handleShowDetails(id: string | undefined) {
    if (!id) return;
    if (showDetails.includes(id)) {
      setShowDetails(showDetails.filter((showId) => showId !== id));
    } else {
      setShowDetails([...showDetails, id]);
    }
  }

  function doLater(position: number) {
    return position + 1 > 5;
  }

  function showDivider(position: number) {
    return position + 1 === 5;
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

  return (
    <>
      <Stack flexDirection={{ xs: "column-reverse", lg: "row" }}>
        <Collapse
          sx={{ width: "100%" }}
          in={goals.length > 0}
          timeout="auto"
          unmountOnExit
        >
          <Stack width={"100%"} spacing={3}>
            {goals.map((goal, index) => (
              <Box key={index}>
                <Card
                  sx={{
                    boxShadow: "none",
                    padding: "10px",
                    borderRadius: "10px",
                    maxWidth: "800px",
                    width: "100%",
                    opacity: doLater(index) ? 0.5 : 1,
                    cursor: doLater(index) ? "" : "pointer",
                  }}
                >
                  <Stack direction="row" alignItems="center">
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      width={"100%"}
                      onClick={() => {
                        if (!doLater(index)) {
                          handleShowDetails(goal.id);
                        }
                      }}
                    >
                      <Typography
                        noWrap={false} // Permite a quebra de linha
                        sx={{ wordBreak: "break-word" }}
                        mt={1}
                        mb={1}
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

                    <Typography variant="body2" color="text.secondary" m={1}>
                      <b>{t("Estatísticas")}</b>
                    </Typography>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
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
                            <b>{t("Check-ins")}</b>
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
              </Box>
            ))}
          </Stack>
        </Collapse>

        <Box
          sx={{
            width: { xs: "100%", lg: "600px" },
            mb: { xs: "20px", lg: 0 },
          }}
        >
          <Box
            sx={{
              marginLeft: { xs: "", lg: "20px" },
              width: "100%",
              mb: "20px",
            }}
          >
            <CustomButton
              icon={<EditIcon />}
              variant="contained"
              fullWidth
              onClick={() => goToEditList()}
              disabled={false}
              size="medium"
              label="Editar lista"
            />
          </Box>

          <MyDivision />
        </Box>
      </Stack>
    </>
  );
}
