import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { Property, PropertyConverter } from '@/types/property';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';

export const usePropertyCreate = () => {
  const { execute, status: contractStatus } = useStarHomeWriteContract();
  const { address } = useAccount();

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
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    handleEditProperty,
    contractStatus,
  };
};