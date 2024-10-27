import React, { ReactNode, useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomButton from "../Button/CustomButton";
import BorderLinearProgress from "../BorderLinearProgress";
import { useAuthValidation } from "../../hooks/useAuthValidation";
import { useDataUser } from "../../context/UserContext/useUser";
import { getUserData } from "../../services/user";
import { useLoading } from "../../context/LoadingContext/useLoading";

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
  const { userData, setUserData } = useDataUser();
  const loading = useLoading();

  useAuthValidation();

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

  function isValidRoute(path: string) {
    return (
      path === "/login" ||
      path === "/register" ||
      path === "/start" ||
      path === "/new" ||
      path.includes("/edit")
    );
  }

  const styles = {
    menuButton: {
      height: "25px",
      width: "25px",
    },
  };

  const menu = [
    {
      text: "Objetivos",
      icon: (
        <Box
          component={"img"}
          src="icons/objective.png"
          sx={styles.menuButton}
        />
      ),
      number: userData.incompleteObjectivesToday,
      url: "/",
    },
    {
      text: "Lista",
      icon: (
        <Box
          component={"img"}
          src="icons/checklist.png"
          sx={styles.menuButton}
        />
      ),
      url: "/list",
    },
    {
      text: "Liga",
      icon: (
        <Box component={"img"} src="icons/badge.png" sx={styles.menuButton} />
      ),
      url: "/league",
    },
    {
      text: "Missões",

      icon: (
        <Box
          component={"img"}
          src="icons/treasure.png"
          sx={[
            styles.menuButton,
            {
              filter: "grayscale(100%)",
            },
          ]}
        />
      ),
      url: "/missions",
    },
    {
      text: "Social",
      icon: (
        <Box
          component={"img"}
          src="icons/football.png"
          sx={[
            styles.menuButton,
            {
              filter: "grayscale(100%)",
            },
          ]}
        />
      ),
      url: "/social",
    },

    {
      text: "Perfil",
      icon: (
        <Box component={"img"} src="icons/profile.png" sx={styles.menuButton} />
      ),
      url: "/profile",
    },
    {
      text: "Mais",
      icon: (
        <Box
          component={"img"}
          src="icons/three-dots.png"
          sx={styles.menuButton}
        />
      ),
      url: "/config",
    },
  ];

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

  async function handleUserData() {
    loading.show();
    try {
      const res = await getUserData();
      setUserData((prev) => ({
        ...prev,
        xp: res.xp,
        testEndDate: res.testEndDate,
        name: res.name,
      }));
    } catch (e) {
      console.log(e);
    }
    loading.hide();
  }

  useEffect(() => {
    handleUserData();
  }, []);

  const drawer = (
    <Box onClick={isMobile ? handleDrawerToggle : undefined}>
      <Toolbar />

      <List>
        {menu.map((value) => (
          <ListItem key={value.text}>
            {drawerOpen ? (
              <Box sx={{ position: "relative" }}>
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
                    if (value.url === "/missions" || value.url === "/social")
                      return;
                    navigate(value.url);
                  }}
                >
                  <Box ml={1}>{value.text}</Box>
                </Button>
                {value.number && value.number !== 0 ? (
                  <Box
                    onClick={() => {
                      if (value.url === "/missions" || value.url === "/social")
                        return;
                      navigate(value.url);
                    }}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      top: 3,
                      right: 100,
                      position: "absolute",
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "20px",
                      color: "#FFF",
                      fontSize: "12px",
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <b>{value.number}</b>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            ) : (
              <Box sx={{ position: "relative" }}>
                <IconButton
                  onClick={() => {
                    if (value.url === "/missions" || value.url === "/social")
                      return;
                    navigate(value.url);
                  }}
                  sx={{
                    color: theme.palette.text.secondary,
                    backgroundColor: isSelected(value.url),
                    borderRadius: "8px",
                  }}
                >
                  {value.icon}
                </IconButton>
                {value.number && value.number !== 0 ? (
                  <Box
                    onClick={() => {
                      if (value.url === "/missions" || value.url === "/social")
                        return;
                      navigate(value.url);
                    }}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      top: 3,
                      right: 2,
                      position: "absolute",
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "20px",
                      color: "#FFF",
                      fontSize: "12px",
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <b>{value.number}</b>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isValidRoute(location.pathname)) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          width: "100%",
        }}
      >
        {children}
      </Container>
    );
  }

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
          <b>
            {calculateTestProgress().daysRemaining}{" "}
            {calculateTestProgress().daysRemaining === 1 ? t("dia") : t("dias")}{" "}
            {t("de teste gratuito")}
          </b>
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
          <BorderLinearProgress
            rtl
            variant="determinate"
            value={calculateTestProgress().progress}
          />
        </Box>

        <CustomButton
          onClick={() => {}}
          variant="contained"
          borderRadius={2}
          size="small"
          label={t("Atualize agora")}
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
            backgroundColor: theme.palette.background.default,
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
