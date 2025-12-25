import { Toaster } from "../ui/sonner";

import { Header } from "./header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props;

  return (
    <>
      <Header />
      <div className="px-4 pt-4 pb-8">{children}</div>
      <Toaster />
    </>
  );
}
