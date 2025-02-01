import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Wallet, User, Building2, Settings, Home } from "lucide-react";
import { Button } from "../ui/button";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAgent?: boolean;
}

export const ProfileSidebar = ({ activeTab, onTabChange, isAgent }: ProfileSidebarProps) => {
  const { theme } = useTheme();

  const menuItems = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'investments', label: 'Investments', icon: Building2 },
    ...(isAgent ? [{ id: 'properties', label: 'Properties', icon: Home }] : []),
    // { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "w-64 h-full p-4 border-r",
      theme === "dark" ? "bg-black/40 border-white/10" : "bg-white border-gray-200"
    )}>
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};