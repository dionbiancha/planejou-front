import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "../theme";
import Snack from "../components/Snack";
import Layout from "../components/Layout";
import { Route, Routes } from "react-router-dom";
import { Objectives } from "./Objectives";
import { SignIn } from "./SignIn";
import Start from "./Start";
import { List } from "./List";
import NewObjective from "./NewObjective";
import { League } from "./League";
import Missions from "./Missions";
import Social from "./Social";
import Profile from "./Profile";
import Config from "./Config";
import EditObjective from "./EditObjective";
import { useDataUser } from "../context/UserContext/useUser";
import { SignUp } from "./SignUp";

export default function Pages() {
  const { userData } = useDataUser();

  return (
    <ThemeProvider
      theme={userData.darkMode === "Habilitado" ? darkTheme : lightTheme}
    >
      <Snack />
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Objectives />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/start" element={<Start />} />
          <Route path="/list" element={<List />} />
          <Route path="/new" element={<NewObjective />} />
          <Route path="/league" element={<League />} />
          <Route path="/edit/:id" element={<EditObjective />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/social" element={<Social />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}
