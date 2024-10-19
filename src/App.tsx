import "./App.css";
import "./translation/i18n";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme } from "./theme";
import { SignIn } from "./pages/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import { GoalProvider } from "./context";
import { Objectives } from "./pages/Objectives";
import { List } from "./pages/List";
import NewObjetive from "./pages/NewObjetive";
import { SnackProvider } from "./context/SnackContext";
import Snack from "./components/Snack";

function App() {
  // const [isDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <ThemeProvider theme={lightTheme}>
        <SnackProvider>
          <GoalProvider>
            <Snack />
            <CssBaseline />
            <Routes>
              <Route path="/" element={<Objectives />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/start" element={<Start />} />
              <Route path="/list" element={<List />} />
              <Route path="/new" element={<NewObjetive />} />
            </Routes>
          </GoalProvider>
        </SnackProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
