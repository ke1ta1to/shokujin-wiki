import { Container } from "@mui/material";
import type { ReactNode } from "react";

import { AppHeader } from "./app-header";

export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <>
      <AppHeader />
      <Container>{children}</Container>
    </>
  );
}
