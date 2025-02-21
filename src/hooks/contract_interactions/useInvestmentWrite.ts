import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { useStarHomeWriteContract } from "../contract_hooks/useStarHomeWriteContract";
import { toast } from "sonner";
import { useAccount } from "@starknet-react/core";

export const useInvestmentWrite = () => {
  const { address } = useAccount();
  const { execute, status } = useStarHomeWriteContract();

  const handleWithdraw = async (investmentId: string, amount: number) => {
    try {
      console.log("Initiating withdrawal:", { investmentId, amount });
      
      const response = await execute("withdraw_from_investment_property", [
        investmentId,
        amount*Math.pow(10,6)
      ]);

      if (response?.status?.isSuccess) {
       
        toast.success("Successfully withdrawn funds");
        return  response;
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
  const handleMakeInvestment = async (investmentId: string, amount: number) => {
    try {
      console.log("Initiating Investment:", { investmentId, amount });
      
      const response = await execute("invest_in_property", [
        investmentId,
        amount
      ]);

      if (response?.status?.isSuccess) {
        toast.success("Successfully Invested funds");
      } else if (response?.status?.isError) {
        toast.error("Failed to Invest funds");
        console.error("Investing error:", response?.status?.error);
      }

      return response;
    } catch (error) {
      console.error("Investing error", error);
      toast.error("Failed to Invest funds");
      throw error;
    }
  };


   const handleListInvestmentProperty = async (investment: InvestmentAsset) => {
    try {
      console.log("Listing investment property:", investment);
      const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
        investment,
        address 
      );
     const tx =  await execute("list_investment_property", [processedInvestment]);
      toast.success("Investment property listed successfully!");
      
      return tx;
    } catch (error) {
      console.error("Error listing investment property:", error);
      toast.error("Failed to list investment property");
      throw error;
    }
  };

  const handleEditInvestmentProperty = async (investmentId: string, investment: InvestmentAsset) => {
    try {
      console.log("Editing investment property:", { investmentId, investment });
      const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
        investment,
        address
      );
     const tx =   await execute("edit_listed_investment_property", [investmentId, processedInvestment]);
      toast.success("Investment property updated successfully!");
      return tx;
    } catch (error) {
      console.error("Error updating investment property:", error);
      toast.error("Failed to update investment property");
      throw error;
    }
  };

  return {
    handleMakeInvestment,
    handleWithdraw,
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    status
  };
};