import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Building2, CreditCard, Home, Settings, User2 } from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    icon: Home,
    href: "#overview",
  },
  {
    title: "Profile Details",
    icon: User2,
    href: "#profile",
  },
  {
    title: "Investments",
    icon: Building2,
    href: "#investments",
  },
  {
    title: "Wallet",
    icon: CreditCard,
    href: "#wallet",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "#settings",
  },
];

export const ProfileSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Profile</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};