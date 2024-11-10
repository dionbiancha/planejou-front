import { Card, Collapse, Stack, Typography, useTheme } from "@mui/material";
import { DIVISIONS } from "../../pages/League";
import { useTranslation } from "react-i18next";
import { useDataUser } from "../../context/UserContext/useUser";
import CustomButton from "../../components/Button/CustomButton";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { useEffect } from "react";

export default function MyDivision() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { goToLeague } = useCustomNavigate();
  const { myPosition } = useDataUser();
  const { userData } = useDataUser();

  function getColor(position?: number) {
    if (!position) return theme.palette.text.secondary;
    if (position <= 7) return theme.palette.primary.main;
    if (position > 23) return theme.palette.error.main;
    return theme.palette.text.secondary;
  }

  function getSubText(position?: number) {
    if (!position) return t("Você ainda não subiu para a divisão");
    if (position <= 7)
      return `${t("Continue assim para subir para a divisão")} ${t(
        `${DIVISIONS[userData?.league + 1]}`
      )}`;
    if (position > 23) return t("Continue assim para subir para a divisão");
    return t("Você esta na zona de rebaixamento!");
  }

  function getTimeUntilNextSunday() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)

    if (dayOfWeek === 0) {
      // Today is Sunday
      const hoursLeft = 24 - now.getHours();
      const minutesLeft = 60 - now.getMinutes();
      return `${t("Faltam")} ${hoursLeft} ${t("horas")}, ${minutesLeft} ${t(
        "minutos"
      )}`;
    } else {
      // Calculate days until next Sunday
      const daysUntilSunday = 7 - dayOfWeek;
      return `${t("Faltam")} ${daysUntilSunday} ${
        daysUntilSunday === 1 ? t("dia") : t("dias")
      }`;
    }
  }

  useEffect(() => {
    console.log(myPosition);
  }, [myPosition]);

  return (
    <Collapse
      sx={{ width: "100%" }}
      in={Boolean(myPosition)}
      timeout="auto"
      unmountOnExit
    >
      <Card
        sx={{
          boxShadow: "none",
          marginLeft: { xs: "", lg: "20px" },
          padding: "20px",
          borderRadius: "10px",
          width: "100%",

          color: theme.palette.text.secondary,
        }}
      >
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={1}
        >
          <Typography variant="h6">
            <b>
              {t("Divisão")} {t(`${DIVISIONS[userData?.league ?? 1]}`)}
            </b>
          </Typography>
          <CustomButton
            color={theme.palette.warning.main}
            label={t("Ver divisão")}
            onClick={() => goToLeague()}
            size="small"
          />
        </Stack>
        <Stack mb={2} flexDirection={"row"}>
          <Typography variant="body1" mr={1}>
            <b>{t("Sua posição:")}</b>
          </Typography>
          <Typography variant="body1" sx={{ color: getColor(myPosition) }}>
            <b>{myPosition}º</b>
          </Typography>
        </Stack>
        <Typography variant="body2" mb={2} color="text.secondary">
          {getSubText(myPosition)}
        </Typography>
        <Typography variant="body2" textAlign={"center"} color="warning">
          <b>{getTimeUntilNextSunday()}</b>
        </Typography>
      </Card>
    </Collapse>
  );
}
