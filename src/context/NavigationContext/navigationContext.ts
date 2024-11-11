import { useNavigate } from "react-router-dom";

export function useCustomNavigate() {
  const navigate = useNavigate();

  function validateNavigate(route: string) {
    return localStorage.getItem("accessToken")
      ? navigate(route)
      : navigate("/login");
  }

  function goBack() {
    navigate(-1);
  }

  function goToLogin() {
    validateNavigate("/login");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
  }

  function goToObjectives() {
    validateNavigate("/objectives");
  }

  function goToStart() {
    validateNavigate("/start");
  }

  function goToEditList() {
    validateNavigate("/editList");
  }

  function goToList() {
    validateNavigate("/list");
  }

  function goToNewObjetive() {
    validateNavigate("/new");
  }

  function goToLeague() {
    validateNavigate("/league");
  }

  function goToRegister() {
    navigate("/register");
  }

  function goToLandingPage() {
    navigate("/");
  }

  function goToTermOfUse() {
    navigate("/termOfUse");
  }

  function goToPrivacyPolicy() {
    navigate("/privacyPolicy");
  }
  function goToSubscribe() {
    validateNavigate("/subscribe");
  }

  function goToEditObjetive() {
    validateNavigate(`/edit`);
  }

  return {
    goBack,
    goToLogin,
    goToObjectives,
    goToList,
    goToStart,
    goToNewObjetive,
    goToEditObjetive,
    goToLeague,
    goToRegister,
    goToLandingPage,
    goToTermOfUse,
    goToPrivacyPolicy,
    goToSubscribe,
    goToEditList,
  };
}
