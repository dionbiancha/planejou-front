import { useNavigate } from "react-router-dom";

export function useCustomNavigate() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  function goToLogin() {
    navigate("/login");
  }

  function goToHome() {
    navigate("/");
  }

  function goToStart() {
    navigate("/start");
  }

  function goToList() {
    navigate("/list");
  }

  function goToNewObjetive() {
    navigate("/new");
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
