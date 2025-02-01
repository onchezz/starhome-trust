import { usePropertyCreate } from "@/hooks/contract_interactions/usePropertiesWrite";
import { useTokenApproval } from "@/hooks/contract_interactions/usetokensHook";
import { toast } from "sonner";

export const useInvestment = () => {
  const { handleListInvestmentProperty, handleEditInvestmentProperty, contractStatus } = usePropertyCreate();
  const { approveToken } = useTokenApproval();

  const approveAndInvest = async (tokenAddress: string, amount: string) => {
    try {
      await approveToken(tokenAddress, amount);
      toast.success("Token approved successfully!");
    } catch (error) {
      console.error("Error approving token:", error);
      toast.error("Failed to approve token");
      throw error;
    }
  };

  return {
    approveAndInvest,
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    contractStatus,
  };
};