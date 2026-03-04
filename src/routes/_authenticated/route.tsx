import { AppSidebar } from "@/components/layout/app-sidebar";
import { ToggleLayout } from "@/components/layout/toggle-layout";
import { ToggleTheme } from "@/components/layout/toggle-theme";
import SearchCommand from "@/components/search-command";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authQueries } from "@/features/auth/queries/use-auth";
import { useLayoutStore } from "@/stores/use-layout-store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(authQueries.user());

    if (!user) {
      throw redirect({ to: "/", search: { redirect: location.href } });
    }

    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const isCompact = useLayoutStore((state) => state.isCompact);

  return (
    <div className="h-full w-full">
      <div className="relative flex min-h-dvh w-full before:fixed before:inset-x-0 before:top-0 before:h-72">
        <SidebarProvider>
          <AppSidebar variant="sidebar" />
          <SidebarInset className="overflow-x-hidden bg-transparent">
            <div className="z-1 flex flex-1 flex-col py-6">
              <header className="text-primary-foreground flex items-center justify-between">
                <div className="flex items-center gap-4 px-6 md:px-12">
                  <SidebarTrigger className="text-primary ml-2.5 cursor-pointer" />
                </div>
                <div className="mr-16 flex flex-row items-center gap-2">
                  <div className="mr-2">
                    <SearchCommand />
                  </div>
                  <ToggleLayout />
                  <ToggleTheme />
                </div>
              </header>
              <main
                className={`mx-auto w-full flex-1 transition-all duration-300 ${isCompact ? "max-w-375 px-6" : "max-w-full px-10"}`}
              >
                <div className="sm:p-0 md:p-6">
                  <Outlet />
                </div>
              </main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
