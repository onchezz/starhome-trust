
import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { Property, StarknetProperty } from '@/types/property';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { dummyInvestment } from '@/types/starknet_types/investment_daummy';

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

  const handleListInvestmentProperty = async (investment:InvestmentAsset) => {
    console.log("Listing investment property before conversion:", investment);

    try {
    
      const investmentProp =  InvestmentAssetConverter.toStarknetProperty(investment)

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