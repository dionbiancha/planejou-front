import "./App.css";
import "./translation/i18n";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { useState } from "react";
import { SignIn } from "./pages/SignIn";

function App() {
  const [isDarkMode] = useState(false);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <SignIn />
    </ThemeProvider>
  );
}

export default App;
