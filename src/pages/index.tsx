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
import LandingPage from "./LandingPage";
import Update from "./Update";
import TermsOfUse from "./TermsOfUse";
import PrivacyPolicy from "./PrivacyPolicy";
import Loading from "../components/Loading";
import Subscribe from "./Subscribe";
import EditList from "./EditList";

export default function Pages() {
  const { userData } = useDataUser();

  return (
    <ThemeProvider
      theme={userData.darkMode === "Habilitado" ? darkTheme : lightTheme}
    >
      <Loading />
      <Snack />
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/start" element={<Start />} />
          <Route path="/list" element={<List />} />
          <Route path="/new" element={<NewObjective />} />
          <Route path="/league" element={<League />} />
          <Route path="/edit" element={<EditObjective />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/social" element={<Social />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/config" element={<Config />} />
          <Route path="/update" element={<Update />} />
          <Route path="/termsOfUse" element={<TermsOfUse />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/editList" element={<EditList />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}
