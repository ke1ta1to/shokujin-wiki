import { Container } from "@mui/material";
import type { ReactNode } from "react";

import { AppBottomNavigation } from "./app-bottom-navigation";
import { AppHeader } from "./app-header";
import { NewOrderButton } from "./new-order-button";

export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <>
      <AppHeader />
      <Container>{children}</Container>
      <AppBottomNavigation />
      <NewOrderButton />
    </>
  );
}
