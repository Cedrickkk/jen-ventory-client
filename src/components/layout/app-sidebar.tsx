import NavMain from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ShoppingCart } from "lucide-react";
import type * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="">
          <div className="hidden aspect-square size-8 items-center justify-center rounded-lg group-data-[collapsible=icon]:flex group-data-[collapsible=offcanvas]:hidden">
            <ShoppingCart className="text-primary size-4" />
          </div>
          <div className="ml-2 flex items-center gap-3 group-data-[collapsible=icon]:hidden">
            <div className="bg-primary flex size-9 shrink-0 items-center justify-center rounded-lg shadow-sm">
              <ShoppingCart className="size-5 text-white" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden group-data-[collapsible=offcanvas]:block">
              <h1 className="text-base font-medium tracking-tight">
                JenVentory
              </h1>
              <p className="text-muted-foreground w-full text-xs">
                Inventory Management
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-col group-data-[collapsible=icon]:-mt-4 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <NavMain />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
