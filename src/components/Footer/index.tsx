import { Box, Divider, Link, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Box
      width={"100%"}
      justifyContent="center"
      alignItems={"center"}
      flexDirection={"column"}
      maxWidth={"600px"}
      textAlign={"center"}
    >
      <Divider />
      <Stack
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent={"space-between"}
        maxWidth={"600px"}
        width={"100%"}
        mt={{ xs: 2, md: 5 }}
      >
        {linksData.map((item, index) => (
          <Stack
            key={index}
            flexDirection={"column"}
            ml={{ xs: 0, md: 5 }}
            mt={{ xs: 3, md: 0 }}
          >
            <Typography variant="subtitle2" mb={1} color="text.secondary">
              <b>{t(item.title)}</b>
            </Typography>
            {item.items.map((link) => (
              <Link sx={{ textDecoration: "none" }} href={link.link}>
                {t(link.title)}
              </Link>
            ))}
          </Stack>
        ))}
      </Stack>
      <Typography
        textAlign="center"
        variant="subtitle2"
        mt={5}
        color="text.secondary"
      >
        {t("Feito com 💚 por")}{" "}
        <Link target="_blank" href="https://www.dionei.com/">
          Dionei Bianchati
        </Link>
      </Typography>
      <Typography
        textAlign="center"
        variant="subtitle2"
        mt={1}
        color="text.secondary"
      >
        <i>
          {t("Logotipo por")}{" "}
          <Link
            sx={{ textDecoration: "none", color: "text.secondary" }}
            target="_blank"
            href="https://www.flaticon.com/"
          >
            Freepik - Flaticon
          </Link>
        </i>
      </Typography>
    </Box>
  );
}

const linksData = [
  {
    title: "Produto",
    items: [
      { title: "Web App", link: "/login" },
      { title: "Preços", link: "/prices" },
      { title: "Atualizações", link: "/update" },
    ],
  },
  {
    title: "Social",
    items: [
      { title: "Instagram", link: "/precos" },
      { title: "Twitter", link: "/precos" },
      { title: "TikTok", link: "/precos" },
    ],
  },
  {
    title: "Jurídico",
    items: [
      { title: "Termos de uso", link: "/termsOfUse" },
      { title: "Política de Privacidade", link: "/privacyPolicy" },
    ],
  },
];
