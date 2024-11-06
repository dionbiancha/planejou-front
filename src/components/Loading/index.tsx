import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { useLoading } from "../../context/LoadingContext/useLoading";

// Estiliza o container para ocupar toda a tela
const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999, // Garante que fique sobre outros elementos
}));

// Define a animação de girar e dar zoom
const Logo = styled("img")({
  width: "80px", // Tamanho do ícone
  height: "80px",
  marginBottom: "20px", // Espaçamento abaixo do ícone
  animation: "rotateZoom 4s ease-in-out infinite", // Adiciona a animação
  "@keyframes rotateZoom": {
    "0%": {
      transform: "scale(1) rotate(0deg)", // Começo sem zoom e sem rotação
    },
    "25%": {
      transform: "scale(1.5) rotate(720deg)", // Zoom in e duas rotações
    },
    "50%": {
      transform: "scale(1) rotate(720deg)", // Retorna ao tamanho normal, mantendo a rotação
    },
    "75%": {
      transform: "scale(1.5) rotate(0deg)", // Zoom out e nenhuma rotação
    },
    "100%": {
      transform: "scale(1) rotate(0deg)", // Finaliza sem zoom e sem rotação
    },
  },
});

const Loading: React.FC = () => {
  const loading = useLoading();

  if (loading.stateScreen) {
    return (
      <LoadingContainer>
        <div style={{ textAlign: "center" }}>
          <Logo src="logo.png" alt="Logo" />
        </div>
      </LoadingContainer>
    );
  }

  return <></>; // Retorna null se não estiver carregando
};

export default Loading;
