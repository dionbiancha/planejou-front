import {
  Box,
  Card,
  Stack,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import RoundedTextField from "../../components/Form/RoundedTextField";
import CustomButton from "../../components/Button/CustomButton";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete"; // Novo ícone de exclusão

interface Tip {
  id: string;
  content: string;
}

export function Start() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [goal, setGoal] = useState("");
  const [errorGoal, setErrorGoal] = useState("");
  const [goals, setGoals] = useState<Tip[]>([]);
  const [currentTip, setCurrentTip] = useState(tips[0]);

  function isDarkMode() {
    return theme.palette.mode === "dark";
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddGoal = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && goal.trim()) {
      if (goals.length >= 25) {
        setErrorGoal("Você atingiu o limite de 25 metas.");
        return;
      }
      setGoals([...goals, { id: `goal-${goals.length}`, content: goal }]);
      setGoal("");
    }
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id)); // Remove o item da lista
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedGoals = Array.from(goals);
    const [removed] = updatedGoals.splice(result.source.index, 1);
    updatedGoals.splice(result.destination.index, 0, removed);

    setGoals(updatedGoals);
  };

  function disabledButton() {
    return goals.length <= 4;
  }

  return (
    <Stack direction={"column"} alignItems={"center"} height={"100%"}>
      <Card
        sx={{
          maxWidth: "600px",
          width: "100%",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "none",
          maxHeight: "600px",
          height: "100%",
        }}
      >
        <Stack
          spacing={3}
          flexDirection={"column"}
          justifyContent={"space-between"}
          height={"100%"}
        >
          <Box>
            <RoundedTextField
              fullWidth
              label={t("Minha meta é...")}
              variant="outlined"
              error={Boolean(errorGoal)}
              helperText={errorGoal ? t(errorGoal) : ""}
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              onKeyDown={handleAddGoal}
              placeholder={t("Escreva aqui ou escolha abaixo")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                },
              }}
            />
            <Box
              sx={{
                maxHeight: "300px",
                mt: "20px",
                height: "100%",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "0px", // Para Chrome, Safari e Opera
                },
                "-ms-overflow-style": "none", // Para IE e Edge
                "scrollbar-width": "none",
              }}
            >
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="goals">
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{ maxWidth: "600px", width: "100%", mt: "30px" }}
                    >
                      {goals.map((goal, index) => (
                        <Draggable
                          key={goal.id}
                          draggableId={goal.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "10px",
                                boxShadow: "none",
                                backgroundColor: snapshot.isDragging
                                  ? `${isDarkMode() ? "#121212" : "#e0e0e0"}`
                                  : `${isDarkMode() ? "#333" : "#f9f9f9"}`,
                                "&:hover": {
                                  backgroundColor: `${
                                    isDarkMode() ? "#33333384" : "#f5f5f5"
                                  }`,
                                },
                              }}
                            >
                              <Typography color="textPrimary">
                                <Box
                                  component={"span"}
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "20px",
                                    marginRight: "10px",
                                    color: "text.secondary",
                                  }}
                                >
                                  {index + 1}.
                                </Box>
                                {goal.content}
                              </Typography>
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleRemoveGoal(goal.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          </Box>
          <CustomButton
            onClick={() => {}}
            variant="contained"
            size="large"
            label={"Próximo"}
            disabled={disabledButton()}
          />
        </Stack>
      </Card>

      <Box mt="15px">
        <Typography variant="subtitle2">
          <b>Dica: </b>
          {t(currentTip)}
        </Typography>
      </Box>
    </Stack>
  );
}

const tips = [
  "A meta deve ser específica e mensurável. Exemplo: 'Perder 20kg'.",
  "Mantenha o hábito de acompanhar seu progresso diariamente.",
  "Compartilhe suas metas com amigos ou familiares para obter apoio.",
];
