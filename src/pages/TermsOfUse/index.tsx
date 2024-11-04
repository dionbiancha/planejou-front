import {
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import HeaderControls from "../../components/HeaderControls";
import { ArrowBack } from "@mui/icons-material";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

export default function TermsOfUse() {
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
          mt={3}
          mb={5}
          maxWidth="550px"
          width={"100%"}
          textAlign={"start"}
          variant="h4"
          color="primary"
        >
          <b>{t("Termos de uso")}</b>
        </Typography>

        <section>
          <Typography
            mt={5}
            mb={2}
            maxWidth="550px"
            width={"100%"}
            textAlign={"start"}
            variant="h4"
          >
            <b>{t("1. Termos")}</b>
          </Typography>

          <Typography paragraph>
            Ao acessar o site{" "}
            <Link href="https://www.planejou.com/">Planejou</Link>, você
            concorda em cumprir estes termos de serviço, todas as leis e
            regulamentos aplicáveis e aceita que é responsável pelo cumprimento
            de todas as leis locais. Caso não concorde com algum desses termos,
            está proibido de usar ou acessar o site. Os materiais contidos no
            site são protegidos por leis de direitos autorais e marcas
            comerciais.
          </Typography>
        </section>

        <section>
          <Typography
            mt={5}
            mb={2}
            maxWidth="550px"
            width={"100%"}
            textAlign={"start"}
            variant="h4"
          >
            <b>{t("2. Uso de Licença")}</b>
          </Typography>

          <Typography paragraph>
            É concedida permissão para baixar temporariamente uma cópia dos
            materiais (informações ou software) no site Planejou, apenas para
            visualização pessoal e não comercial. Esta é a concessão de uma
            licença, não uma transferência de título, e sob esta licença você
            não pode:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="A) Modificar ou copiar os materiais." />
            </ListItem>
            <ListItem>
              <ListItemText primary="B) Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="C) Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Planejou." />
            </ListItem>
            <ListItem>
              <ListItemText primary="D) Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais." />
            </ListItem>
            <ListItem>
              <ListItemText primary="E) Transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor." />
            </ListItem>
          </List>
          <Typography paragraph>
            Esta licença será automaticamente rescindida se você violar alguma
            dessas restrições e pode ser rescindida pelo Planejou a qualquer
            momento. Ao encerrar a visualização dos materiais ou após o término
            da licença, você deve apagar todos os materiais baixados em sua
            posse.
          </Typography>
        </section>

        <section>
          <Typography
            mt={5}
            mb={2}
            maxWidth="550px"
            width={"100%"}
            textAlign={"start"}
            variant="h4"
          >
            <b>{t("3. Isenção de responsabilidade")}</b>
          </Typography>

          <List>
            <ListItem>
              <ListItemText primary="A) Os materiais no site da Planejou são fornecidos 'como estão'. Planejou não oferece garantias, expressas ou implícitas, incluindo garantias de comercialização, adequação a um fim específico ou não violação de propriedade intelectual." />
            </ListItem>
            <ListItem>
              <ListItemText primary="B) Além disso, Planejou não garante a precisão, os resultados prováveis ou a confiabilidade do uso dos materiais em seu site ou em sites vinculados." />
            </ListItem>
          </List>
        </section>

        <section>
          <Typography
            mt={5}
            mb={2}
            maxWidth="550px"
            width={"100%"}
            textAlign={"start"}
            variant="h4"
          >
            <b>{t("4. Limitações")}</b>
          </Typography>

          <Typography paragraph>
            Em nenhum caso, Planejou ou seus fornecedores serão responsáveis por
            danos (incluindo perda de dados, lucro ou interrupção de negócios)
            decorrentes do uso ou da incapacidade de usar os materiais em
            Planejou, mesmo que Planejou tenha sido notificado da possibilidade
            de tais danos.
          </Typography>
        </section>

        <section>
          <Typography
            mt={5}
            mb={2}
            maxWidth="550px"
            width={"100%"}
            textAlign={"start"}
            variant="h4"
          >
            <b>{t("5. Precisão dos materiais")}</b>
          </Typography>

          <Typography paragraph>
            Os materiais exibidos no site da Planejou podem incluir erros
            técnicos, tipográficos ou fotográficos. Planejou não garante que
            qualquer material seja preciso, completo ou atual. O Planejou pode
            fazer alterações nos materiais a qualquer momento, sem aviso.
          </Typography>
        </section>

        <section>
          <Typography
            mt={5}
            mb={2}
            maxWidth="550px"
            width={"100%"}
            textAlign={"start"}
            variant="h4"
          >
            <b>{t("6. Links")}</b>
          </Typography>

          <Typography paragraph>
            O Planejou não analisou todos os sites vinculados ao seu site e não
            é responsável pelo conteúdo de nenhum site vinculado. A inclusão de
            qualquer link não implica endosso. O uso de qualquer site vinculado
            é por conta e risco do usuário.
          </Typography>
        </section>

        <section>
          <Typography
            mt={5}
            mb={2}
            maxWidth="550px"
            width={"100%"}
            textAlign={"start"}
            variant="h4"
          >
            <b>{t("7. Modificações")}</b>
          </Typography>

          <Typography paragraph>
            O Planejou pode revisar estes termos de serviço a qualquer momento,
            sem aviso prévio. Ao usar este site, você concorda com a versão
            atual destes termos.
          </Typography>
        </section>

        <section>
          <Typography
            mt={5}
            mb={2}
            maxWidth="550px"
            width={"100%"}
            textAlign={"start"}
            variant="h4"
          >
            <b>{t("8. Lei aplicável")}</b>
          </Typography>

          <Typography paragraph>
            Estes termos e condições são regidos pelas leis aplicáveis e você se
            submete irrevogavelmente à jurisdição exclusiva dos tribunais da
            localidade.
          </Typography>
        </section>
      </Stack>
      <Footer />
    </Stack>
  );
}
