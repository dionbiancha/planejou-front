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
    validateNavigate("/register");
  }

  function goToLandingPage() {
    validateNavigate("/");
  }

  function goToUpdate() {
    validateNavigate("/register");
  }

  function goToTermOfUse() {
    validateNavigate("/termOfUse");
  }

  function goToPrivacyPolicy() {
    validateNavigate("/privacyPolicy");
  }
  function goToSubscribe() {
    validateNavigate("/subscribe");
  }

  function goToEditObjetive(id: string) {
    validateNavigate(`/edit/${id}`);
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
    goToUpdate,
    goToLandingPage,
    goToTermOfUse,
    goToPrivacyPolicy,
    goToSubscribe,
  };
}
