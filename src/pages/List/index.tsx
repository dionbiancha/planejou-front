import { Box, Stack } from "@mui/material";
import Layout from "../../components/Layout";

export function List() {
  return (
    <Layout>
      <Stack flexDirection={"row"}>
        <Box>list</Box>
        <Box sx={{ width: "500px" }}></Box>
      </Stack>
    </Layout>
  );
}
