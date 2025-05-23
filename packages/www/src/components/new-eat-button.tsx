import { Add as AddIcon } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import NextLink from "next/link";

export function NewEatButton() {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 72,
        right: 16,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <Fab
        component={NextLink}
        color="primary"
        aria-label="注文登録"
        href="/eats/new"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
