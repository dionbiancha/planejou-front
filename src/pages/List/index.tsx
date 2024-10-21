import { Box, Stack } from "@mui/material";

export function List() {
  return (
    <>
      <Stack flexDirection={"row"}>
        <Box>list</Box>
        <Box sx={{ width: "500px" }}></Box>
      </Stack>
    </>
  );
}
