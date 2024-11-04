import { Button, Link, List, ListItem, Stack, Typography } from "@mui/material";
import HeaderControls from "../../components/HeaderControls";
import { ArrowBack } from "@mui/icons-material";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

export default function PrivacyPolicy() {
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
            {t("Voltar")}
          </Button>
        </Stack>
        <Typography
          mt={5}
          mb={2}
          maxWidth="550px"
          width={"100%"}
          textAlign={"start"}
          variant="h4"
          color="primary"
        >
          <b>{t("Política de Privacidade")}</b>
        </Typography>

        <Typography variant="body1" color="textSecondary">
          A sua privacidade é importante para nós. É política do Planejou
          respeitar a sua privacidade em relação a qualquer informação sua que
          possamos coletar no site{" "}
          <Link
            href="https://www.planejou.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Planejou
          </Link>
          , e outros sites que possuímos e operamos.
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary">
          Solicitamos informações pessoais apenas quando realmente precisamos
          delas para lhe fornecer um serviço. Fazemo-lo por meios justos e
          legais, com o seu conhecimento e consentimento. Também informamos por
          que estamos coletando e como será usado.
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary">
          Apenas retemos as informações coletadas pelo tempo necessário para
          fornecer o serviço solicitado. Quando armazenamos dados, protegemos
          dentro de meios comercialmente aceitáveis para evitar perdas e roubos,
          bem como acesso, divulgação, cópia, uso ou modificação não
          autorizados.
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary">
          Não compartilhamos informações de identificação pessoal publicamente
          ou com terceiros, exceto quando exigido por lei.
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary">
          O nosso site pode ter links para sites externos que não são operados
          por nós. Esteja ciente de que não temos controle sobre o conteúdo e
          práticas desses sites e não podemos aceitar responsabilidade por suas
          respectivas{" "}
          <Link
            href="https://politicaprivacidade.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            políticas de privacidade
          </Link>
          .
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary">
          Você é livre para recusar a nossa solicitação de informações pessoais,
          entendendo que talvez não possamos fornecer alguns dos serviços
          desejados.
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary">
          O uso continuado de nosso site será considerado como aceitação de
          nossas práticas em torno de privacidade e informações pessoais. Se
          você tiver alguma dúvida sobre como lidamos com dados do usuário e
          informações pessoais, entre em contacto connosco.
        </Typography>

        <Typography
          mt={5}
          mb={2}
          maxWidth="550px"
          width={"100%"}
          textAlign={"start"}
          variant="h4"
        >
          <b>{t("Compromisso do Usuário")}</b>
        </Typography>

        <Typography variant="body1" color="textSecondary">
          O usuário se compromete a fazer uso adequado dos conteúdos e da
          informação que o Planejou oferece no site e com caráter enunciativo,
          mas não limitativo:
        </Typography>

        <List>
          <ListItem>
            A) Não se envolver em atividades que sejam ilegais ou contrárias à
            boa fé e à ordem pública;
          </ListItem>
          <ListItem>
            B) Não difundir propaganda ou conteúdo de natureza racista,
            xenofóbica, jogos de azar, qualquer tipo de pornografia ilegal, de
            apologia ao terrorismo ou contra os direitos humanos;
          </ListItem>
          <ListItem>
            C) Não causar danos aos sistemas físicos (hardwares) e lógicos
            (softwares) do Planejou, de seus fornecedores ou terceiros, para
            introduzir ou disseminar vírus informáticos ou quaisquer outros
            sistemas de hardware ou software que sejam capazes de causar danos
            anteriormente mencionados.
          </ListItem>
        </List>

        <Typography
          mt={5}
          mb={2}
          maxWidth="550px"
          width={"100%"}
          textAlign={"start"}
          variant="h4"
        >
          <b>{t("Mais informações")}</b>
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Esperemos que esteja esclarecido e, como mencionado anteriormente, se
          houver algo que você não tem certeza se precisa ou não, geralmente é
          mais seguro deixar os cookies ativados, caso interaja com um dos
          recursos que você usa em nosso site.
        </Typography>
        <br />
        <Typography variant="body1" color="textSecondary">
          Esta política é efetiva a partir de 5 de novembro de 2024.
        </Typography>
      </Stack>
      <Footer />
    </Stack>
  );
}
