import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { BigNumberish } from 'starknet';
import { Property, StarknetProperty } from '@/types/property';
import { dummyInvestmentProperties, InvestmentAsset } from '@/types/investment';


export const usePropertyCreate = () => {
  const { address } = useAccount();
  const { contract, execute, status: contractStatus } = useStarHomeWriteContract();

  const handleListSaleProperty = async (property: Partial<Property>) => {
    console.log("Listing property before listing from form:", property);
    
   
  //  const agent_id:BigNumberish =property.agentId;
  //  const asset_token:BigNumberish =property.assetToken;

    try {
      const defaultProperty: StarknetProperty = {
        id: property.id || "",
        title: property.title || "",
        description: property.description || "",
        location_address: property.locationAddress.split(",")[0] || "",
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
        agent_id:address|| "", //agent_id|| address ||
        date_listed:Math.floor(Date.now() / 1000),
        has_garden: property.hasGarden || false,
        has_swimming_pool: property.hasSwimmingPool || false,
        pet_friendly: property.petFriendly || false,
        wheelchair_accessible: property.wheelchairAccessible || false,
        asset_token:property.assetToken|| ""//asset_token
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
    console.log("Listing investment property:", investment);

    try {
      const defaultInvestment: InvestmentAsset = {
        id: investment.id || "0",
        name: investment.name || "",
        description: investment.description || "",
        isActive: investment.isActive || false,
        location: investment.location || "",
        size: investment.size || "0",
        investorId: investment.investorId || "0",
        owner: address || "",
        constructionStatus:investment.constructionStatus,
        assetValue: investment.assetValue || "0",
        availableStakingAmount: investment.availableStakingAmount || "0",
        investmentType: investment.investmentType || "0",
        constructionYear: investment.constructionYear || 0,
        propertyPrice: investment.propertyPrice || "0",
        expectedRoi: investment.expectedRoi || "0",
        rentalIncome: investment.rentalIncome || "0",
        maintenanceCosts: investment.maintenanceCosts || "0",
        taxBenefits: investment.taxBenefits || "0",
        highlights: investment.highlights || "",
        marketAnalysis: {
          areaGrowth: investment.marketAnalysis?.areaGrowth || "0",
          occupancyRate: investment.marketAnalysis?.occupancyRate || "0",
          comparableProperties: investment.marketAnalysis?.comparableProperties || "0",
          demandTrend: investment.marketAnalysis?.demandTrend || "0",
         
        },
        riskFactors: investment.riskFactors || "",
        legalDetails: {
          ownership: investment.legalDetails?.ownership || "0",
          zoning: investment.legalDetails?.zoning || "0",
          permits: investment.legalDetails?.permits || "0",
          documentsId: investment.legalDetails?.documentsId || "0",
        },
        additionalFeatures: investment.additionalFeatures || "",
        images: investment.images || "",
        investmentToken: investment.investmentToken || "",
        minInvestmentAmount: investment.minInvestmentAmount || "0"
      };

      console.log("Listing investment property after conversion:", dummyInvestmentProperties[0]);

      const tx = await execute("list_investment_property", [dummyInvestmentProperties[0]]);
      
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
