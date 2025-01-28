import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useUserWrite } from "@/hooks/contract_interactions/useUserWrite";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import { useAccount } from "@starknet-react/core";

interface UserRegistrationModalProps {
  isUpdate?: boolean;
  currentUserData?: {
    name: string;
    email: string;
    phone: string;
  };
}

export function UserRegistrationModal({ isUpdate, currentUserData }: UserRegistrationModalProps) {
  const { address } = useAccount();
  const { handleRegisterUser, handleSignAsAgent, contractStatus } = useUserWrite();
  const [formData, setFormData] = useState({
    name: currentUserData?.name || "",
    email: currentUserData?.email || "",
    phone: currentUserData?.phone || "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const response = await handleRegisterUser({
        ...formData,
        id: address,
      });
      
      if (response.status === "success") {
        toast.success(isUpdate ? "Profile updated successfully!" : "Registration successful!");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(isUpdate ? "Failed to update profile" : "Failed to register");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-2">
          <User className="w-4 h-4" />
          {isUpdate ? "Update Profile" : "Register User"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update Profile" : "Register New User"}</DialogTitle>
          <DialogDescription>
            {isUpdate 
              ? "Update your profile information below."
              : "Fill in your details to register as a new user."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={contractStatus.isPending}
          >
            {contractStatus.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdate ? "Update Profile" : "Register"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}