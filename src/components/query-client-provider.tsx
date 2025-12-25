"use client";

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";

export interface QueryClientProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function QueryClientProvider(props: QueryClientProviderProps) {
  return (
    <ReactQueryClientProvider client={queryClient}>
      {props.children}
    </ReactQueryClientProvider>
  );
}
