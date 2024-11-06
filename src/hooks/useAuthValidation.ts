import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useAuthValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!accessToken || !userId) {
      if (
        location.pathname !== "/register" &&
        location.pathname !== "/" &&
        location.pathname !== "/privacyPolicy" &&
        location.pathname !== "/termsOfUse" &&
        location.pathname !== "/update"
      ) {
        navigate("/login"); // Redirecionar para a página de login
      }
    }
  }, [location.pathname]);
};
