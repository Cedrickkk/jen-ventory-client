import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { AppRoutes } from "@/lib/router";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

type NavMenuLinkProps = {
  to: AppRoutes;
  tooltip: string;
  label: string;
  Icon: LucideIcon;
};

export default function NavMenuLink({
  to,
  tooltip,
  label,
  Icon,
}: NavMenuLinkProps) {
  return (
    <Link to={to} preload="intent">
      {({ isActive }) => {
        return (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={tooltip}
              isActive={isActive}
              className={isActive ? "bg-primary!" : ""}
            >
              <Icon className={isActive ? "text-white" : "text-primary"} />
              <span className={isActive ? "text-white" : "text-primary"}>
                {label}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }}
    </Link>
  );
}
