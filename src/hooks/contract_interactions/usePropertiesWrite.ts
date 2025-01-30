import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { Property, PropertyConverter, StarknetProperty } from '@/types/property';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { num } from 'starknet';

export const usePropertyCreate = () => {
  const { address } = useAccount();
  const { contract, execute, status: contractStatus } = useStarHomeWriteContract();

  const handleListSaleProperty = async (property: Partial<Property>) => {
    console.log("Listing property before listing from form:", property);
    
    try {
      const defaultProperty= PropertyConverter.convertToStarknetProperty(property,address)

      console.log("Listing property after conversion:", defaultProperty);

      const tx = await execute("list_property", [defaultProperty]);
      
      toast.success(`Property listed successfully! ${tx.response.transaction_hash}`);
      return {
        status: 'success' as const
      };
    } catch (error) {
      console.error("Error listing property:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to list property";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleListInvestmentProperty = async (investment:InvestmentAsset) => {
    console.log("Listing investment property before conversion:", investment);

    try {
      const investmentProp = InvestmentAssetConverter.toStarknetProperty(investment, address)
      console.log("Listing investment property after conversion:", investmentProp);

      const tx = await execute("list_investment_property", [investmentProp]);
      
      toast.success(`Investment property listed successfully! ${tx.response.transaction_hash}`);
      return {
        status: 'success' as const,
        data: tx
      };
    } catch (error) {
      console.error("Error listing investment property:", error);
      let errorMessage = "Failed to list investment property";
      
      if (error instanceof Error) {
        if (error.message.includes("Error in the called contract")) {
          const match = error.message.match(/Error message: (.*?)(?:\n|$)/);
          errorMessage = match ? match[1] : error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleInvestInProperty = async (investmentId: string, amount: number) => {
    console.log("Investing in property:", { investmentId, amount });
    
    try {
      // Convert amount to the correct format (wei)
      // const amountInWei = num.toBigInt(amount);
      console.log("Amount :", amount);

      const tx = await execute("invest_in_property", [investmentId, amount]);
      
      toast.success(`Investment successful! Transaction hash: ${tx.response.transaction_hash}`);
      return {
        status: 'success' as const,
        data: tx
      };
    } catch (error) {
      console.error("Error investing in property:", error);
      let errorMessage = "Failed to invest in property";
      
      if (error instanceof Error) {
        if (error.message.includes("Error in the called contract")) {
          const match = error.message.match(/Error message: (.*?)(?:\n|$)/);
          errorMessage = match ? match[1] : error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    handleListSaleProperty,
    handleListInvestmentProperty,
    handleInvestInProperty,
    contractStatus
  };
};