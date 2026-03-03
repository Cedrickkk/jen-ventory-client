import TopLoader from "@/components/top-loader";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <TopLoader />
      <Outlet />
    </>
  );
}
