import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { StarknetAgent } from '@/types/starknet_types/user_agent';
// import { StarknetAgent } from './agent-types';
// import { useStarHomeWriteContract } from '';

export const useAgentRegistration = () => {
  const { address } = useAccount();
  const { execute, status: contractStatus } = useStarHomeWriteContract();

  const handleRegisterAgent = async (agent: Partial<StarknetAgent>) => {
    try {
      const defaultAgent: StarknetAgent = {
        agent_id: agent.agent_id || "",
        name: agent.name || "",
        phone: agent.phone || "",
        email: agent.email || "",
        profile_image: agent.profile_image || "",
        agent_address: address || ""
      };

      const tx = await execute("register_agent", [defaultAgent]);
      
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

  return {
    handleRegisterAgent,
    contractStatus
  };
};