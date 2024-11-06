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
import { useState } from "react";
import { updateDarkMode, updateLanguage } from "../../services/user";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useSnack } from "../../context/SnackContext";
import i18n from "../../translation/i18n";
import GenericDialog from "../../components/Dialog/GenericDialog";
import { getPortalUrl } from "../../services/stripePayment";

export default function Config() {
  const { t } = useTranslation();
  const loading = useLoading();
  const snack = useSnack();
  const { goToLogin, goToSubscribe } = useCustomNavigate();
  const { userData, setUserData } = useDataUser();
  const [openCancelSubscriptionDialog, setOpenCancelSubscriptionDialog] =
    useState(false);

  async function handleCancelSubscription() {
    loading.showScreen();
    try {
      const res = await getPortalUrl();
      window.location.href = res;
    } catch {
      snack.error(t("Erro ao cancelar a assinatura"));
      loading.hideScreen();
    }
  }

  function freeTrialValidation() {
    const expiredDate = userData?.testEndDate;

    if (expiredDate && userData?.isPremium === false) {
      const currentDate = new Date();
      const expirationDate = expiredDate.toDate(); // Convert Timestamp to Date

      if (currentDate > expirationDate) {
        // Redirecionar ou tomar alguma ação
        goToSubscribe(); // ajuste o caminho conforme necessário
        return true;
      }
    }
    return false;
  }

  async function handleThemeChange(value: string) {
    if (freeTrialValidation()) {
      snack.error(t("Seu período de teste expirou!"));
      return;
    }
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

  async function handleLanguageChange(value: string) {
    loading.show();
    try {
      let language: string = userData.language ?? "pt-BR";
      if (value === t("Português")) {
        language = "pt-BR";
      }
      if (value === t("Inglês")) {
        language = "en";
      }
      if (value === t("Espanhol")) {
        language = "es";
      }
      setUserData((prev) => ({ ...prev, language: language }));
      localStorage.setItem("language", language);
      i18n.changeLanguage(language);
      await updateLanguage(language);
    } catch {
      snack.error(t("Erro ao atualizar o idioma"));
    }
    loading.hide();
  }

  function getLanguage() {
    if (userData.language === t("pt-BR")) {
      return t("Português");
    }
    if (userData.language === t("en")) {
      return t("Inglês");
    }
    if (userData.language === t("es")) {
      return t("Espanhol");
    }
    return t("Português");
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

  function calculatePremiumRemaining(): {
    progress: number;
    daysRemaining: number;
  } {
    if (!userData.premiumEndDate) {
      return { progress: 0, daysRemaining: 0 };
    }

    const now = new Date();
    const totalDuration = 7 * 24 * 60 * 60 * 1000;
    const endDate = userData.premiumEndDate;
    const remainingTime = endDate.getTime() - now.getTime();

    const daysRemaining = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));

    if (remainingTime <= 0) {
      return { progress: 0, daysRemaining: 0 };
    }

    const progress = Math.min((remainingTime / totalDuration) * 100, 100);

    return { progress, daysRemaining };
  }

  function isExpired() {
    if (calculateTestProgress().daysRemaining === 0) return true;
    return false;
  }

  return (
    <Stack flexDirection={"row"}>
      <GenericDialog
        open={openCancelSubscriptionDialog}
        handleClose={() => setOpenCancelSubscriptionDialog(false)}
        title={t("Tem certeza que deseja cancelar sua assinatura?")}
        description={t(
          "Você perderá todos os benefícios do plano premium ao cancelar sua assinatura."
        )}
        textButtonCancel={t("Voltar")}
        textButtonConfirm={t(`Cancelar assinatura`)}
        onConfirm={handleCancelSubscription}
      />
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
          {t("Idioma")}
        </Typography>
        <RoundedSelectField
          size="medium"
          items={[t("Português"), t("Inglês"), t("Espanhol")]}
          onChange={(e) => handleLanguageChange(e.target.value)}
          value={getLanguage()}
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
        {userData.isPremium ? (
          <Typography variant="body2" color="text.secondary">
            {userData.cancelAtPeriodEnd
              ? t("Sua assinatura vai terminar em")
              : t("Sua assinatura sera renovada em")}{" "}
            <b>
              {calculatePremiumRemaining().daysRemaining}{" "}
              {calculatePremiumRemaining().daysRemaining === 1
                ? t("dia")
                : t("dias")}
            </b>
            .{" "}
            <Link
              sx={{ cursor: "pointer" }}
              onClick={() =>
                userData.cancelAtPeriodEnd
                  ? handleCancelSubscription()
                  : setOpenCancelSubscriptionDialog(true)
              }
            >
              {userData.cancelAtPeriodEnd
                ? t("Reativar assinatura")
                : t("Cancelar assinatura")}
            </Link>
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {isExpired() ? (
              t("Seu teste gratuito expirou")
            ) : (
              <>
                {t("Seu teste gratuito termina em")}{" "}
                <b>
                  {calculateTestProgress().daysRemaining}{" "}
                  {calculateTestProgress().daysRemaining === 1
                    ? t("dia")
                    : t("dias")}
                </b>
              </>
            )}
            .{" "}
            <Link onClick={goToSubscribe} sx={{ cursor: "pointer" }}>
              {t("Atualize agora")}
            </Link>
          </Typography>
        )}

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
