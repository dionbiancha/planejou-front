import {
  Box,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/Button/CustomButton";
import LoginButton from "../../features/LoginButton";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";

export function SignIn() {
  const { t } = useTranslation();
  const { goToHome } = useCustomNavigate();

  async function handleSignIn() {
    goToHome();
  }

  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      height={"100%"}
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
            handleSignInGoogle={() => {}}
          />
          <Divider sx={{ color: "#E8E9EA" }}>{t("OU")}</Divider>
          <TextField
            label="Email"
            variant="outlined"
            placeholder="your@email.com"
          />
          <TextField
            label={t("Senha")}
            variant="outlined"
            type="password"
            placeholder="••••••••••"
          />
          <FormControlLabel control={<Checkbox />} label={t("Me lembre")} />

          <CustomButton
            variant="contained"
            size="large"
            onClick={handleSignIn}
            label="Entrar"
          />

          <Box sx={{ textAlign: "center" }}>
            {t("Não possui conta?")} <Link>{t("Criar conta")}</Link>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}
