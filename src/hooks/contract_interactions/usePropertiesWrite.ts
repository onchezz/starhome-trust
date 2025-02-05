import { useStarHomeWriteContract } from "../contract_hooks/useStarHomeWriteContract";
import { Property } from "@/types/property";
import { InvestmentAsset } from "@/types/investment";
import { PropertyConverter } from "@/types/property";

export const usePropertyCreate = () => {
  const { execute, status: contractStatus } = useStarHomeWriteContract();

  const handleListSaleProperty = async (property: Partial<Property>) => {
    try {
      const response = await execute("list_property", [
        PropertyConverter.fromStarknetProperty(property)
      ]);
      return { status: response.status };
    } catch (error) {
      console.error("Error listing property:", error);
      throw error;
    }
  };

  const handleEditProperty = async (propertyId: string, property: Partial<Property>) => {
    try {
      const response = await execute("edit_property", [
        propertyId,
        PropertyConverter.fromStarknetProperty(property)
      ]);
      return { status: response.status };
    } catch (error) {
      console.error("Error editing property:", error);
      throw error;
    }
  };

  const handleListInvestmentProperty = async (investment: Partial<InvestmentAsset>) => {
    try {
      const response = await execute("list_investment_property", [investment]);
      return { status: response.status };
    } catch (error) {
      console.error("Error listing investment property:", error);
      throw error;
    }
  };

  const handleEditInvestmentProperty = async (investmentId: string, investment: Partial<InvestmentAsset>) => {
    try {
      const response = await execute("edit_listed_investment_property", [
        investmentId,
        investment
      ]);
      return { status: response.status };
    } catch (error) {
      console.error("Error editing investment property:", error);
      throw error;
    }
  };

  return {
    handleListSaleProperty,
    handleEditProperty,
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    contractStatus
  };
};