"use client";

import {
  Article as ArticleIcon,
  Home as HomeIcon,
  Restaurant as RestaurantIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useUser } from "@/features/auth/hooks/use-user";

export function AppBottomNavigation() {
  const { user, isLoading } = useUser();

  const fixedActions = actions.filter((action) => {
    if (action.authenticated) {
      return user !== null || isLoading;
    }
    return true;
  });

  const pathname = usePathname();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <BottomNavigation showLabels value={true}>
        {fixedActions.map((action) => (
          <BottomNavigationAction
            key={action.label}
            label={action.label}
            icon={action.icon}
            component={NextLink}
            href={action.href}
            value={pathname === action.href}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

const actions = [
  {
    label: "ホーム",
    icon: <HomeIcon />,
    href: "/",
  },
  {
    label: "商品一覧",
    icon: <RestaurantIcon />,
    href: "/products",
  },
  {
    label: "記事",
    icon: <ArticleIcon />,
    href: "/articles",
  },
  {
    label: "設定",
    icon: <SettingsIcon />,
    href: "/settings",
    authenticated: true,
  },
] satisfies {
  label: string;
  icon: ReactNode;
  href: string;
  authenticated?: boolean;
}[];
