import { transformToStarknetProperty } from '@/types/starknet_types/propertyStartknetTypes';
import { useStarHomeWriteContract } from './contract_hooks/useStarHomeWriteContract';
import { Property } from '@/types/property';
import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { shortString } from 'starknet';



export const usePropertyWrite = () => {
  const {address} = useAccount();
  const { sendData: listPropertyAsync, isPending } = useStarHomeWriteContract({
    functionName: "list_property",
  });

  const handleListProperty = async (property: Property) => {
    try {
      console.log("Listing property:", property);
      function getAddressLine(fullAddress) {
  // Split the address by commas and trim whitespace
  const parts = fullAddress.split(',').map(part => part.trim());

  // The first part is usually the address line
  const addressLine = parts[0].toString;
console.log("address:", addressLine);
  return addressLine;
}

   const  writePropery = transformToStarknetProperty(property)        
      console.log("Listing property:", writePropery);

      const tx = await listPropertyAsync({
        args: [writePropery],
      });

      console.log("Property listed successfully:", tx);
      toast.success("Property listed successfully!");
      return tx;
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property" ,error);
      throw error;
    }
  };

  return {
    handleListProperty,
    isPending,
  };
};