import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Building2, Camera } from "lucide-react";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="relative w-32 h-32 mx-auto">
        <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800">
          <AvatarImage
            src={user?.profile_image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback>
            {user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors">
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {user?.is_agent && (
        <div className="flex justify-center">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            <span>Agent</span>
            {user.is_verified && <BadgeCheck className="w-3 h-3 text-green-500 ml-1" />}
          </Badge>
        </div>
      )}
    </div>
  );
}