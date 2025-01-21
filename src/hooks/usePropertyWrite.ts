import { useStarHomeWriteContract } from './contract_hooks/useStarHomeWriteContract';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { shortString } from 'starknet';

export const usePropertyWrite = () => {
  const { sendAsync: listPropertyAsync, isPending } = useStarHomeWriteContract({
    functionName: "list_property_for_sale",
  });

  const handleListProperty = async (property: Property) => {
    try {
      console.log("Listing property:", property);
      
      // Convert strings to felt252 (short string)
      const serializedProperty = {
        ...property,
        id: shortString.encodeShortString(property.id),
        title: shortString.encodeShortString(property.title),
        description: property.description, // ByteArray handled by contract
        location_address: shortString.encodeShortString(property.location_address),
        city: shortString.encodeShortString(property.city),
        state: shortString.encodeShortString(property.state),
        country: shortString.encodeShortString(property.country),
        latitude: shortString.encodeShortString(property.latitude.toString()),
        longitude: shortString.encodeShortString(property.longitude.toString()),
        currency: shortString.encodeShortString(property.currency),
        property_type: shortString.encodeShortString(property.property_type),
        status: shortString.encodeShortString(property.status),
        features_id: shortString.encodeShortString(property.features_id),
        images_id: shortString.encodeShortString(property.images_id),
        video_tour: shortString.encodeShortString(property.video_tour),
      };

      const tx = await listPropertyAsync({
        args: [serializedProperty],
      });

      console.log("Property listed successfully:", tx);
      toast.success("Property listed successfully!");
      return tx;
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
      throw error;
    }
  };

  return {
    handleListProperty,
    isPending,
  };
};