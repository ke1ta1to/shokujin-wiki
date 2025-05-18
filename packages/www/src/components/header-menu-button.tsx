"use client";

import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import NextLink from "next/link";
import type { MouseEvent } from "react";
import { useState } from "react";

import { signOut } from "@/actions/auth";

export function HeaderMenuButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpen}
        color="inherit"
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={NextLink} href="/settings/account">
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          プロフィール
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          ログアウト
        </MenuItem>
      </Menu>
    </>
  );
}
