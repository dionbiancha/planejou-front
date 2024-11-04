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
import { createAccount, googleSignIn } from "../../services/user";
import { useDataUser } from "../../context/UserContext/useUser";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useState } from "react";
import HeaderControls from "../../components/HeaderControls";
import { useSnack } from "../../context/SnackContext";

export function SignUp() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { goToObjectives } = useCustomNavigate();
  const { setUserData } = useDataUser();
  const loading = useLoading();
  const snack = useSnack();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", name: "" });

  async function handleSignIn() {
    if (validateFields()) {
      loading.show();
      try {
        await createAccount(email, password, name);
        goToObjectives();
      } catch {
        snack.error(t("Erro ao criar conta."));
      }
      loading.hide();
    }
  }

  async function handleSignInGoogle() {
    loading.show();
    try {
      const response = await googleSignIn();
      setUserData((prev) => ({ ...prev, userData: response.user }));
      goToObjectives();
    } catch (error) {
      console.error(error);
    }
    loading.hide();
  }

  function validateFields() {
    let valid = true;
    const newErrors = { email: "", password: "", name: "" };

    // Validação de nome (deve conter pelo menos duas palavras)
    if (!name.trim()) {
      newErrors.name = t("O nome é obrigatório");
      valid = false;
    } else if (name.trim().split(" ").length < 2) {
      newErrors.name = t("O nome deve incluir nome e sobrenome");
      valid = false;
    }

    // Validação de email (formato válido)
    if (!email.trim()) {
      newErrors.email = t("O email é obrigatório");
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = t("Email inválido");
      valid = false;
    }

    // Validação de senha (deve ter letras maiúsculas, minúsculas, números e caracteres especiais)
    if (!password.trim()) {
      newErrors.password = t("A senha é obrigatória");
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = t("A senha deve ter no mínimo 8 caracteres");
      valid = false;
    } else if (
      !/[A-Z]/.test(password) || // Verifica se há letra maiúscula
      !/[a-z]/.test(password) || // Verifica se há letra minúscula
      !/[0-9]/.test(password) || // Verifica se há número
      !/[!@#$%^&*(),.?":{}|<>]/.test(password) // Verifica se há caractere especial
    ) {
      newErrors.password = t(
        "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
      );
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function disableButton() {
    return loading.state || !name || !email || !password;
  }

  return (
    <Box>
      <HeaderControls />
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
              disabled={loading.state}
              label={t("Nome completo")}
              variant="outlined"
              placeholder={t("Digite seu nome completo aqui...")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              disabled={loading.state}
              label="Email"
              variant="outlined"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              disabled={loading.state}
              label={t("Senha")}
              variant="outlined"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />

            <CustomButton
              variant="contained"
              size="large"
              onClick={handleSignIn}
              label={t("Criar conta")}
              disabled={disableButton()}
            />
            {!loading.state && (
              <Box sx={{ textAlign: "center" }}>
                {t("Já possui conta?")} <Link href="/login">{t("Entrar")}</Link>
              </Box>
            )}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
