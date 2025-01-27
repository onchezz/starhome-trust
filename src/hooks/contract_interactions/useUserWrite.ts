import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { StarknetAgent } from '@/types/starknet_types/user_agent';
// import { StarknetAgent } from './agent-types';
// import { useStarHomeWriteContract } from '';

export const useUserWrite = () => {
  const { address } = useAccount();
  const { execute, status: contractStatus } = useStarHomeWriteContract();

  const handleRegisterUser = async (agent: Partial<StarknetAgent>) => {
    try {
      const defaultAgent: StarknetAgent = {
        id:address||"",
        name: agent.name || "",
        phone: agent.phone || "",
        email: agent.email || "",
        profile_image: agent.profile_image || "",
        is_verified: false,
        is_authorized: false,
        is_agent: false,
        is_investor: false,
        timestamp: Math.floor(Date.now() / 1000)
      };

      console.log("user data from form"+{...agent })


      const tx = await execute("register_user", [defaultAgent]);
      
      toast.success("Agent registered successfully!");
      return {
        transaction_hash: tx.response.transaction_hash,
        status: 'success' as const
      };
    } catch (error) {
      console.error("Error registering agent:", error);
      toast.error("Failed to register agent");
      throw error;
    }
  };
  const handleSignAsAgent = async ()=>{
    try {
     
      console.log("signing agent ")

      const tx = await execute("register_as_agent", [address]);
      
      toast.success("Agent registered successfully!");
      return {
        transaction_hash: tx.response.transaction_hash,
        status: 'success' as const
      };
    } catch (error) {
      console.error("Error registering agent:", error);
      toast.error("Failed to register agent");
      throw error;
    }
  }

  return {
    handleRegisterUser,
    handleSignAsAgent,
    contractStatus
  };
};