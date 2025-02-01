import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Check, Mail, Phone, Plus, User } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { User as UserType } from "@/types/user";

interface ProfileHeaderProps {
  user: UserType | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { theme } = useTheme();
  
  // Ensure the image URL is properly formatted
  const profileImage = user?.profile_image 
    ? user.profile_image.startsWith('http') 
      ? user.profile_image 
      : `https://${user.profile_image.replace(':/', '')}`
    : "/placeholder.svg";

  console.log("Profile image URL:", profileImage); // Debug log

  return (
    <div className="relative group">
      <div className="relative inline-block">
        <img
          src={profileImage}
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
              Verified User
            </Badge>
          )}
          {user?.is_agent && (
            <Badge variant="secondary" className="text-base py-2 px-4">
              <Check className="w-5 h-5 mr-2" />
              Verified Agent
            </Badge>
          )}
          {user?.is_admin && (
            <Badge variant="secondary" className="text-base py-2 px-4">
              <Check className="w-5 h-5 mr-2" />
              Admin
            </Badge>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <RouterLink to="/create-property">
            <Button 
              variant="default"
              className="flex items-center gap-2"
            >
              Create Property
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  );
}