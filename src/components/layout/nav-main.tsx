import NavMenuLink from "@/components/layout/nav-link";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { routeConfigs } from "@/lib/router";

export default function NavMain() {
  const routes = Object.values(routeConfigs);

  return (
    <SidebarGroup className="gap-1.5">
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      {routes.map((route) => (
        <NavMenuLink
          key={route.path}
          to={route.path}
          tooltip={route.label}
          label={route.label}
          Icon={route.icon}
        />
      ))}
    </SidebarGroup>
  );
}
