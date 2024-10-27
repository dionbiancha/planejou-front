import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useAuthValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!accessToken || !userId) {
      localStorage.clear();
      if (location.pathname !== "/register") {
        navigate("/login"); // Redirecionar para a página de login
      }
    }
  }, [location.pathname]);
};
