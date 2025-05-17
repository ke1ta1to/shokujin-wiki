import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

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
          {user?.email}
        </Typography>
        {user ? (
          <SignOutButton color="inherit">ログアウト</SignOutButton>
        ) : (
          <>
            <Button component={Link} href="/signup" color="inherit">
              新規登録
            </Button>
            <Button component={Link} href="/signin" color="inherit">
              ログイン
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
