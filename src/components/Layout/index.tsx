import React, { ReactNode, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  CssBaseline,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const expandedDrawerWidth = 240;
const collapsedDrawerWidth = 60;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true); // Controle do colapso do drawer
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLogged] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapseToggle = () => {
    if (!isMobile) {
      setDrawerOpen(!drawerOpen); // Alterna o estado entre aberto e fechado apenas em telas grandes
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logout");
    handleMenuClose();
  };

  const drawer = (
    <Box
      onClick={isMobile ? handleDrawerToggle : undefined}
      sx={{ textAlign: "center" }}
    >
      <Toolbar />
      <List>
        {["Home", "Perfil", "Configurações"].map((text) => (
          <ListItem key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          display: isLogged ? "flex" : "none",
          width: {
            sm: `calc(100% - ${
              drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth
            }px)`,
          },
          ml: {
            sm: `${drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth}px`,
          },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerCollapseToggle}
            sx={{ mr: 2, display: { xs: "none", sm: "block" } }} // Botão visível apenas em telas grandes
          >
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Meu App
          </Typography>

          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircleIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleMenuClose}>Configurações</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          display: isLogged ? "flex" : "none",
          width: {
            sm: drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth,
          },
          flexShrink: { sm: 0 },
        }}
        aria-label="menu folders"
      >
        {/* Drawer para mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: expandedDrawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer para telas grandes */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
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
          p: 3,
          width: {
            sm: `calc(100% - ${
              drawerOpen ? expandedDrawerWidth : collapsedDrawerWidth
            }px)`,
          },
        }}
      >
        <Toolbar sx={{ display: isLogged ? "block" : "none" }} />
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
