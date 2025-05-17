import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import NextLink from "next/link";

import { SignOutButton } from "./sign-out-button";

import { createClient } from "@/utils/supabase/server";

export async function AppHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AppBar position="static">
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
          <Link component={NextLink} href="/" color="inherit" underline="none">
            食神Wiki
          </Link>
        </Typography>
        {user ? (
          <SignOutButton color="inherit">ログアウト</SignOutButton>
        ) : (
          <>
            <Button component={NextLink} href="/signup" color="inherit">
              新規登録
            </Button>
            <Button component={NextLink} href="/signin" color="inherit">
              ログイン
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
