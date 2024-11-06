import {
  Box,
  Card,
  Link,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HeaderControls from "../../components/HeaderControls";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/Button/CustomButton";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import AddIcon from "@mui/icons-material/Add";
import FaqAccordion from "../../features/FaqAccordion";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import Footer from "../../components/Footer";
import RandomImageMover from "../../components/RandomImageMover";

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t, i18n } = useTranslation();
  const { goToRegister, goToLogin, goToObjectives } = useCustomNavigate();
  const textColor = theme.palette.mode === "light" ? "text.primary" : "#FFF";
  const [yearPlan, setYearPlan] = useState(true);
  const [confetti, setConfetti] = useState(false);

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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      goToObjectives();
    }
  }, []);

  return (
    <Box>
      <HeaderControls />

      <Stack
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        mt={{ xs: 15, md: 20 }}
        textAlign={"center"}
      >
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
        <Link href="/register">
          <CustomButton
            variant="contained"
            size="large"
            onClick={() => {}}
            label={t("Planejar agora")}
          />
        </Link>

        <Link
          mt={2}
          sx={{ cursor: "pointer", zIndex: 1000 }}
          onClick={goToLogin}
        >
          {t("Já tenho uma conta")}
        </Link>

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
            <Box>
              <CustomButton
                variant="contained"
                size="large"
                onClick={goToRegister}
                label={t("Bora começar!")}
              />
            </Box>
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
            <Box>
              <CustomButton
                variant="contained"
                size="large"
                onClick={goToRegister}
                label={t("Agora sim!")}
              />
            </Box>
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
        <Typography mt={{ xs: 15, md: 20 }} variant="h4" color={textColor}>
          <b>{t("Começe sua jornada agora mesmo")}</b>
        </Typography>
        <Typography
          textAlign={"center"}
          maxWidth="600px"
          mt={3}
          variant="body1"
          color="text.secondary"
        >
          {t(
            "Aproveite a oferta anual quando estiver pronto para conquistar o mundo!"
          )}
        </Typography>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent={"center"}
          alignItems={{ xs: "center", md: "start" }}
          mt={10}
          width={"100%"}
        >
          <Stack flexDirection={"column"} maxWidth="400px" width="100%">
            <Typography
              textAlign={{ xs: "center", md: "start" }}
              variant="body1"
              color={"text.secondary"}
              mb={3}
            >
              <b>{t("Conquiste suas metas")}</b>
            </Typography>
            <Typography
              textAlign={{ xs: "center", md: "start" }}
              variant="body1"
              color={"text.secondary"}
              mb={1}
            >
              <Box
                component={"span"}
                sx={{ color: theme.palette.primary.main }}
              >
                ✔{" "}
              </Box>{" "}
              {t("Objetivos ilimitados")}
            </Typography>

            <Typography
              textAlign={{ xs: "center", md: "start" }}
              variant="body1"
              color={"text.secondary"}
              mb={1}
            >
              <Box
                component={"span"}
                sx={{ color: theme.palette.primary.main }}
              >
                ✔{" "}
              </Box>{" "}
              {t("Competição saudável com outros usuários")}
            </Typography>
            <Typography
              textAlign={{ xs: "center", md: "start" }}
              variant="body1"
              color={"text.secondary"}
              mb={1}
            >
              <Box
                component={"span"}
                sx={{ color: theme.palette.primary.main }}
              >
                ✔{" "}
              </Box>{" "}
              {t("Estatísticas de progresso")}
            </Typography>
            <Typography
              textAlign={{ xs: "center", md: "start" }}
              variant="body1"
              color={"text.secondary"}
              mb={1}
            >
              <Box
                component={"span"}
                sx={{ color: theme.palette.primary.main }}
              >
                ✔{" "}
              </Box>{" "}
              {t("Ranking de usuários")}
            </Typography>
            <Typography
              textAlign={{ xs: "center", md: "start" }}
              variant="body1"
              color={"text.secondary"}
              mb={1}
            >
              <Box
                component={"span"}
                sx={{ color: theme.palette.primary.main }}
              >
                ✔{" "}
              </Box>{" "}
              {t("Ligas de competição")}
            </Typography>
          </Stack>
          <Box sx={{ position: "relative" }}>
            <Card
              sx={{
                padding: "30px",
                borderRadius: "15px",
                boxShadow: "none",
                marginX: "10px",
                mt: { xs: 5, md: 0 },
                border: yearPlan
                  ? `1px solid ${theme.palette.primary.main}`
                  : "",
              }}
            >
              {yearPlan && (
                <Box
                  sx={{
                    position: "absolute",
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "15px",
                    color: "#FFF",
                    paddingX: "10px",
                    top: "-10px",
                    right: "25px",
                    fontSize: "12px",
                  }}
                >
                  {t("Destaque")}
                </Box>
              )}
              <Stack
                width="100%"
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Typography
                  variant="h6"
                  color={yearPlan ? "primary" : "text.secondary"}
                  sx={{ fontSize: "26px" }}
                >
                  <b>{yearPlan ? t("Plano anual") : t("Plano mensal")}</b>
                </Typography>
                <Stack
                  flexDirection={"row"}
                  mt={2}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Switch
                    size="small"
                    checked={yearPlan}
                    onChange={() => {
                      if (!yearPlan) {
                        setConfetti(true);
                      } else {
                        setConfetti(false);
                      }
                      setYearPlan(!yearPlan);
                    }}
                  />
                  {confetti && (
                    <ConfettiExplosion particleCount={50} particleSize={8} />
                  )}
                  <Typography
                    variant="body2"
                    color={"text.secondary"}
                    sx={{ fontSize: "13px" }}
                  >
                    <i>{t("Melhor oferta")}</i>
                  </Typography>
                </Stack>
                <Stack
                  width="100%"
                  flexDirection={"row"}
                  alignItems={"end"}
                  justifyContent={"center"}
                  mt={3}
                >
                  <Typography
                    sx={{ textDecoration: "line-through" }}
                    variant="body2"
                    color={"text.secondary"}
                    mr={2}
                    mb={"10px"}
                  >
                    <b>
                      {t("R$")} {yearPlan ? `9,99` : "14,99"}
                    </b>
                  </Typography>
                  <Typography
                    sx={{ fontSize: "40px" }}
                    variant="h6"
                    color={textColor}
                  >
                    <b>
                      {t("R$")} {yearPlan ? `2,99` : `9,99`}
                    </b>
                  </Typography>
                  <Typography
                    mb={"10px"}
                    variant="body2"
                    color={"text.secondary"}
                    ml={2}
                  >
                    <b>/{t("Mês")}</b>
                  </Typography>
                </Stack>
                {yearPlan && (
                  <Typography
                    mb={"10px"}
                    variant="body2"
                    color={"text.secondary"}
                    ml={2}
                  >
                    <b>
                      {t("R$")} 23,88 {t("por ano")}
                    </b>
                  </Typography>
                )}
                <Typography
                  mt={3}
                  mb={5}
                  variant="body2"
                  color={"text.secondary"}
                >
                  {yearPlan
                    ? t("Pagamento único. 12 meses de acesso.")
                    : t("Pagamento mensal com renovação automática.")}
                </Typography>
                <CustomButton
                  variant="contained"
                  size="large"
                  onClick={goToRegister}
                  label={
                    isMobile
                      ? t("Teste gratuito")
                      : t("Começe um teste gratuito de 7 dias")
                  }
                />
                <Typography
                  mt={1}
                  sx={{ fontSize: "10px" }}
                  variant="body2"
                  color={"text.secondary"}
                >
                  <i>{t("Não é necessário cartão de crédito para começar")}</i>
                </Typography>
              </Stack>
            </Card>
          </Box>
        </Stack>
        <Card
          sx={{
            mt: { xs: 15, md: 20 },
            maxWidth: "800px",
            width: "100%",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "none",
            marginX: "10px",
          }}
        >
          <Typography
            sx={{ fontSize: { xs: "25px", md: "30px" } }}
            textAlign="center"
            variant="h4"
            color={textColor}
          >
            <b>{t("Disponível em (quase) todos os lugares")}</b>
          </Typography>
          <Stack
            mt={3}
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              width="180px"
              margin="10px"
              component="img"
              src="icons/badge-web-app.webp"
            />
            <Box
              width="180px"
              component="img"
              margin="10px"
              src="icons/badge-play-store.webp"
              sx={{ opacity: 0.3 }}
            />
            <Box
              width="180px"
              component="img"
              margin="10px"
              src="icons/badge-app-store.webp"
              sx={{ opacity: 0.3 }}
            />
          </Stack>
          <Typography mt={5} textAlign="center" variant="body2">
            <i>{t("*Em breve disponível para Android e iOS")}</i>
          </Typography>
        </Card>
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

        <Footer />
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
