import {
  Home as HomeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import NextLink from "next/link";
import type { ReactNode } from "react";

export function AppBottomNavigation() {
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
      <BottomNavigation showLabels>
        {actions.map((action) => (
          <BottomNavigationAction
            key={action.label}
            label={action.label}
            icon={action.icon}
            component={NextLink}
            href={action.href}
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
    label: "検索",
    icon: <SearchIcon />,
    href: "/search",
  },
  {
    label: "設定",
    icon: <SettingsIcon />,
    href: "/settings",
  },
] satisfies {
  label: string;
  icon: ReactNode;
  href: string;
}[];
