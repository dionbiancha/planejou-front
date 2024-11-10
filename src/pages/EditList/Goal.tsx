import {
  Box,
  Card,
  Stack,
  Typography,
  useTheme,
  IconButton,
  Button,
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
import { StartProps, Step } from "../../types";
import { useGoals } from "../../context";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { ArrowBack } from "@mui/icons-material";
import { useCustomNavigate } from "../../context/NavigationContext/navigationContext";

export default function Goal({ handleStep }: StartProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [goal, setGoal] = useState("");
  const [errorGoal, setErrorGoal] = useState("");
  const [currentTip, setCurrentTip] = useState(tips[0]);
  const { goals, setGoals } = useGoals();
  const { goBack } = useCustomNavigate();

  function isDarkMode() {
    return theme.palette.mode === "dark";
  }

  const handleAddGoal = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && goal.trim()) {
      if (goals.length >= 25) {
        setErrorGoal(t("Você atingiu o limite de 25 metas."));
        return;
      }
      setGoals([
        ...goals,
        { position: `${goals.length}`, name: goal, months: 24 },
      ]);
      setGoal("");
    }
  };

  const handleAddGoalClick = () => {
    if (goal.trim()) {
      if (goals.length >= 25) {
        setErrorGoal(t("Você atingiu o limite de 25 metas."));
        return;
      }
      setGoals([
        ...goals,
        { position: `${goals.length}`, name: goal, months: 24 },
      ]);
      setGoal("");
    }
  };

  const handleRemoveGoal = (p: string) => {
    setGoals(goals.filter((goal) => goal.position !== p)); // Remove o item da lista
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

  function labelButton() {
    if (goals.length === 4) {
      return `${t("Falta")} ${5 - goals.length} ${t("meta")}`;
    }
    if (goals.length <= 4) {
      return `${t("Faltam")} ${5 - goals.length} ${t("metas")}`;
    }
    return t("Próximo");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Stack
      mt={5}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          maxWidth: "600px",
          width: "100%",
          padding: "10px",
        }}
      >
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBack sx={{ height: "20px" }} />}
          onClick={() => goBack()}
        >
          {t("Voltar")}
        </Button>
      </Stack>
      <Card
        sx={{
          maxWidth: "600px",
          width: "100%",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "none",
          minHeight: "600px",
        }}
      >
        <Stack
          spacing={3}
          flexDirection={"column"}
          justifyContent={"space-between"}
          sx={{ minHeight: "600px" }}
        >
          <Box>
            <RoundedTextField
              fullWidth
              endIcon={
                <IconButton onClick={handleAddGoalClick}>
                  <KeyboardReturnIcon />
                </IconButton>
              }
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
            <Stack flexDirection={"row"} flexWrap={"wrap"} mt="20px">
              {exempleGoals.map((exempleGoal, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setGoals([
                      ...goals,
                      {
                        position: `${goals.length}`,
                        name: t(exempleGoal),
                        months: 24,
                      },
                    ]);
                  }}
                  sx={{
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    margin: "5px",
                    backgroundColor: `${isDarkMode() ? "#242933" : "#f9f9f9"}`,
                    "&:hover": {
                      backgroundColor: `${
                        isDarkMode() ? "#24293345" : "#f5f5f5"
                      }`,
                    },
                  }}
                >
                  {t(exempleGoal)}
                </Box>
              ))}
            </Stack>
            <Box
              sx={{
                maxHeight: "200px",
                mt: "20px",
                height: "100%",
                pr: "20px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: `${isDarkMode() ? "#242933" : "#f9f9f9"}`,
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: `#e0e0e0`,
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: `${isDarkMode() ? "#f5f5f55a" : "#24293345"}`,
                },
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
                          key={index}
                          draggableId={goal.position}
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
                                  ? `${isDarkMode() ? "#242933" : "#e0e0e0"}`
                                  : `${isDarkMode() ? "#242933" : "#f9f9f9"}`,
                                "&:hover": {
                                  backgroundColor: `${
                                    isDarkMode() ? "#24293345" : "#f5f5f5"
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
                                {goal.name}
                              </Typography>
                              <IconButton
                                size="small"
                                aria-label="delete"
                                onClick={() => handleRemoveGoal(goal.position)}
                              >
                                <DeleteIcon sx={{ height: "20px" }} />
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
            onClick={() => handleStep(Step.Date)}
            variant="contained"
            size="large"
            label={labelButton()}
            disabled={disabledButton()}
          />
        </Stack>
      </Card>

      <Box mt="15px">
        <Typography variant="subtitle2">"{t(currentTip)}"</Typography>
      </Box>
    </Stack>
  );
}

const tips = [
  "A meta deve ser específica e mensurável. Exemplo: 'Perder 20kg'.",
  "Mantenha o hábito de acompanhar seu progresso diariamente.",
  "Compartilhe suas metas com amigos ou familiares para obter apoio.",
];

const exempleGoals = [
  "🏃 Correr uma maratona",
  "👴 Economizar para a aposentadoria",
  "🗣️  Aprender um novo idioma",
  "💵 Criar um fundo de emergência",
  "🧑‍🎓Terminar a faculdade",
  "🚗 Comprar um carro",
  "🏍️ Comprar uma moto",
  "🧳 Tirar um ano sabático",
];
