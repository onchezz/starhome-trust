import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useUserWrite } from "@/hooks/contract_interactions/useUserWrite";
import { toast } from "sonner";
import { User, Loader2 } from "lucide-react";
import { useAccount } from "@starknet-react/core";
import { UserForm } from "./UserForm";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";
import { User as UserType } from "@/types/user";

export function UserRegistrationModal() {
  const { address } = useAccount();
  const { handleRegisterUser, contractStatus } = useUserWrite();
  const { user: currentUser, isLoading: isLoadingUser } = useUserReadByAddress(address || "");
  
  const [formData, setFormData] = useState<Partial<UserType>>({
    name: "",
    email: "",
    phone: "",
    is_verified: false,
    is_agent: false,
    is_investor: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  const isUserRegistered = currentUser && currentUser.name && currentUser.phone && currentUser.email;

  useEffect(() => {
    if (isUserRegistered) {
      console.log("Pre-filling user data:", currentUser);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        is_verified: currentUser.is_verified,
        is_agent: currentUser.is_agent,
        is_investor: currentUser.is_investor,
      });
    } else {
      console.log("No user data to pre-fill");
      setFormData({
        name: "",
        email: "",
        phone: "",
        is_verified: false,
        is_agent: false,
        is_investor: false,
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      console.log("Current form data:", formData);
      const userData = {
        ...formData,
        id: address,
        profile_image: "",
        is_verified: false,
        is_authorized: false,
        timestamp: Math.floor(Date.now() / 1000),
      };

      console.log("Submitting user data:", userData);
      
      const response = await handleRegisterUser(userData);
      
      if (response.status === "success") {
        toast.success(isUserRegistered ? "Profile updated successfully!" : "Registration successful!");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(isUserRegistered ? "Failed to update profile" : "Failed to register");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-2">
          <User className="w-4 h-4" />
          {isUserRegistered ? "Update Profile" : "Create Account"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isUserRegistered ? "Update Profile" : "Create New Account"}
          </DialogTitle>
          <DialogDescription>
            {isUserRegistered 
              ? "Update your profile information below."
              : "Fill in your details to create a new account."}
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          formData={formData}
          setFormData={setFormData}
          isLoading={contractStatus.isPending || isLoadingUser}
          onSubmit={handleSubmit}
          isUpdate={!!isUserRegistered}
        />
      </DialogContent>
    </Dialog>
  );
}