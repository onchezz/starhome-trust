import { Badge } from "@/components/ui/badge";
import { Check, Building2, Wallet, Link } from "lucide-react";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "../ui/button";

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4">
      <img
        src={user?.profile_image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"}
        alt="Profile"
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-primary/20"
      />
      <div className="space-y-2">
        <h3 className={cn(
          "text-base sm:text-lg md:text-xl font-medium",
          theme === "dark" ? "text-white" : "text-gray-900"
        )}>{user?.name || "Not Registered"}</h3>
        <p className={cn(
          "text-sm sm:text-base",
          theme === "dark" ? "text-gray-300" : "text-gray-500"
        )}>{user?.email || "No email provided"}</p>
        <p className={cn(
          "text-sm sm:text-base",
          theme === "dark" ? "text-gray-300" : "text-gray-500"
        )}>{user?.phone || "No phone provided"}</p>
        
        <div className="flex flex-wrap gap-2">
          {user?.is_verified && (
            <Badge variant="secondary" className="text-xs sm:text-sm">
              <Check className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
          {user?.is_investor && (
            <Badge variant="outline" className="text-xs sm:text-sm">
              <Wallet className="w-3 h-3 mr-1" />
              Investor
            </Badge>
          )}
          {user?.is_agent && (
            <Badge className="text-xs sm:text-sm">
              <Building2 className="w-3 h-3 mr-1" />
              Agent
            </Badge>
          )}
          {user?.is_authorized && (
            <Badge variant="secondary" className="text-xs sm:text-sm bg-green-500">
              <Link className="w-3 h-3 mr-1" />
              Authorized Lister
            </Badge>
          )}
        </div>
        
        {user?.is_authorized && (
          <RouterLink to="/create-investment">
            <Button variant="outline" className="mt-2">
              Create Investment Property
            </Button>
          </RouterLink>
        )}
      </div>
    </div>
  );
}