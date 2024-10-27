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

export default function Config() {
  const { t } = useTranslation();
  const { goToLogin } = useCustomNavigate();
  const { userData, setUserData } = useDataUser();
  const handleThemeChange = (value: string) => {
    setUserData((prev) => ({ ...prev, themeMode: value }));
    localStorage.setItem("themeMode", value);
  };

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
          Preferencias
        </Typography>
        <Typography
          mt={3}
          mb={1}
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          Modo escuro
        </Typography>
        <RoundedSelectField
          size="medium"
          items={["Habilitado", "Desabilitado"]}
          onChange={(e) => handleThemeChange(e.target.value)}
          value={userData.themeMode ?? "Desabilitado"}
        />
        <Typography
          mt={3}
          mb={1}
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          Inscrição
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Seu teste gratuito termina em{" "}
          <b>
            {calculateTestProgress().daysRemaining}{" "}
            {calculateTestProgress().daysRemaining === 1 ? t("dia") : t("dias")}
          </b>
          . <Link>Atualize agora</Link>
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" justifyContent="end">
          <Button variant="text" color="inherit" onClick={goToLogin}>
            Sair
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
