import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { UserRegistrationModal } from "./UserRegistrationModal";
import { useUserWrite } from "@/hooks/contract_interactions/useUserWrite";
import { toast } from "sonner";
import { useAccount } from "@starknet-react/core";
import { User } from "@/types/user";

interface ProfileActionsProps {
  user: User | null;
  isLoading: boolean;
}

export function ProfileActions({ user, isLoading }: ProfileActionsProps) {
  const { address } = useAccount();
  const { handleSignAsAgent, contractStatus } = useUserWrite();

  const handleAgentSignup = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    try {
      await handleSignAsAgent();
      toast.success("Successfully registered as agent!");
    } catch (error) {
      console.error("Error registering as agent:", error);
      toast.error("Failed to register as agent");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
      <Link to="/create-property" className="w-full">
        <Button 
          variant="outline" 
          className="w-full text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-2"
          disabled={!user}
        >
          <Plus className="w-4 h-4" />
          Create Property
        </Button>
      </Link>
      
      {user && !user.is_agent && (
        <Button 
          onClick={handleAgentSignup}
          variant="outline"
          disabled={contractStatus.isPending || isLoading}
          className="w-full text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-2"
        >
          <Building2 className="w-4 h-4" />
          Sign as Agent
        </Button>
      )}

      <UserRegistrationModal />
    </div>
  );
}