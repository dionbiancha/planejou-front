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
import { useEffect } from "react";
import { useGoals } from "../../context";

export function Objectives() {
  const { t } = useTranslation();
  const { goToNewObjetive, goToStart } = useCustomNavigate();
  const theme = useTheme();
  const { goals } = useGoals();

  const totalObjectives = goals.reduce(
    (acc, goal) => acc + (goal.objectives?.length || 0),
    0
  );

  useEffect(() => {
    if (goals.length === 0) {
      goToStart();
    }
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
              {goals.map((goal) =>
                goal.objectives?.map((objective, index) => (
                  <Grid item xs={12} md={6} sm={12} key={index}>
                    <Card
                      sx={{
                        boxShadow: "none",
                        padding: "10px",
                        borderRadius: "10px",
                        width: "100%",
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
                            <b>{objective?.name}</b>
                          </Typography>
                        </Stack>
                        <Checkbox size="large" onChange={() => {}} />
                      </Stack>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Stack>
        </Box>
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            width: "300px",
            backgroundColor: "#000",
          }}
        ></Box>
      </Stack>
    </>
  );
}
