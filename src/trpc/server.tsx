import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cache } from "react";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { makeQueryClient } from "./query-client";

// Reuse the QueryClient during the same server request.
export const getQueryClient = cache(makeQueryClient);

// Create a server-side tRPC proxy.
export const trpc = createTRPCOptionsProxy({
  ctx: async () => createTRPCContext(),
  router: appRouter,
  queryClient: getQueryClient,
});

// Hydrate server-prefetched data in client components.
export function HydrateClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}