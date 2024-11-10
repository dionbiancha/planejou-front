import "./App.css";
import "./translation/i18n";

import { BrowserRouter } from "react-router-dom";
import { GoalProvider } from "./context";
import { SnackProvider } from "./context/SnackContext";

import { UserProvider } from "./context/UserContext";

import { LoadingProvider } from "./context/LoadingContext";
import Pages from "./pages";
import { ObjectiveProvider } from "./context/ObjectiveContext";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <LoadingProvider>
          <SnackProvider>
            <GoalProvider>
              <ObjectiveProvider>
                <Pages />
              </ObjectiveProvider>
            </GoalProvider>
          </SnackProvider>
        </LoadingProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
