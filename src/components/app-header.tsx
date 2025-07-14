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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { LogoutButton } from "@/features/auth/components/logout-button";

interface AppHeaderProps {
  authenticated?: boolean;
}

export function AppHeader({ authenticated = false }: AppHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClickLogin = () => {
    const continueUrl = `${pathname}?${searchParams.toString()}`;
    router.push(`/auth/login?continue=${encodeURIComponent(continueUrl)}`);
  };

  const handleClickSignUp = () => {
    const continueUrl = `${pathname}?${searchParams.toString()}`;
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
          {authenticated ? (
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
