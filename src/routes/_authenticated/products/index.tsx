import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/products/")({
  head: () => ({
    meta: [
      {
        title: "Products - JenVentory",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/items/"!</div>;
}
