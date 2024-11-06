import {
  Box,
  Button,
  Card,
  Link,
  Radio,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import FaqAccordion from "../../features/FaqAccordion";
import RandomImageMover from "../../components/RandomImageMover";
import { ArrowBack } from "@mui/icons-material";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { useDataUser } from "../../context/UserContext/useUser";
import { useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CustomButton from "../../components/Button/CustomButton";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useSnack } from "../../context/SnackContext";
import { getCheckoutUrl } from "../../services/stripePayment";

export default function Subscribe() {
  const loading = useLoading();
  const { goBack } = useCustomNavigate();
  const { userData } = useDataUser();
  const theme = useTheme();
  const snack = useSnack();
  const { t, i18n } = useTranslation();
  const [selectedSubscribe, setSelectedSubscribe] = useState("year");

  const textColor = theme.palette.mode === "light" ? "text.primary" : "#FFF";

  function goalImageSrc() {
    if (i18n.language === "pt-BR") {
      return "tutorial/goal.gif";
    }
    if (i18n.language === "en") {
      return "tutorial/goal-en.gif";
    }
    return "tutorial/goal-es.gif";
  }

  function objectiveImageSrc() {
    if (i18n.language === "pt-BR") {
      return "tutorial/objective.gif";
    }
    if (i18n.language === "en") {
      return "tutorial/objective-en.gif";
    }
    return "tutorial/objective-es.gif";
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

  function isExpired() {
    if (calculateTestProgress().daysRemaining === 0) return true;
    return false;
  }

  async function handleCheckout() {
    loading.showScreen();
    try {
      let priceId;
      if (selectedSubscribe === "month") {
        priceId = "price_1QI06TEAZX87gM7LeAGHwRko";
      } else {
        priceId = "price_1QI06TEAZX87gM7LAulKqM55";
      }

      const res = await getCheckoutUrl(priceId);

      window.location.href = res;
    } catch {
      loading.hideScreen();
      snack.error(t("Tente novamente mais tarde"));
    }
  }

  useEffect(() => {
    if (userData.isPremium) {
      goBack();
    }
  }, [userData.isPremium]);

  if (userData.isPremium === undefined || userData.isPremium) {
    return <></>;
  }

  return (
    <Box>
      <Card
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "20px",
          minHeight: "200px",
          zIndex: 1000,
          boxShadow: "0px -0.5px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Stack flexDirection={"column"} margin="auto" maxWidth="400px">
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            onClick={() => setSelectedSubscribe("month")}
            sx={{
              cursor: "pointer",
              paddingRight: "10px",
              borderRadius: "15px",
              height: "50px",
              mb: 1,
              opacity: selectedSubscribe === "month" ? 1 : 0.5,
              border: `1px solid ${
                selectedSubscribe === "month"
                  ? theme.palette.primary.main
                  : theme.palette.text.disabled
              }`,
            }}
          >
            <Stack flexDirection={"row"} alignItems={"center"}>
              <Radio checked={selectedSubscribe === "month"} value="month" />
              <Typography variant="body1" color="text.secondary">
                {t("Plano Mensal")}
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {t("R$")} 9,99/{t("mês")}
            </Typography>
          </Stack>

          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            onClick={() => setSelectedSubscribe("year")}
            sx={{
              cursor: "pointer",
              paddingRight: "10px",
              borderRadius: "15px",
              height: "50px",
              mb: 2,
              opacity: selectedSubscribe === "year" ? 1 : 0.5,
              border: `1px solid ${
                selectedSubscribe === "year"
                  ? theme.palette.primary.main
                  : theme.palette.text.disabled
              }`,
            }}
          >
            <Stack flexDirection={"row"} alignItems={"center"}>
              <Radio checked={selectedSubscribe === "year"} value="year" />
              <Typography variant="body1" color="text.secondary">
                {t("Plano Anual")}
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {t("R$")} 23,88/{t("ano")}
            </Typography>
          </Stack>

          <CustomButton
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCheckout}
            label={t("Atualize agora")}
            disabled={loading.state}
          />
        </Stack>
      </Card>
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mt={5}
      >
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBack sx={{ height: "20px" }} />}
          onClick={() => goBack()}
        >
          {t("Voltar")}
        </Button>
      </Stack>

      <Stack
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
        mb="200px"
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "330px",
            borderRadius: "15px",
            padding: "15px",
            mb: 10,
            mt: 5,
          }}
        >
          <Stack
            flexDirection={"row"}
            justifyContent={"start"}
            alignItems={"center"}
          >
            <CheckCircleOutlineIcon
              color="primary"
              sx={{ marginRight: "10px" }}
            />
            <Stack flexDirection={"column"} alignItems={"start"}>
              <Box component="b" sx={{ fontSize: { xs: "13px", sm: "" } }}>
                {isExpired() ? (
                  <b>{t("Seu teste gratuito expirou")}</b>
                ) : (
                  <>
                    {t("Seu teste gratuito termina em")}{" "}
                    {calculateTestProgress().daysRemaining}{" "}
                    {calculateTestProgress().daysRemaining === 1
                      ? t("dia")
                      : t("dias")}
                  </>
                )}
              </Box>
              <Box sx={{ fontSize: { xs: "12px", sm: "15px" } }}>
                {t("Atualize agora")} {t("e")}{" "}
                <Box component="b" sx={{ color: theme.palette.primary.main }}>
                  {t("alcance suas metas")}
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Card>
        <RandomImageMover />
        <Typography
          variant="h2"
          color="primary"
          sx={{ fontSize: { xs: "50px", md: "60px" } }}
        >
          <b>{t("Transforme sonhos")}</b>
        </Typography>
        <Typography
          sx={{ fontSize: { xs: "50px", md: "60px" }, zIndex: 1000 }}
          variant="h2"
          color={textColor}
        >
          <b>{t("em conquistas")}</b>
        </Typography>
        <Typography mt={3} mb={5} variant="body1" color="text.secondary">
          {t(
            "Dê o primeiro passo para organizar suas metas de vida com foco e diversão!"
          )}
        </Typography>
        <Typography mt={{ xs: 15, md: 20 }} variant="h4" color={textColor}>
          <b>{t("Planeje hoje, alcance amanhã")}</b>
        </Typography>
        <Typography
          textAlign={"center"}
          maxWidth="600px"
          mt={3}
          variant="body1"
          color="text.secondary"
        >
          {t(
            "Pessoas que utilizam métodos estruturados para definir metas têm até 2.5 vezes mais chances de atingir seus objetivos"
          )}
        </Typography>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={"center"}
          mt={8}
        >
          {TECHNIQUES.map((item, index) => (
            <>
              <Card
                sx={{
                  maxWidth: "300px",
                  width: "100%",
                  padding: "30px",
                  borderRadius: "15px",
                  boxShadow: "none",
                  marginX: "10px",
                  height: "280px",
                }}
              >
                <Box
                  width="60px"
                  height="60px"
                  mr={2}
                  component={"img"}
                  src={item.src}
                />

                <Typography variant="h6" my={2} color={textColor}>
                  <b>{t(item.title)}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(item.description)}
                </Typography>
              </Card>
              {index !== TECHNIQUES.length - 1 && (
                <AddIcon
                  sx={{
                    height: "40px",
                    width: "40px",
                    color: theme.palette.primary.main,
                  }}
                />
              )}
            </>
          ))}
        </Stack>
        <Typography mt={{ xs: 15, md: 20 }} variant="h4" color={textColor}>
          <b>{t("Foco no que Importa: A Técnica 5/25")}</b>
        </Typography>
        <Typography
          textAlign={"center"}
          maxWidth="600px"
          mt={3}
          variant="body1"
          color="text.secondary"
        >
          {t("Escolha suas metas principais e dê um ‘tchau’ para a distração")}
        </Typography>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={{ xs: "center", md: "start" }}
          mt={10}
          width="100%"
        >
          <Box
            component={"img"}
            src={goalImageSrc()}
            maxWidth="400px"
            width={"100%"}
            sx={{ borderRadius: "15px" }}
          />
          <Stack
            flexDirection={"column"}
            ml={{ xs: 0, md: 5 }}
            maxWidth="400px"
            width="100%"
            textAlign={{ xs: "center", md: "start" }}
          >
            <Typography mt={{ xs: 3, md: 0 }} variant="body2" color="primary">
              <b>{t("Inicio")}</b>
            </Typography>
            <Typography variant="h6">
              <b>{t("Defina suas metas")}</b>
            </Typography>
            <Typography
              maxWidth="450px"
              width={"100%"}
              mt={3}
              mb={3}
              variant="body1"
              color="text.secondary"
            >
              {t(
                "Comece listando 25 sonhos e desejos, mas não pare por aí. Selecione as 5 mais importantes e dê a elas o destaque que merecem. Cada meta se torna uma missão que você vai adorar conquistar, e a clareza trazida por essa escolha faz toda a diferença."
              )}
            </Typography>
          </Stack>
        </Stack>
        <Typography mt={{ xs: 15, md: 20 }} variant="h4" color={textColor}>
          <b>{t("O Caminho para a Conquista: Método SMART")}</b>
        </Typography>
        <Typography
          textAlign={"center"}
          maxWidth="600px"
          mt={3}
          variant="body1"
          color="text.secondary"
        >
          {t("Quebre a meta em objetivos menores e mais fáceis de alcançar")}
        </Typography>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={{ xs: "center", md: "start" }}
          mt={10}
          width="100%"
        >
          <Box
            component={"img"}
            src={objectiveImageSrc()}
            width={"100%"}
            maxWidth="400px"
            sx={{ borderRadius: "15px" }}
          />
          <Stack
            flexDirection={"column"}
            ml={{ xs: 0, md: 5 }}
            maxWidth="400px"
            width="100%"
            textAlign={{ xs: "center", md: "start" }}
          >
            <Typography mt={{ xs: 3, md: 0 }} variant="body2" color="primary">
              <b>{t("Objetivos")}</b>
            </Typography>
            <Typography variant="h6">
              <b>{t("Defina seus objetivos")}</b>
            </Typography>
            <Typography
              maxWidth="450px"
              width={"100%"}
              mt={3}
              mb={3}
              variant="body1"
              color="text.secondary"
            >
              {t(
                "Dê vida à sua meta principal com passos estratégicos e bem definidos. A metodologia SMART transforma cada objetivo em algo específico, mensurável, alcançável, relevante e com um prazo claro. Assim, cada etapa ganha propósito e direção, tornando a jornada rumo a sua grande meta mais motivadora e cheia de conquistas!"
              )}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          sx={{ display: { xs: "none", md: "flex" } }}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={{ xs: 15, md: 20 }}
        >
          {SOCIAL.map((item) => (
            <Link href={item.url} target={"_blank"}>
              <Box
                component="img"
                src={item.src}
                sx={{
                  height: item.height,
                  mx: 2,
                  cursor: "pointer",
                  filter:
                    theme.palette.mode === "light"
                      ? item.style
                      : "brightness(0) invert(1)",
                }}
              />
            </Link>
          ))}
        </Stack>
        <Typography
          mt={{ xs: 15, md: 20 }}
          mb={5}
          variant="h4"
          color={textColor}
        >
          <b>{t("Perguntas Frequentes")}</b>
        </Typography>
        <FaqAccordion items={faqItems} />
        <Typography mt={5} mb={5} variant="subtitle2">
          <i>
            {t("Outras perguntas ou solicitações? Envie um email para")}{" "}
            <Link href="mailto:contato@planejou.com">contato@planejou.com</Link>
          </i>
        </Typography>
      </Stack>
    </Box>
  );
}

