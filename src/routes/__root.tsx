import TopLoader from "@/components/top-loader";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Toaster position="top-center" />
      <TopLoader />
      <Outlet />
    </>
  );
}
