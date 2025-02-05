import { useStarHomeWriteContract } from "../contract_hooks/useStarHomeWriteContract";
import { Property } from "@/types/property";
import { InvestmentAsset } from "@/types/investment";
import { PropertyConverter } from "@/types/property";

export const usePropertyCreate = () => {
  const { writeContract, contractStatus } = useStarHomeWriteContract();

  const handleListSaleProperty = async (property: Partial<Property>) => {
    const starknetProperty = PropertyConverter.toStarknetProperty(property);
    await writeContract("list_property", [starknetProperty]);
    return { status: "success" };
  };

  const handleEditProperty = async (propertyId: string, property: Partial<Property>) => {
    const starknetProperty = PropertyConverter.toStarknetProperty(property);
    await writeContract("edit_property", [propertyId, starknetProperty]);
    return { status: "success" };
  };

  const handleListInvestmentProperty = async (investment: Partial<InvestmentAsset>) => {
    await writeContract("list_investment_property", [investment]);
    return { status: "success" };
  };

  const handleEditInvestmentProperty = async (investmentId: string, investment: Partial<InvestmentAsset>) => {
    await writeContract("edit_listed_investment_property", [investmentId, investment]);
    return { status: "success" };
  };

  return {
    handleListSaleProperty,
    handleEditProperty,
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    contractStatus,
  };
};