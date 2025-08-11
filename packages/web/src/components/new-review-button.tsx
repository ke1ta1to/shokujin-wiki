"use client";

import { Add as AddIcon } from "@mui/icons-material";
import { Box, Fab } from "@mui/material";
import { useState } from "react";

import { CreateReviewDialog } from "@/features/review/components/create-review-dialog";

export function NewReviewButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 72,
          right: 16,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <Fab color="primary" aria-label="レビュー登録" onClick={handleOpen}>
          <AddIcon />
        </Fab>
      </Box>
      <CreateReviewDialog open={open} onClose={handleClose} />
    </>
  );
}
