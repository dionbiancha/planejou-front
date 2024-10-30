import {
  Box,
  Button,
  Card,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import MyDivision from "../../features/MyDivision";
import { useDataUser } from "../../context/UserContext/useUser";
import RoundedSelectField from "../../components/Form/RoundedSelectField";
import { useTranslation } from "react-i18next";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { useEffect } from "react";
import { updateDarkMode } from "../../services/user";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useSnack } from "../../context/SnackContext";

export default function Config() {
  const { t } = useTranslation();
  const loading = useLoading();
  const snack = useSnack();
  const { goToLogin } = useCustomNavigate();
  const { userData, setUserData } = useDataUser();

  async function handleThemeChange(value: string) {
    loading.show();
    try {
      const translatedValue =
        value === t("Habilitado") ? "Habilitado" : "Desabilitado";
      setUserData((prev) => ({ ...prev, darkMode: translatedValue }));
      localStorage.setItem("darkMode", translatedValue);
      await updateDarkMode(translatedValue);
    } catch {
      snack.error(t("Erro ao atualizar o tema"));
    }
    loading.hide();
  }

  function calculateTestProgress(): {
    progress: number;
    daysRemaining: number;
  } {
    if (!userData.testEndDate) {
      return { progress: 0, daysRemaining: 0 };
    }

    const now = new Date();
    const totalDuration = 7 * 24 * 60 * 60 * 1000;
    const endDate = userData.testEndDate.toDate();
    const remainingTime = endDate.getTime() - now.getTime();

    const daysRemaining = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));

    if (remainingTime <= 0) {
      return { progress: 0, daysRemaining: 0 };
    }

    const progress = Math.min((remainingTime / totalDuration) * 100, 100);

    return { progress, daysRemaining };
  }

  useEffect(() => {
    console.log(userData.darkMode);
  }, [userData.darkMode]);

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
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          {t("Preferencias")}
        </Typography>
        <Typography
          mt={3}
          mb={1}
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          {t("Modo escuro")}
        </Typography>
        <RoundedSelectField
          size="medium"
          items={[t("Habilitado"), t("Desabilitado")]}
          onChange={(e) => handleThemeChange(e.target.value)}
          value={t(userData.darkMode ?? t("Desabilitado"))}
        />
        <Typography
          mt={3}
          mb={1}
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          {t("Inscrição")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("Seu teste gratuito termina em")}{" "}
          <b>
            {calculateTestProgress().daysRemaining}{" "}
            {calculateTestProgress().daysRemaining === 1 ? t("dia") : t("dias")}
          </b>
          . <Link>{t("Atualize agora")}</Link>
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" justifyContent="end">
          <Button variant="text" color="inherit" onClick={goToLogin}>
            {t("Sair")}
          </Button>
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
