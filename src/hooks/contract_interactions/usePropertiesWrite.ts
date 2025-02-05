import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { Property, PropertyConverter } from '@/types/property';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';

export const usePropertyCreate = () => {
  const { execute, status: contractStatus } = useStarHomeWriteContract();
  const { address } = useAccount();
   const handleListSaleProperty = async (property: Partial<Property>) => {
    console.log("Listing property before listing from form:", property);
    
    try {
      const defaultProperty=
      
      PropertyConverter.convertToStarknetProperty(property,address)


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


  const handleEditProperty = async (propertyId: string, property: Partial<Property>) => {
    try {
      console.log("Editing property:", { propertyId, property });
      const processedProperty = PropertyConverter.convertToStarknetProperty(property, address || "");
      await execute("edit_property", [propertyId, processedProperty]);
      toast.success("Property updated successfully!");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
      throw error;
    }
  };

  const handleListInvestmentProperty = async (investment: InvestmentAsset) => {
    try {
      console.log("Listing investment property:", investment);
      const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
        investment,
        address || ""
      );
      await execute("list_investment_property", [processedInvestment]);
      toast.success("Investment property listed successfully!");
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
        address || ""
      );
      await execute("edit_listed_investment_property", [investmentId, processedInvestment]);
      toast.success("Investment property updated successfully!");
    } catch (error) {
      console.error("Error updating investment property:", error);
      toast.error("Failed to update investment property");
      throw error;
    }
  };

  return {
    handleListSaleProperty,
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    handleEditProperty,
    contractStatus,
  };
};