import "./App.css";
import "./translation/i18n";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { useState } from "react";
import { SignIn } from "./pages/SignIn";
import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import Start from "./pages/Start";
import { GoalProvider } from "./context";

function App() {
  const [isDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GoalProvider>
          <Layout>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/start" element={<Start />} />
            </Routes>
          </Layout>
        </GoalProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
