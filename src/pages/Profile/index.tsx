import { Box, Card, Stack, Typography, useTheme } from "@mui/material";
import MyDivision from "../../features/MyDivision";
import { useDataUser } from "../../context/UserContext/useUser";
import { useTranslation } from "react-i18next";
import { Timestamp } from "firebase/firestore";
import { useGoals } from "../../context";
import { useObjectives } from "../../context/ObjectiveContext/useObjective";

export default function Profile() {
  const { userData } = useDataUser();
  const { goals } = useGoals();
  const theme = useTheme();
  const { t } = useTranslation();
  const { objectives } = useObjectives();

  function formatTimestampToMonthYear(timestamp: Timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "long" });
  }

  function getCompletedAllObjectives() {
    let totalObjective = 0;

    objectives.forEach((obj) => {
      obj.objectives.forEach((objective) => {
        if (objective.completedDays) {
          totalObjective += objective.completedDays.length;
        }
      });
    });

    if (isNaN(totalObjective)) return 0;
    return totalObjective;
  }

  function getAllObjectives() {
    let totalObjective = 0;

    objectives.forEach((obj) => {
      obj.objectives.forEach(() => {
        totalObjective += 1;
      });
    });

    if (isNaN(totalObjective)) return 0;
    return totalObjective;
  }

  return (
    <Stack flexDirection={"row"}>
      <Card
        sx={{
          boxShadow: "none",
          padding: "20px",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={"center"}
          mb={5}
        >
          {userData?.photoURL ? (
            <Box
              sx={{
                height: "80px",
                width: "80px",
                borderRadius: "100%",
                marginRight: { xs: 0, md: 2 },
              }}
              component={"img"}
              src={userData?.photoURL}
            />
          ) : (
            <Box
              sx={{
                height: "80px",
                width: "80px",
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "30px",
                marginRight: { xs: 0, md: 2 },
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <b>{userData.name?.charAt(0)}</b>
            </Box>
          )}

          <Stack flexDirection={"column"}>
            <Typography
              textAlign={{ xs: "center", md: "left" }}
              variant="h5"
              color="text.secondary"
            >
              <b>{userData?.name}</b>
            </Typography>
            <Typography
              textAlign={{ xs: "center", md: "left" }}
              variant="subtitle2"
              color="text.secondary"
            >
              <b>
                {t("Por aqui desde")}{" "}
                {userData?.createdAt &&
                  formatTimestampToMonthYear(userData.createdAt)}
              </b>
            </Typography>
          </Stack>
        </Stack>

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
              src="icons/achievement.png"
            />
            <Stack direction={"column"}>
              <Typography variant="h6">
                <b>{goals.length}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>{t("Total de Metas")}</b>
              </Typography>
            </Stack>
          </Stack>

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
              src="icons/up-arrow.png"
            />
            <Stack direction={"column"}>
              <Typography variant="h6">
                <b>{userData?.totalXp}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>{t("Total de XP")}</b>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} mt={3}>
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
                <b>{getAllObjectives()}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>{t("Total de Objetivos")}</b>
              </Typography>
            </Stack>
          </Stack>

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
              src="icons/checked.png"
            />
            <Stack direction={"column"}>
              <Typography variant="h6">
                <b> {getCompletedAllObjectives()}</b>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>{t("Total de Check-ins")}</b>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: "600px",
        }}
      >
        <MyDivision />
      </Box>
    </Stack>
  );
}
