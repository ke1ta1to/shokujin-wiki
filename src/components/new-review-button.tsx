import { Add as AddIcon } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import NextLink from "next/link";

export function NewReviewButton() {
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
        aria-label="レビュー登録"
        href="/reviews/new"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
