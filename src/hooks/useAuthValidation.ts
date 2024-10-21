import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthValidation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!accessToken || !userId) {
      localStorage.clear();
      // Redirecionar para a página de login ou qualquer outra página
      navigate("/login"); // Altere para a rota desejada
    }
  }, [navigate]);
};
