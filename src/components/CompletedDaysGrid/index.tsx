import { Box, Stack, Typography, useTheme } from "@mui/material";
import CalendarHeatmap, { TooltipDataAttrs } from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, subDays, startOfToday, startOfYesterday } from "date-fns";
import { Tooltip as ReactTooltip } from "react-tooltip"; // Atualização da importação
import "react-tooltip/dist/react-tooltip.css"; // Importar estilos do react-tooltip
import { useTranslation } from "react-i18next";

interface CompletedDaysGridProps {
  completedDays?: string[];
}

const CompletedDaysGrid: React.FC<CompletedDaysGridProps> = ({
  completedDays = [],
}) => {
  const theme = useTheme();
  const today = startOfToday();
  const yesterday = startOfYesterday();
  const oneYearAgo = subDays(today, 365);
  const { t } = useTranslation();

  // Definir explicitamente o tipo de dayCounts
  const dayCounts: { [key: string]: number } = completedDays.reduce(
    (acc, date) => {
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  ); // A linha acima resolve o erro de tipo

  // Mapear os dias completos para o formato exigido pelo react-calendar-heatmap
  const heatmapData = Array.from({ length: 366 }, (_, i) => {
    const date = subDays(today, i);
    const formattedDate = format(date, "yyyy-MM-dd");

    return {
      date: formattedDate,
      count: dayCounts[formattedDate] ?? 0, // Retorna o número de ocorrências ou 0
    };
  });

  function isDarkMode() {
    return theme.palette.mode === "dark";
  }

  const CAPTION = [
    {
      name: "Completo",
      color: theme.palette.primary.main,
    },
    {
      name: "Incompleto",
      color: theme.palette.background.default,
    },
    {
      name: "Hoje",
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Box
      sx={{
        "& .react-calendar-heatmap": {
          display: "block",
          width: "100%",
          minWidth: "600px",
          overflowX: "auto",
          color: theme.palette.text.secondary,
        },
        "& .react-calendar-heatmap text": {
          fontSize: "13px",
        },
        "& .react-calendar-heatmap .color-filled": {
          fill: theme.palette.primary.main,
        },
        "& .react-calendar-heatmap .color-empty": {
          fill: theme.palette.background.default,
        },
        width: "100%",
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
        [theme.breakpoints.down("sm")]: {
          maxWidth: "100%",
        },
      }}
    >
      <CalendarHeatmap
        startDate={oneYearAgo}
        endDate={yesterday}
        values={heatmapData}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          return "color-filled";
        }}
        showWeekdayLabels
        gutterSize={3.5}
        tooltipDataAttrs={(value) => {
          return {
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": `${value?.date} ${
              value?.count ? `Check-ins: ${value?.count}` : ""
            }`,
          } as TooltipDataAttrs;
        }}
      />
      <ReactTooltip
        id="heatmap-tooltip"
        style={{
          backgroundColor: theme.palette.background.default,
          color: isDarkMode()
            ? theme.palette.text.primary
            : theme.palette.text.secondary,
        }}
      />
      <Stack flexDirection={"row"} alignItems={"center"}>
        {CAPTION.map((caption) => (
          <Stack
            direction={"row"}
            alignItems={"center"}
            margin={1}
            key={caption.name}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                margin: 1,
                borderRadius: "2px",
                backgroundColor: caption.color,
              }}
            />
            <Typography sx={{ fontSize: "12px" }} variant="subtitle2">
              {t(caption.name)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default CompletedDaysGrid;
