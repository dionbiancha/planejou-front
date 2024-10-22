import {
  Box,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/Button/CustomButton";
import LoginButton from "../../features/LoginButton";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { googleSignIn } from "../../services/signIn";
import { useDataUser } from "../../context/UserContext/useUser";
import { useLoading } from "../../context/LoadingContext/useLoading";

export function SignIn() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { goToHome } = useCustomNavigate();
  const { setUserData } = useDataUser();
  const loading = useLoading();

  async function handleSignIn() {
    goToHome();
  }

  async function handleSignInGoogle() {
    loading.show();
    try {
      const response = await googleSignIn();
      setUserData(response.user);
      goToHome();
    } catch (error) {
      console.error(error);
    }
    loading.hide();
  }

  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      minHeight={"100vh"}
      spacing={5}
    >
      <Card
        sx={{
          minWidth: "550px",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "none",
        }}
      >
        <Stack spacing={3}>
          <LoginButton
            handleSignInApple={() => {}}
            handleSignInGoogle={handleSignInGoogle}
          />
          <Divider sx={{ color: theme.palette.divider }}>{t("OU")}</Divider>
          <TextField
            disabled={loading.state}
            label="Email"
            variant="outlined"
            placeholder="your@email.com"
          />
          <TextField
            disabled={loading.state}
            label={t("Senha")}
            variant="outlined"
            type="password"
            placeholder="••••••••••"
          />
          <FormControlLabel
            control={<Checkbox disabled={loading.state} />}
            label={t("Me lembre")}
          />

          <CustomButton
            variant="contained"
            size="large"
            onClick={handleSignIn}
            label="Entrar"
            disabled={loading.state}
          />
          {!loading.state && (
            <Box sx={{ textAlign: "center" }}>
              {t("Não possui conta?")} <Link>{t("Criar conta")}</Link>
            </Box>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
