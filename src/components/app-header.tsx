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

import { LogoutButton } from "@/features/auth/components/logout-button";
import { useUser } from "@/features/auth/hooks/use-user";
import { useContinueUrl } from "@/hooks/use-continue-url";

export function AppHeader() {
  const router = useRouter();
  const { user } = useUser();

  const { continueUrl } = useContinueUrl();

  const handleClickLogin = () => {
    router.push(`/auth/login?continue=${encodeURIComponent(continueUrl)}`);
  };

  const handleClickSignUp = () => {
    router.push(`/auth/sign-up?continue=${encodeURIComponent(continueUrl)}`);
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={NextLink}
          href="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          My Application
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {user ? (
            <LogoutButton variant="outlined">ログアウト</LogoutButton>
          ) : (
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
