import { Box, Card, Stack, Typography, useTheme } from "@mui/material";
import { getTopUsersByXP, getUserData } from "../../services/user";
import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { DocumentData } from "firebase/firestore";
import { useTranslation } from "react-i18next";

interface RankingProps {
  name: string;
  xp: number;
  myAccount: boolean;
  urlImage?: string;
}

const randomColors = ["#FDCB89", "#99F8CA", "#FFA1AC", "#66E6AA", "#FAB658"];

const getRandomColor = () => {
  return randomColors[Math.floor(Math.random() * randomColors.length)];
};

export const DIVISIONS = [
  "Praia",
  "Tartaruguinha",
  "Casco Lento",
  "Casco Duro",
  "Turbo Tartaruga",
];

export function getTimeUntilNextSunday() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)

  if (dayOfWeek === 0) {
    // Today is Sunday
    const hoursLeft = 24 - now.getHours();
    const minutesLeft = 60 - now.getMinutes();
    return `Faltam ${hoursLeft} horas, ${minutesLeft} minutos`;
  } else {
    // Calculate days until next Sunday
    const daysUntilSunday = 7 - dayOfWeek;
    return `Faltam ${daysUntilSunday} ${
      daysUntilSunday === 1 ? "dia" : "dias"
    }`;
  }
}

export function League() {
  const theme = useTheme();
  const loading = useLoading();
  const { t } = useTranslation();
  const [topUsers, setTopUsers] = useState<RankingProps[]>();
  const [userData, setUserData] = useState<DocumentData>();

  async function handleTopUsersByXP() {
    loading.show();
    try {
      const res = await getTopUsersByXP();
      console.log(res);
      setTopUsers(res);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
    loading.hide();
  }

  async function handleGetUserData() {
    loading.show();
    try {
      const res = await getUserData();
      setUserData(res);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
    loading.hide();
  }

  function getMedal(index: number) {
    if (index === 1) {
      return (
        <Box component={"img"} src="ranking/medal-gold.png" width="25px" />
      );
    } else if (index === 2) {
      return (
        <Box component={"img"} src="ranking/medal-silver.png" width="25px" />
      );
    } else if (index === 3) {
      return (
        <Box component={"img"} src="ranking/medal-bronze.png" width="25px" />
      );
    } else {
      return <b>{index}º</b>;
    }
  }

  useEffect(() => {
    handleTopUsersByXP();
    handleGetUserData();
  }, []);
  return (
    <Stack flexDirection={"row"}>
      <Card
        sx={{
          boxShadow: "none",
          padding: "15px",
          borderRadius: "10px",
          width: "100%",
          height: "100%",
          minHeight: "500px",
          maxHeight: "700px",
          overflow: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {topUsers?.map((user, index) => (
          <>
            <Stack
              key={index}
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{
                color: theme.palette.text.secondary,
                padding: "10px",
                mb: 1,
                backgroundColor: user.myAccount
                  ? theme.palette.background.default
                  : "",
                borderRadius: "8px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.palette.background.default,
                },
              }}
            >
              <Stack flexDirection={"row"} alignItems={"center"}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  mr={2}
                  width="30px"
                >
                  {getMedal(index + 1)}
                </Stack>
                {user.urlImage ? (
                  <Box component={"img"} src={user.urlImage} />
                ) : (
                  <Box
                    sx={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 2,
                      backgroundColor: getRandomColor(),
                    }}
                  >
                    <b>{user.name.charAt(0)}</b>
                  </Box>
                )}
                <Box>
                  <b>{user.name}</b>
                </Box>
              </Stack>
              <Box>
                <b>{user.xp} XP</b>
              </Box>
            </Stack>
            {index === 6 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: theme.palette.primary.main,
                  padding: "5px",
                  borderRadius: "5px",
                  marginY: "10px",
                  fontSize: "15px",
                }}
              >
                <Box
                  component={"img"}
                  src="icons/up-arrow.png"
                  width="15px"
                  mr={1}
                />
                <span>ZONA DE PROMOÇÃO</span>
                <Box
                  ml={1}
                  component={"img"}
                  src="icons/up-arrow.png"
                  width="15px"
                />
              </Box>
            )}
            {index === 22 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: theme.palette.error.main,
                  padding: "5px",
                  borderRadius: "5px",
                  marginY: "10px",
                  fontSize: "15px",
                }}
              >
                <Box
                  component={"img"}
                  src="icons/down-arrow.png"
                  width="15px"
                  mr={1}
                />
                <span>ZONA DE REBAIXAMENTO</span>
                <Box
                  ml={1}
                  component={"img"}
                  src="icons/down-arrow.png"
                  width="15px"
                />
              </Box>
            )}
          </>
        ))}
      </Card>

      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          width: "600px",
        }}
      >
        <Card
          sx={{
            boxShadow: "none",
            marginLeft: "20px",
            padding: "20px",
            borderRadius: "10px",
            width: "90%",

            textAlign: "center",
            color: theme.palette.text.secondary,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" mb={1}>
            <b>
              {t("Divisão")} {t(`${DIVISIONS[userData?.league ?? 1]}`)}
            </b>
          </Typography>
          <Typography variant="body2" mb={2}>
            Os 7 primeiros avançam para a próxima divisão!
          </Typography>
          <Typography variant="body2" color="warning">
            <b>{getTimeUntilNextSunday()}</b>
          </Typography>
        </Card>
      </Box>
    </Stack>
  );
}