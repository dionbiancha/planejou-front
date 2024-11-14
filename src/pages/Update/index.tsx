import { Button, Divider, Stack, Typography } from "@mui/material";
import HeaderControls from "../../components/HeaderControls";
import { ArrowBack } from "@mui/icons-material";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

export default function Update() {
  const { goBack } = useCustomNavigate();
  const { t } = useTranslation();
  return (
    <Stack
      flexDirection={"column"}
      justifyContent={"space-between"}
      alignItems={"center"}
      minHeight={"100vh"}
    >
      <Stack
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          maxWidth: "550px",
          width: "100%",
          mb: 5,
        }}
      >
        <HeaderControls />
        <Stack
          flexDirection={"row"}
          sx={{
            maxWidth: "550px",
            width: "100%",
            mt: 13,
          }}
        >
          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBack sx={{ height: "20px" }} />}
            onClick={() => goBack()}
          >
            Voltar
          </Button>
        </Stack>
        <Typography
          mt={3}
          mb={5}
          maxWidth="550px"
          width={"100%"}
          textAlign={"start"}
          variant="h4"
        >
          <b>{t("Atualizações do Planejou")}</b>
        </Typography>
        <Stack
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            maxWidth: "550px",
            width: "100%",
            mt: 2,
          }}
        >
          {UPDATES.map((update, index) => (
            <Stack
              key={update.title}
              flexDirection={"column"}
              justifyContent={"center"}
              sx={{
                maxWidth: "550px",
                width: "100%",
              }}
            >
              <Stack
                mb={2}
                width={"100%"}
                flexDirection={{ xs: "column", md: "row" }}
                alignItems={"start"}
              >
                <Typography>
                  <b>{update.title} </b>
                </Typography>
                <Typography ml={{ xs: 0, md: 2 }}> {update.date}</Typography>
              </Stack>

              <Typography variant="body1">{update.description}</Typography>
              <Stack
                flexDirection={"column"}
                justifyContent={"center"}
                sx={{
                  mt: 1,
                }}
              >
                {update.items.map((item) => (
                  <Typography key={item.title} variant="body1">
                    - {item.title}
                  </Typography>
                ))}
              </Stack>
              {index !== UPDATES.length - 1 && <Divider sx={{ my: 3 }} />}
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  );
}

const UPDATES = [
  {
    title: "Nasce o Planejou",
    date: "05 de novembro de 2024",
    description: "Após 1 mês de trabalho o Planejou finalmente esta no ar!",
    items: [
      {
        title: "Crie e organize suas metas de vida",
      },
      {
        title: "Planeje como alcançar suas metas através de objetivos",
      },
      {
        title: "Acompanhe seu progresso",
      },
      {
        title: "Sistema de Ranking",
      },
    ],
  },
  {
    title: "Correção de bugs e melhorias",
    date: "13 de novembro de 2024",
    description:
      "A pedido do Keropi1 estou subindo algumas correções e melhorias",
    items: [
      {
        title: "Possibilidade de adicionar metas de curto, médio e longo prazo",
      },
      {
        title: "Correção de bugs no sistema de ranking",
      },
      {
        title: "Agora é possivel rever a dica na criação de metas e prazos",
      },
    ],
  },
];
