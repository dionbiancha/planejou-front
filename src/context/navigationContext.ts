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

  return {
    goBack,
    goToLogin,
    goToHome,
  };
}
