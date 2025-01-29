import { Button } from "@/components/ui/button";
import { Building2, BadgeCheck, BadgeAlert } from "lucide-react";
import { UserRegistrationModal } from "./UserRegistrationModal";
import { useUserWrite } from "@/hooks/contract_interactions/useUserWrite";
import { toast } from "sonner";
import { useAccount } from "@starknet-react/core";
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {user && (
          <>
            <Badge variant="outline" className="flex items-center gap-1">
              {user.is_verified ? (
                <>
                  <BadgeCheck className="w-3 h-3 text-green-500" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <BadgeAlert className="w-3 h-3 text-yellow-500" />
                  <span>Unverified</span>
                </>
              )}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {user.is_authorized ? (
                <>
                  <BadgeCheck className="w-3 h-3 text-green-500" />
                  <span>Authorized</span>
                </>
              ) : (
                <>
                  <BadgeAlert className="w-3 h-3 text-yellow-500" />
                  <span>Unauthorized</span>
                </>
              )}
            </Badge>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {user && !user.is_agent && (
          <Button 
            onClick={handleAgentSignup}
            variant="outline"
            disabled={contractStatus.isPending || isLoading}
            className="text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            Sign as Agent
          </Button>
        )}

        <UserRegistrationModal />
      </div>
    </div>
  );
}