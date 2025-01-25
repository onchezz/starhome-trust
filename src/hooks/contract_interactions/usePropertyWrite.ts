import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { StarknetProperty } from '@/types/starknet_types/propertyStartknet';



export const usePropertyRegistration = () => {
  const { address } = useAccount();
  const { contract, execute, status: contractStatus } = useStarHomeWriteContract();

  const handleListProperty = async (property: Partial<StarknetProperty>) => {
    console.log("Listing property before listing from form:", property);
    
   

    try {
      const defaultProperty: StarknetProperty = {
        id: property.id || "",
        title: property.title || "",
        description: property.description || "",
        location_address: property.location_address || "",
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
        features_id: "aeb51a3469dc44fb9ee62",
        images_id: property.images_id || "",
        video_tour: property.video_tour || "",
        agent_id:property.agent_id|| address || "",
        date_listed: Math.floor(Date.now() / 1000),
        has_garden: property.has_garden || false,
        has_swimming_pool: property.has_swimming_pool || false,
        pet_friendly: property.pet_friendly || false,
        wheelchair_accessible: property.wheelchair_accessible || false,
        asset_token: property.asset_token || ""
      };

      console.log("Listing property after conversion:", defaultProperty);

      const tx = await execute("list_property", [defaultProperty]);
      
      toast.success(`Property listed successfully! ${tx.response.transaction_hash}`,);
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
