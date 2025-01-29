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
      const errorMessage = error instanceof Error ? error.message : "Failed to list property";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleListInvestmentProperty = async (investment: Partial<InvestmentAsset>) => {
    console.log("Listing investment property before conversion:", investment);

    try {
      // Convert boolean to 0/1 for Cairo contract
      const isActive = investment.isActive ? 1 : 0;
      
      // Helper function to safely convert values to BigInt strings
      const toBigIntString = (value: any): string => {
        if (value === undefined || value === null || value === '') return '0';
        // Remove any non-numeric characters except decimal point
        const cleanValue = value.toString().replace(/[^\d.]/g, '');
        // Convert to BigInt by removing decimal places
        const [whole = '0', decimal = ''] = cleanValue.split('.');
        return whole + decimal.padEnd(18, '0'); // Add 18 decimal places
      };

      const defaultInvestment = {
        id: investment.id || '0',
        name: investment.name || '',
        description: investment.description || '',
        is_active: isActive,
        location: investment.location || '',
        size: investment.size || '',
        investor_id: investment.investorId || '0',
        owner: address || '',
        construction_status: investment.constructionStatus || '',
        asset_value: toBigIntString(investment.assetValue),
        available_staking_amount: toBigIntString(investment.availableStakingAmount),
        investment_type: investment.investmentType || '',
        construction_year: Number(investment.constructionYear || 0),
        property_price: toBigIntString(investment.propertyPrice),
        expected_roi: investment.expectedRoi || '0',
        rental_income: toBigIntString(investment.rentalIncome),
        maintenance_costs: toBigIntString(investment.maintenanceCosts),
        tax_benefits: investment.taxBenefits || '0',
        highlights: investment.highlights || '',
        market_analysis: investment.marketAnalysis || '',
        risk_factors: investment.riskFactors || '',
        legal_detailId: investment.legalDetailsId || '',
        additional_features: investment.additionalFeatures || '',
        images: investment.images || '',
        investment_token: investment.investmentToken || '',
        min_investment_amount: toBigIntString(investment.minInvestmentAmount)
      };

      console.log("Listing investment property after conversion:", defaultInvestment);

      const tx = await execute("list_investment_property", [defaultInvestment]);
      
      toast.success(`Investment property listed successfully! ${tx.response.transaction_hash}`);
      return {
        status: 'success' as const,
        data: tx
      };
    } catch (error) {
      console.error("Error listing investment property:", error);
      let errorMessage = "Failed to list investment property";
      
      // Extract error message from Starknet error if available
      if (error instanceof Error) {
        if (error.message.includes("Error in the called contract")) {
          // Extract contract error message
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
    contractStatus
  };
};