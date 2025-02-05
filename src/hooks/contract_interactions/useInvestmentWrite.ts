
import { useStarHomeWriteContract } from "../contract_hooks/useStarHomeWriteContract";
import { toast } from "sonner";

export const useInvestmentWithdraw = () => {
  const { execute, status } = useStarHomeWriteContract();

  const handleWithdraw = async (investmentId: string, amount: number) => {
    try {
      console.log("Initiating withdrawal:", { investmentId, amount });
      
      const response = await execute("withdraw_from_property", [
        investmentId,
        amount*Math.pow(10,6)
      ]);

      if (response?.status?.isSuccess) {
        toast.success("Successfully withdrawn funds");
      } else if (response?.status?.isError) {
        toast.error("Failed to withdraw funds");
        console.error("Withdrawal error:", response?.status?.error);
      }

      return response;
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to withdraw funds");
      throw error;
    }
  };

  return {
    handleWithdraw,
    status
  };
};
