import { StarknetProperty, transformToStarknetProperty, validatePropertyData } from '@/types/starknet_types/propertyStartknetTypes';
import { useStarHomeWriteContract } from './contract_hooks/useStarHomeWriteContract';
import { Property } from '@/types/property';
import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { shortString } from 'starknet';



export const usePropertyWrite = () => {
  const {address} = useAccount();
  const { sendAsync: listPropertyAsync, isPending } = useStarHomeWriteContract({
    functionName: "list_property",
  });

  const handleListProperty = async (property: StarknetProperty) => {
    try {
      console.log("Listing property:", property);
    

  //  const  writeProperty = transformToStarknetProperty(property) ;
  //  const validate_data = validatePropertyData(writeProperty)       
      console.log("Listing property:", property);

      const tx = await listPropertyAsync({
        args: [property],
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