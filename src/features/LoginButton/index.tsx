import { Box, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface LoginButtonProps {
  handleSignInGoogle: () => void;
  handleSignInApple: () => void;
}

export default function LoginButton({
  handleSignInGoogle,
  handleSignInApple,
}: LoginButtonProps) {
  const { t } = useTranslation();
  return (
    <Stack direction={"column"} spacing={1}>
      <Button
        onClick={handleSignInGoogle}
        sx={{
          fontWeight: "bold",
          borderRadius: "10px",
          paddingY: "10px",
          borderColor: "#C9CBD0",
          boxShadow: "none",
        }}
        startIcon={
          <Box
            height="20px"
            component="img"
            src="social-icons/google_logo.png"
          />
        }
        color="inherit"
        variant="outlined"
      >
        {t("Entrar com o Google")}
      </Button>
      <Button
        onClick={handleSignInApple}
        sx={{
          fontWeight: "bold",
          borderColor: "#000",
          borderRadius: "10px",
          paddingY: "10px",
          color: "#FFFFFF",
          backgroundColor: "#000",
          boxShadow: "none",
        }}
        startIcon={
          <Box height="25px" component="img" src="social-icons/apple.svg" />
        }
        color="inherit"
        variant="outlined"
      >
        {t("Entrar com o Apple")}
      </Button>
    </Stack>
  );
}
