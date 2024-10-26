import {
  Card,
  Collapse,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DIVISIONS, getTimeUntilNextSunday } from "../../pages/League";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { getUserRanking } from "../../services/user";
import { useDataUser } from "../../context/UserContext/useUser";

export default function MyDivision() {
  const theme = useTheme();
  const { t } = useTranslation();
  const loading = useLoading();
  const [myPosition, setMyPosition] = useState<DocumentData>();
  const { userData } = useDataUser();

  async function handleGetDivision() {
    loading.show();
    try {
      const ranking = await getUserRanking();
      setMyPosition(ranking);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
    loading.hide();
  }

  function getColor(position: number) {
    if (position <= 7) return theme.palette.primary.main;
    if (position > 23) return theme.palette.error.main;
    return theme.palette.text.secondary;
  }

  function getSubText(position: number) {
    if (position <= 7)
      return `${t("Continue assim para subir para a divisão")} ${t(
        `${DIVISIONS[userData?.league + 1]}`
      )}`;
    if (position > 23) return t("Bottom 7");
    return t("Outros");
  }

  useEffect(() => {
    handleGetDivision();
  }, []);

  return (
    <Collapse
      sx={{ width: "100%" }}
      in={Boolean(myPosition?.position)}
      timeout="auto"
      unmountOnExit
    >
      <Card
        sx={{
          boxShadow: "none",
          marginLeft: "20px",
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
          <Link
            href="/league"
            sx={{ textDecoration: "none", fontSize: "15px" }}
          >
            <b>VER DIVISÃO</b>
          </Link>
        </Stack>
        <Stack mb={2} flexDirection={"row"}>
          <Typography variant="body1" mr={1}>
            <b>Sua posição:</b>
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: getColor(myPosition?.position) }}
          >
            <b>{myPosition?.position}º</b>
          </Typography>
        </Stack>
        <Typography variant="body2" mb={2} color="text.secondary">
          {getSubText(myPosition?.position)}
        </Typography>
        <Typography variant="body2" textAlign={"center"} color="warning">
          <b>{getTimeUntilNextSunday()}</b>
        </Typography>
      </Card>
    </Collapse>
  );
}
