import { Badge } from "@/components/ui/badge";
import { Check, Building2, Wallet, Link, Plus, Mail, Phone, User } from "lucide-react";
import { User as UserType } from "@/types/user";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "../ui/button";

interface ProfileHeaderProps {
  user: UserType | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto p-6">
      {/* Profile Image Section */}
      <div className="relative group">
        <img
          src={user?.profile_image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"}
          alt="Profile"
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 shadow-lg"
        />
        <Button 
          variant="default"
          size="icon"
          className="absolute -bottom-2 right-0 rounded-full shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      {/* User Information Section */}
      <div className="flex flex-col items-center space-y-6 w-full">
        <div className="text-center space-y-4">
          <h3 className={cn(
            "text-3xl sm:text-4xl font-bold mb-6",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>{user?.name || "Not Registered"}</h3>
          
          <div className="grid gap-4 w-full max-w-lg mx-auto">
            <div className="bg-secondary/50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <User className="w-5 h-5 text-primary" />
                <span className="font-semibold">Name:</span>
                <span className="text-foreground">{user?.name || "Not provided"}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-7">Your registered full name on the platform</p>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-semibold">Email:</span>
                <span className="text-foreground">{user?.email || "Not provided"}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-7">Primary contact email for notifications</p>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Phone className="w-5 h-5 text-primary" />
                <span className="font-semibold">Phone:</span>
                <span className="text-foreground">{user?.phone || "Not provided"}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-7">Contact number for important updates</p>
            </div>
          </div>
        </div>
        
        {/* Badges Section */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {user?.is_verified && (
            <Badge variant="secondary" className="text-base py-2 px-4">
              <Check className="w-5 h-5 mr-2" />
              Verified
            </Badge>
          )}
          {user?.is_investor && (
            <Badge variant="outline" className="text-base py-2 px-4">
              <Wallet className="w-5 h-5 mr-2" />
              Investor
            </Badge>
          )}
          {user?.is_agent && (
            <Badge className="text-base py-2 px-4">
              <Building2 className="w-5 h-5 mr-2" />
              Agent
            </Badge>
          )}
          {user?.is_authorized && (
            <Badge variant="secondary" className="text-base py-2 px-4 bg-green-500">
              <Link className="w-5 h-5 mr-2" />
              Authorized Lister
            </Badge>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <RouterLink to="/create-property">
            <Button 
              variant="default" 
              size="lg" 
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Create Property
            </Button>
          </RouterLink>
          
          {user?.is_authorized && (
            <RouterLink to="/add-investment">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create Investment
              </Button>
            </RouterLink>
          )}
        </div>
      </div>
    </div>
  );
}