import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { StarknetProperty } from '@/types/starknet_types/propertyStartknet';
import { BigNumberish } from 'starknet';

export const usePropertyRegistration = () => {
  const { address } = useAccount();
  const { contract, execute, status: contractStatus } = useStarHomeWriteContract();

  const handleListProperty = async (property: Partial<StarknetProperty>) => {
    console.log("Listing property before listing from form:", property);
    
    const agent_id: BigNumberish = property.agent_id;
    const asset_token: BigNumberish = property.asset_token;
    const location_address = typeof property.location_address === 'string' 
      ? property.location_address.split(',')[0] 
      : property.location_address?.toString() || "";

    try {
      const defaultProperty: StarknetProperty = {
        id: property.id || "",
        title: property.title || "",
        description: property.description || "",
        location_address: location_address,
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
        parking_spaces: property.parking_spaces || 0,
        property_type: property.property_type || "",
        status: property.status || "",
        interested_clients: property.interested_clients || 0,
        annual_growth_rate: property.annual_growth_rate || 0,
        features_id: "00",
        images_id: property.images_id || "",
        video_tour: property.video_tour || "none",
        agent_id: agent_id || "",
        date_listed: Math.floor(Date.now() / 1000),
        has_garden: property.has_garden || false,
        has_swimming_pool: property.has_swimming_pool || false,
        pet_friendly: property.pet_friendly || false,
        wheelchair_accessible: property.wheelchair_accessible || false,
        asset_token: asset_token || ""
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