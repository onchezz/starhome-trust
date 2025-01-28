import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
// import { StarknetProperty } from '@/types/starknet_types/propertyStartknet';
import { BigNumberish } from 'starknet';
import { Property } from '@/types/property';

export const usePropertyRegistration = () => {
  const { address } = useAccount();
  const { contract, execute, status: contractStatus } = useStarHomeWriteContract();

  const handleListProperty = async (property: Partial<Property>) => {
    console.log("Listing property before listing from form:", property);
    
    const agent_id: BigNumberish = property.agentId;
    const asset_token: BigNumberish = property.assetToken;
    const location_address = typeof property.locationAddress === 'string' 
      ? property.locationAddress.split(',')[0] 
      :  "";

    try {
      const defaultProperty: Property = {
        id: property.id || "",
        title: property.title || "",
        description: property.description || "",
        locationAddress: location_address,
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
        parkingSpaces: property.parkingSpaces || 0,
        propertyType: property.propertyType || "",
        status: property.status || "",
        interestedClients: property.interestedClients || 0,
        annualGrowthRate: property.annualGrowthRate || 0,
        featuresId: "00",
        imagesId: property.imagesId || "",
        videoId: property.videoId || "none",
        agentId: agent_id || "",
        dateListed: Math.floor(Date.now() / 1000),
        hasGarden: property.hasGarden || false,
        hasSwimmingPool: property.hasSwimmingPool || false,
        petFriendly: property.petFriendly || false,
        wheelchairAccessible: property.wheelchairAccessible || false,
        assetToken: asset_token || ""
      };

      console.log("Listing property after conversion:", defaultProperty);

      const tx = await execute("list_property", [{ ...defaultProperty }]);
      
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

  return {
    handleListProperty,
    contractStatus
  };
};