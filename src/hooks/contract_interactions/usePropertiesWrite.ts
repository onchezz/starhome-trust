import { useStarHomeWriteContract } from "../contract_hooks/useStarHomeWriteContract";
import { Property } from "@/types/property";
import { InvestmentAsset } from "@/types/investment";
import { PropertyConverter } from "@/types/property";

export const usePropertyCreate = () => {
  const { execute, status } = useStarHomeWriteContract();

  const handleListSaleProperty = async (property: Partial<Property>) => {
    const starknetProperty = PropertyConverter.convertToStarknetProperty(property);
    await execute("list_property", [starknetProperty]);
    return { status: "success" };
  };

  const handleEditProperty = async (propertyId: string, property: Partial<Property>) => {
    const starknetProperty = PropertyConverter.convertToStarknetProperty(property);
    await execute("edit_property", [propertyId, starknetProperty]);
    return { status: "success" };
  };

  const handleListInvestmentProperty = async (investment: Partial<InvestmentAsset>) => {
    await execute("list_investment_property", [investment]);
    return { status: "success" };
  };

  const handleEditInvestmentProperty = async (investmentId: string, investment: Partial<InvestmentAsset>) => {
    await execute("edit_listed_investment_property", [investmentId, investment]);
    return { status: "success" };
  };

  return {
    handleListSaleProperty,
    handleEditProperty,
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    status,
  };
};