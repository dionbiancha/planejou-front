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
  }

  function goToHome() {
    validateNavigate("/");
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

  return {
    goBack,
    goToLogin,
    goToHome,
    goToList,
    goToStart,
    goToNewObjetive,
  };
}
