import React, { ReactNode, useState } from "react";
import {
  Toolbar,
  Drawer,
  List,
  ListItem,
  Box,
  CssBaseline,
  IconButton,
  useMediaQuery,
  Container,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  CheckBoxOutlined,
  ChecklistRounded,
  Settings,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomButton from "../Button/CustomButton";
import BorderLinearProgress from "../BorderLinearProgress";

const expandedDrawerWidth = 180;
const collapsedDrawerWidth = 80;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true); // Controle do colapso do drawer
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isLogged] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapseToggle = () => {
    if (!isMobile) {
      setDrawerOpen(!drawerOpen); // Alterna o estado entre aberto e fechado apenas em telas grandes
    }
  };

  function isSelected(path: string) {
    const selected = location.pathname === path;
    if (selected && theme.palette.mode === "dark") {
      return "#3E444E";
    }
    if (selected && theme.palette.mode === "light") {
      return "#C8CACD";
    }
    return "inherit";
  }

  const drawer = (
    <Box onClick={isMobile ? handleDrawerToggle : undefined}>
      <Toolbar />
      <List>
        {menu.map((value) => (
          <ListItem key={value.text}>
            {drawerOpen ? (
              <Button
                variant="text"
                color="primary"
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  fontWeight: "bold",
                  color: theme.palette.text.secondary,
                  backgroundColor: isSelected(value.url),
                  padding: "10px",
                  paddingX: "20px",
                  width: "100%",
                }}
                startIcon={value.icon}
                onClick={() => {
                  navigate(value.url);
                }}
              >
                {value.text}
              </Button>
            ) : (
              <IconButton
                sx={{
                  color: theme.palette.text.secondary,
                  backgroundColor: isSelected(value.url),
                  borderRadius: "8px",
                }}
              >
                {value.icon}
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Stack
        position="fixed"
        zIndex={1201}
        flexDirection={"row"}
        justifyContent={{ xs: "space-between", md: "center" }}
        alignItems={"center"}
        sx={{
          height: "50px",
          width: "100%",
          backgroundColor: "#2A303C",
          padding: "20px",
        }}
      >
        <Typography variant="body2" color="#fff">
          <b>{t("7 dias de teste gratuito")}</b>
        </Typography>
        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            maxWidth: "300px",
            width: "100%",
            marginX: "20px",
          }}
        >
          <BorderLinearProgress rtl variant="determinate" value={90} />
        </Box>

        <CustomButton
          onClick={() => {}}
          variant="contained"
          borderRadius={2}
          size="small"
          label={t("Atualize agora")}
          // disabled={disabledButton()}
        />
      </Stack>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
        }}
      >
        <CssBaseline />

        <Box
          position="fixed"
          sx={{
            display: isLogged && !isMobile ? "flex" : "none",
            justifyContent: "space-between",
            padding: "10px",
            marginTop: "50px",
            boxShadow: "none",
            width: {
              sm: `calc(100% - ${
                drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth
              }px)`,
            },
            ml: {
              sm: `${
                drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth
              }px`,
            },
          }}
        >
          <IconButton
            onClick={handleDrawerCollapseToggle}
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>

          <IconButton color="inherit">
            <Settings />
          </IconButton>
        </Box>

        <Box
          component="nav"
          sx={{
            display: isLogged && !isMobile ? "flex" : "none",
            width: {
              sm: drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth,
            },
            flexShrink: { sm: 0 },
          }}
          aria-label="menu folders"
        >
          {/* Drawer para telas grandes */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                backgroundColor: theme.palette.background.default,
                boxShadow: "none",
                boxSizing: "border-box",
                border: "none",
                width: drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            mt: isMobile ? "50px" : "60px",
            p: isMobile ? 3 : 10,
            width: {
              sm: "100%",
              md: `calc(100% - ${
                drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth
              }px)`,
            },
          }}
        >
          {children}
        </Container>
      </Box>
    </>
  );
};

export default Layout;

const styles = {
  menuButton: {
    height: "25px",
    width: "25px",
  },
};

const menu = [
  {
    text: "Objetivos",
    icon: <CheckBoxOutlined sx={styles.menuButton} />,
    url: "/",
  },
  {
    text: "Lista",
    icon: <ChecklistRounded sx={styles.menuButton} />,
    url: "/list",
  },
];
