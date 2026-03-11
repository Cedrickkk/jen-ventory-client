import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/gcash/")({
  head: () => ({
    meta: [
      {
        title: "GCash - JenVentory",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/gcash/"!</div>;
}
