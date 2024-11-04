import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const RandomImageMover: React.FC = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const speed = 1; // Aumente para aumentar a velocidade

  const moveImage = () => {
    setPosition((prev) => {
      let newTop = prev.top + direction.y * speed;
      let newLeft = prev.left + direction.x * speed;

      const boxHeight = 350; // altura do box pai
      const boxWidth = 550; // largura do box pai
      const imgHeight = 50; // altura da imagem
      const imgWidth = 50; // largura da imagem

      // Verifique as bordas do box pai e inverta a direção se necessário
      if (newTop >= boxHeight - imgHeight || newTop <= 0) {
        setDirection((prevDir) => ({ ...prevDir, y: prevDir.y * -1 })); // Inverte a direção vertical
        newTop = Math.max(0, Math.min(newTop, boxHeight - imgHeight)); // Garante que não saia do box
      }

      if (newLeft >= boxWidth - imgWidth || newLeft <= 0) {
        setDirection((prevDir) => ({ ...prevDir, x: prevDir.x * -1 })); // Inverte a direção horizontal
        newLeft = Math.max(0, Math.min(newLeft, boxWidth - imgWidth)); // Garante que não saia do box
      }

      return { top: newTop, left: newLeft };
    });
  };

  useEffect(() => {
    const interval = setInterval(moveImage, 16); // Move a imagem a cada 16ms (~60 FPS)
    return () => clearInterval(interval);
  }, [direction]); // Não é necessário depender de direction, pois agora o setDirection atualiza o estado

  return (
    <Box
      sx={{
        position: "absolute",
        top: "100px",
        maxWidth: "550px",
        maxHeight: "350px",
        width: "100%",
        height: "100%",

        overflow: "hidden", // Adicione isso para esconder a imagem que sai do box
      }}
    >
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={"logo.png"}
          alt="Moving"
          sx={{
            position: "absolute",
            top: position.top,
            left: position.left,
            transition: "top 0.1s ease, left 0.1s ease", // Ajuste a transição para suavidade
            height: "50px", // altura da imagem
            width: "50px", // largura da imagem
          }}
        />
      </Box>
    </Box>
  );
};

export default RandomImageMover;
