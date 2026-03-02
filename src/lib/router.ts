import { routeTree } from "@/routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
