import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { Property, StarknetProperty } from '@/types/property';
import { InvestmentAsset } from '@/types/investment';

export const usePropertyCreate = () => {
  const { address } = useAccount();
  const { contract, execute, status: contractStatus } = useStarHomeWriteContract();

  const handleListSaleProperty = async (property: Partial<Property>) => {
    console.log("Listing property before listing from form:", property);
    
    try {
      const defaultProperty: StarknetProperty = {
        id: property.id || "",
        title: property.title || "",
        description: property.description || "",
        location_address: property.locationAddress?.split(",")[0] || "",
        city: property.city || "",
        state: property.state || "",
        country: property.country || "",
        latitude: property.latitude || "",
        longitude: property.longitude || "",
        price: property.price || 0,
        asking_price: property.asking_price || 0,
        currency: property.currency || "USD",
        area: property.area || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        parking_spaces: property.parkingSpaces || 0,
        property_type: property.propertyType || "",
        status: property.status || "",
        interested_clients: property.interestedClients || 0,
        annual_growth_rate: property.annualGrowthRate || 0,
        features_id: "00",
        images_id: property.imagesId || "",
        video_tour: property.videoId || "none",
        agent_id: address || "",
        date_listed: Math.floor(Date.now() / 1000),
        has_garden: property.hasGarden || false,
        has_swimming_pool: property.hasSwimmingPool || false,
        pet_friendly: property.petFriendly || false,
        wheelchair_accessible: property.wheelchairAccessible || false,
        asset_token: property.assetToken || ""
      };

      console.log("Listing property after conversion:", defaultProperty);

      const tx = await execute("list_property", [defaultProperty]);
      
      toast.success(`Property listed successfully! ${tx.response.transaction_hash}`);
      return {
        status: 'success' as const
      };
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
      throw error;
    }
  };

  const handleListInvestmentProperty = async (investment: Partial<InvestmentAsset>) => {
    console.log("Listing investment property before conversion:", investment);

    try {
      // Convert boolean to 0/1 for Cairo contract
      const isActive = investment.isActive ? 1 : 0;
      
      // Helper function to safely convert values to strings
      const toSafeString = (value: any): string => {
        if (value === undefined || value === null) return "";
        if (typeof value === 'object') return JSON.stringify(value);
        return value.toString();
      };

      const defaultInvestment = {
        id: toSafeString(investment.id),
        name: toSafeString(investment.name),
        description: toSafeString(investment.description),
        is_active: isActive,
        location: toSafeString(investment.location),
        size: toSafeString(investment.size),
        investor_id: toSafeString(investment.investorId),
        owner: address || "",
        construction_status: toSafeString(investment.constructionStatus),
        asset_value: toSafeString(investment.assetValue || 0),
        available_staking_amount: toSafeString(investment.availableStakingAmount || 0),
        investment_type: toSafeString(investment.investmentType),
        construction_year: Number(investment.constructionYear || 0),
        property_price: toSafeString(investment.propertyPrice || 0),
        expected_roi: toSafeString(investment.expectedRoi),
        rental_income: toSafeString(investment.rentalIncome || 0),
        maintenance_costs: toSafeString(investment.maintenanceCosts || 0),
        tax_benefits: toSafeString(investment.taxBenefits),
        highlights: toSafeString(investment.highlights),
        market_analysis: toSafeString(investment.marketAnalysis),
        risk_factors: toSafeString(investment.riskFactors),
        legal_detailId: toSafeString(investment.legalDetailsId),
        additional_features: toSafeString(investment.additionalFeatures),
        images: toSafeString(investment.images),
        investment_token: toSafeString(investment.investmentToken),
        min_investment_amount: toSafeString(investment.minInvestmentAmount || 0)
      };

      console.log("Listing investment property after conversion:", defaultInvestment);

      const tx = await execute("list_investment_property", [defaultInvestment]);
      
      toast.success(`Investment property listed successfully! ${tx.response.transaction_hash}`);
      return {
        status: 'success' as const
      };
    } catch (error) {
      console.error("Error listing investment property:", error);
      toast.error("Failed to list investment property");
      throw error;
    }
  };

  return {
    handleListSaleProperty,
    handleListInvestmentProperty,
    contractStatus
  };
};