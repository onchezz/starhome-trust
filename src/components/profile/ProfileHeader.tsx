import { Badge } from "@/components/ui/badge";
import { Check, Building2, Wallet, Link, Plus } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <div className="relative group">
        <img
          src={user?.profile_image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"}
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40"
        />
        <div className="absolute -bottom-2 right-0 bg-primary text-white p-1 rounded-full">
          <Plus className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex-grow space-y-4">
        <div>
          <h3 className={cn(
            "text-2xl sm:text-3xl font-semibold mb-2",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>{user?.name || "Not Registered"}</h3>
          <p className={cn(
            "text-base sm:text-lg",
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          )}>{user?.email || "No email provided"}</p>
          <p className={cn(
            "text-base",
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          )}>{user?.phone || "No phone provided"}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {user?.is_verified && (
            <Badge variant="secondary" className="text-sm">
              <Check className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
          {user?.is_investor && (
            <Badge variant="outline" className="text-sm">
              <Wallet className="w-4 h-4 mr-1" />
              Investor
            </Badge>
          )}
          {user?.is_agent && (
            <Badge className="text-sm">
              <Building2 className="w-4 h-4 mr-1" />
              Agent
            </Badge>
          )}
          {user?.is_authorized && (
            <Badge variant="secondary" className="text-sm bg-green-500">
              <Link className="w-4 h-4 mr-1" />
              Authorized Lister
            </Badge>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <RouterLink to="/create-property">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Property
            </Button>
          </RouterLink>
          
          {user?.is_authorized && (
            <RouterLink to="/add-investment">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Investment
              </Button>
            </RouterLink>
          )}
        </div>
      </div>
    </div>
  );
}