import { PageHeader } from "@/components/page-header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/gcash")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageHeader
        title="GCash"
        description="Manage Cash In and Cash Out requests, track service fees, and monitor your digital wallet balance."
      />
      <Outlet />
    </div>
  );
}