const SOCIAL = [
  {
    src: "/social-icons/instagram-logo.png",
    url: "https://www.instagram.com",
    style: "grayscale(100%) brightness(4.4)",
    height: "40px",
  },
  {
    src: "/social-icons/twitter-logo.png",
    url: "https://www.twitter.com",
    style: "grayscale(100%)",
    height: "20px",
  },
  {
    src: "/social-icons/tiktok-logo.png",
    url: "https://www.tiktok.com",
    style: "grayscale(100%) invert(0.65)",
    height: "30px",
  },
];

const TECHNIQUES = [
  {
    title: "A Técnica 5/25",
    description:
      "Liste 25 metas de vida, foque nas 5 mais importantes! Alcance uma a uma, e depois comece a próxima!",
    src: "icons/achievement.png",
  },
  {
    title: "Método SMART",
    description:
      "Cada objetivo é pensado para ser SMART: específico, mensurável, atingível, relevante e com prazo definido.",
    src: "icons/objective.png",
  },
  {
    title: "Conquiste o Topo",
    description:
      "Com um sistema de ligas, cada meta alcançada leva você a novos níveis, incentivando um progresso contínuo e ainda mais motivador.",
    src: "icons/badge.png",
  },
];

const faqItems = [
  {
    question: "O que é o Planejou?",
    answer:
      "Então, o Planejou é uma plataforma super prática para você organizar suas metas de vida. Ele usa a “Técnica 5/25” pra você listar as coisas mais importantes que quer alcançar na vida e focar só nos cinco mais importantes de cada vez. Também utiliza o “Método SMART”, que ajuda a planejar tudo de um jeito bem claro e objetivo!",
  },
  {
    question: "Como funciona essa tal de “Técnica 5/25”?",
    answer:
      "A ideia é simples: você anota até 25 coisas que quer muito fazer ou conquistar. Depois, escolhe as 5 mais importantes e começa a trabalhar nelas primeiro. Quando concluir uma delas, o próximo objetivo da lista é liberado pra você focar. É um jeito de manter o foco e não se perder tentando fazer tudo ao mesmo tempo.",
  },
  {
    question: "O que é o Método SMART?",
    answer:
      "O SMART ajuda você a definir cada objetivo com clareza e propósito. A ideia é que seu objetivo seja: Específico, Mensurável, Alcançável, Relevante e Com um prazo definido. Basicamente, cada meta fica mais concreta, o que facilita demais na hora de correr atrás!",
  },
  {
    question: "Como funciona o período de teste?",
    answer:
      "Quando você cria sua conta no Planejou, você ganha 7 dias pra experimentar tudo o que a plataforma oferece, de graça. Depois desses 7 dias, você escolhe um dos planos (mensal, semestral ou anual) pra continuar usando as funcionalidades completas.",
  },
  {
    question: "Como é o sistema de gamificação?",
    answer:
      "Essa é a parte divertida! Cada vez que você completa um objetivo, ganha pontos de experiência (XP) e sobe no ranking. É tipo um joguinho, mas com suas metas de vida. Então, quanto mais você realiza, mais pontos você ganha!",
  },
  {
    question: "E o sistema de ranking? Como funciona?",
    answer:
      "Ah, temos um ranking onde você pode ver seu progresso e como está em relação aos outros usuários. É ótimo pra dar aquele gás extra e ver quem está alcançando mais metas.",
  },
  {
    question: "E tem sistema de missões?",
    answer:
      "Ainda não, mas essa funcionalidade está no forno! Logo teremos missões e recompensas para deixar seu planejamento ainda mais desafiador e divertido.",
  },
  {
    question: "O Planejou tem app pra celular?",
    answer:
      "Ainda não, mas já estou trabalhando nos aplicativos para Android e iOS. Em breve, você vai poder acessar tudo direto do celular, onde quer que esteja!",
  },
  {
    question: "Com que frequência o Planejou é atualizado?",
    answer:
      "Enquanto eu estiver respirando rsrs. Meu nome é Dionei e meu foco é trabalhar neste aplicativo todos os dias/noites. Última atualização: novembro de 2024.",
  },
  {
    question: "Posso cancelar minha assinatura?",
    answer:
      "Claro! Dá pra cancelar sua assinatura a qualquer momento pelo próprio site. O acesso continua até o fim do período que você pagou, então, você não perde nada do que já investiu.",
  },
  {
    question: "Como falo com o suporte do Planejou?",
    answer:
      "Se precisar de alguma ajuda estou sempre à disposição! Pode entrar em contato pelo e-mail contato@planejou.com. Estou aqui pra te ajudar no que precisar.",
  },
];
