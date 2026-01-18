"use client";

import Navigation from "@/components/private/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function AuthenticatedLayoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto min-h-screen max-w-screen min-w-screen">
        <div className="absolute -z-50 h-64 w-full bg-gradient-to-b from-[#1fab89]/20 to-transparent"></div>
        <div className="mx-auto lg:max-w-screen-2xl">
          <Navigation />
          <div className="mx-4 flex-1 space-y-10 pt-4 md:mx-6">{children}</div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
