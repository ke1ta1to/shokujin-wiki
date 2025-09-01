"use client";

import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { useUser } from "@/features/auth/hooks/use-user";
import { useContinueUrl } from "@/hooks/use-continue-url";

export function AppHeader() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const { continueUrl } = useContinueUrl();

  const handleClickLogin = () => {
    router.push(`/auth/login?continue=${encodeURIComponent(continueUrl)}`);
  };

  const handleClickSignUp = () => {
    router.push(`/auth/sign-up?continue=${encodeURIComponent(continueUrl)}`);
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{ borderTop: 4, borderColor: "primary.main" }}
    >
      <Toolbar sx={{ overflowX: "auto" }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={NextLink}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            mr: 2,
            flexShrink: 0,
          }}
        >
          食神Wiki
        </Typography>
        <Box
          sx={{ display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}
        >
          {!user && !isLoading && (
            <>
              <Button onClick={handleClickLogin} variant="outlined">
                ログイン
              </Button>
              <Button onClick={handleClickSignUp} variant="contained">
                サインアップ
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
