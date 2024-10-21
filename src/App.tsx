import "./App.css";
import "./translation/i18n";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { useState } from "react";
import { SignIn } from "./pages/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import { GoalProvider } from "./context";
import { Objectives } from "./pages/Objectives";
import { List } from "./pages/List";
import NewObjetive from "./pages/NewObjetive";
import { SnackProvider } from "./context/SnackContext";
import Snack from "./components/Snack";
import { UserProvider } from "./context/UserContext";
import Layout from "./components/Layout";
import { LoadingProvider } from "./context/LoadingContext";

function App() {
  const [isDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <UserProvider>
          <LoadingProvider>
            <SnackProvider>
              <GoalProvider>
                <Snack />
                <CssBaseline />
                <Layout>
                  <Routes>
                    <Route path="/" element={<Objectives />} />
                    <Route path="/login" element={<SignIn />} />
                    <Route path="/start" element={<Start />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/new" element={<NewObjetive />} />
                  </Routes>
                </Layout>
              </GoalProvider>
            </SnackProvider>
          </LoadingProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
