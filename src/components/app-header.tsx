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

import { LogoutButton } from "@/features/auth/components/logout-button";

interface AppHeaderProps {
  authenticated?: boolean;
}

export function AppHeader({ authenticated = false }: AppHeaderProps) {
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Application
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {authenticated ? (
            <LogoutButton variant="outlined">ログアウト</LogoutButton>
          ) : (
            <>
              <Button
                component={NextLink}
                href="/auth/login"
                variant="outlined"
              >
                ログイン
              </Button>
              <Button component={NextLink} href="/auth/sign-up">
                サインアップ
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
