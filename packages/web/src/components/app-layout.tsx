import { Container } from "@mui/material";
import { Toaster } from "sonner";

import { AppBottomNavigation } from "./app-bottom-navigation";
import { AppHeader } from "./app-header";

import { AuthProvider } from "@/features/auth/components/auth-provider";

export async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppHeader />
      <Container sx={{ paddingBottom: 12, paddingTop: 4 }}>
        {children}
      </Container>
      <AppBottomNavigation />
      <Toaster />
    </AuthProvider>
  );
}
