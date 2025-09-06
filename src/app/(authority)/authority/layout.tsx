"use client";

import AppHeader from "@/features/admin/components/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export default function AuthorityLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <AppHeader />
        <div className="mx-auto mt-10 flex w-full max-w-screen-xl flex-col gap-y-3 px-2.5 pb-10 lg:px-20">
          {children}
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
