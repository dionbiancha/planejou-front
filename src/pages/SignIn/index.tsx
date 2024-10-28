import {
  Box,
  Card,
  Divider,
  Link,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/Button/CustomButton";
import LoginButton from "../../features/LoginButton";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { googleSignIn, loginWithEmailAndPassword } from "../../services/user";
import { useDataUser } from "../../context/UserContext/useUser";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useState } from "react";
import { useSnack } from "../../context/SnackContext";

export function SignIn() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { goToHome } = useCustomNavigate();
  const { setUserData } = useDataUser();
  const loading = useLoading();
  const snackbar = useSnack();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignInGoogle() {
    loading.show();
    try {
      const response = await googleSignIn();
      setUserData((prev) => ({ ...prev, userData: response.user }));
      goToHome();
    } catch (error) {
      console.error(error);
    }
    loading.hide();
  }

  async function handleSignInWithEmailPassword() {
    if (!validateFields()) {
      snackbar.error("Senha ou email inválidos");
      return;
    }
    loading.show();
    try {
      await loginWithEmailAndPassword(email, password);
      goToHome();
    } catch {
      snackbar.error("Senha ou email inválidos");
    }
    loading.hide();
  }

  function validateFields() {
    let valid = true;
    if (!email.trim()) {
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      valid = false;
    }

    if (!password.trim()) {
      valid = false;
    } else if (password.length < 8) {
      valid = false;
    } else if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      valid = false;
    }
    return valid;
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
          maxWidth: "550px",
          width: "100%",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "none",
        }}
      >
        <Stack spacing={3}>
          <LoginButton handleSignInGoogle={handleSignInGoogle} />
          <Divider sx={{ color: theme.palette.divider }}>{t("OU")}</Divider>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading.state}
            label="Email"
            variant="outlined"
            placeholder="your@email.com"
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading.state}
            label={t("Senha")}
            variant="outlined"
            type="password"
            placeholder="••••••••••"
          />

          <CustomButton
            variant="contained"
            size="large"
            onClick={handleSignInWithEmailPassword}
            label="Entrar"
            disabled={loading.state || !email || !password}
          />
          {!loading.state && (
            <Box sx={{ textAlign: "center" }}>
              {t("Não possui conta?")}{" "}
              <Link href="/register">{t("Criar conta")}</Link>
            </Box>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
