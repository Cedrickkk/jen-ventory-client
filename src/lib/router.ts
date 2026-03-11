import { queryClient } from "@/lib/query";
import { routeTree } from "@/routeTree.gen";
import {
  createRouter,
  type LinkProps,
  type RegisteredRouter,
} from "@tanstack/react-router";
import {
  Box,
  CreditCard,
  LayoutDashboard,
  ScanQrCode,
  Users,
  type LucideIcon,
} from "lucide-react";

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

export type AppRoutes = LinkProps<RegisteredRouter>["to"];

export type RouteConfig = {
  path: AppRoutes;
  label: string;
  icon: LucideIcon;
};

export const routeConfigs: Record<string, RouteConfig> = {
  dashboard: {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  products: {
    path: "/products",
    label: "Products",
    icon: Box,
  },
  customers: {
    path: "/customers",
    label: "Customers",
    icon: Users,
  },
  gcash: {
    path: "/gcash",
    label: "GCash",
    icon: ScanQrCode,
  },
  transactions: {
    path: "/transactions",
    label: "Transactions",
    icon: CreditCard,
  },
};
