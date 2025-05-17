import { Container } from "@mui/material";
import type { ReactNode } from "react";

export function BaseLayout({ children }: { children?: ReactNode }) {
  return <Container>{children}</Container>;
}
