import { Container } from "@mui/material";
import type { ReactNode } from "react";

export function AppLayout({ children }: { children?: ReactNode }) {
  return <Container>{children}</Container>;
}
