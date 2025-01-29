import { Badge } from "@/components/ui/badge";
import { Check, Building2, Wallet, Link, Plus, Camera } from "lucide-react";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
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
  );
}