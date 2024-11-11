import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useAuthValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    const allowedPaths = [
      "/register",
      "/",
      "/privacyPolicy",
      "/termsOfUse",
      "/update",
    ];

    if (!accessToken || !userId) {
      if (!allowedPaths.includes(location.pathname)) {
        console.log("Usuário não autenticadoaaaaaaaaaaaaa", location.pathname);
        navigate("/login"); // Redirecionar para a página de login
      }
    }
  }, [location.pathname, navigate]);
};
