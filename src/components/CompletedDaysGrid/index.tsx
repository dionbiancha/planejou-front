import React from "react";
import { Grid, Box, Typography, Tooltip, useTheme } from "@mui/material";
import {
  format,
  subDays,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfToday,
  startOfMonth,
  addMonths,
} from "date-fns";
import { useTranslation } from "react-i18next";

interface CompletedDaysGridProps {
  completedDays?: string[];
}

const CompletedDaysGrid: React.FC<CompletedDaysGridProps> = ({
  completedDays = [],
}) => {
  const theme = useTheme();
  const today = startOfToday();
  const { t } = useTranslation();
  const oneYearAgo = subDays(today, 365);

  // Gerar todos os dias dos últimos 12 meses, organizados por semana
  const weeks = [];
  let currentDate = oneYearAgo;

  while (currentDate <= today) {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    const daysOfWeek = eachDayOfInterval({ start, end });
    weeks.push(daysOfWeek);
    currentDate = subDays(end, -1);
  }

  // Dias da semana
  const daysOfWeek = ["", "Seg", "", "Qua", "", "Sex", ""];

  // Gerar nomes dos meses no topo da grid
  const months = [];
  let monthStart = startOfMonth(oneYearAgo);
  while (monthStart <= today) {
    months.push(monthStart);
    monthStart = addMonths(monthStart, 1);
  }

  // Definir a cor das células
  const getCellColor = (day: Date) => {
    const formattedDay = format(day, "yyyy-MM-dd");
    if (day.getTime() === today.getTime()) {
      return theme.palette.warning.main;
    }
    return completedDays.includes(formattedDay)
      ? theme.palette.primary.main
      : theme.palette.background.default;
  };

  function isDarkMode() {
    return theme.palette.mode === "dark";
  }

  return (
    <Grid
      direction="column"
      spacing={0.5}
      sx={{
        width: "100%",
        maxWidth: "600px",
        paddingBottom: "20px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          height: "6px",
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
      {/* Linha de meses no topo */}
      <Grid
        container
        width={"700px"}
        item
        spacing={0.5}
        justifyContent="space-between"
      >
        <Box width={5} />
        {months.map((month) => (
          <Box key={format(month, "yyyy-MM")} width={30} textAlign="center">
            <Typography variant="caption">{format(month, "MMM")}</Typography>
          </Box>
        ))}
      </Grid>

      <Grid container direction="row" wrap="nowrap">
        {/* Coluna com dias da semana */}
        <Grid
          item
          container
          direction="column"
          justifyContent="space-between"
          spacing={0.5}
          paddingRight={2}
          paddingLeft={2}
        >
          {daysOfWeek.map((day) => (
            <Box key={day} height={15} display="flex" alignItems="center">
              <Typography variant="caption">{t(day)}</Typography>
            </Box>
          ))}
        </Grid>

        {/* Grade de dias */}
        {weeks.map((week, weekIndex) => (
          <Grid container item direction="column" spacing={0.5} key={weekIndex}>
            {week.map((day) => (
              <Tooltip
                key={format(day, "yyyy-MM-dd")}
                title={format(day, "dd/MM/yyyy")}
              >
                <Box
                  margin={"3px"}
                  width={10}
                  height={10}
                  bgcolor={getCellColor(day)}
                  borderRadius={"2px"}
                />
              </Tooltip>
            ))}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default CompletedDaysGrid;
