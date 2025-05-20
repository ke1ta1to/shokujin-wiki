import { Container } from "@mui/material";
import type { ReactNode } from "react";

import { AppBottomNavigation } from "./app-bottom-navigation";
import { AppHeader } from "./app-header";
import { NewEatButton } from "./new-eat-button";

export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <>
      <AppHeader />
      <Container sx={{ paddingBottom: 20 }}>{children}</Container>
      <AppBottomNavigation />
      <NewEatButton />
    </>
  );
}
