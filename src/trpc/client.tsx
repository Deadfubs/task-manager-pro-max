"use client";

import superjson from "superjson";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";

import type { AppRouter } from "@/server/api/root";
import { makeQueryClient } from "./query-client";

export const { TRPCProvider, useTRPC } =
  createTRPCContext<AppRouter>();

let browserQueryClient: ReturnType<typeof makeQueryClient> | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  return (browserQueryClient ??= makeQueryClient());
}

function getUrl() {
  if (typeof window !== "undefined") {
    return "/api/trpc";
  }

  return `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/trpc`;
}

export function TRPCReactProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
  createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getUrl(),
        transformer: superjson,
      }),
    ],
  }),
);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}