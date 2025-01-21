import { useScaffoldWriteContract } from '../contract_hooks/useStarHomesWriteContract';
import { toast } from 'sonner';

export const useStarhomesWrite = () => {
  const { sendAsync: listPropertyAsync, isPending } = useScaffoldWriteContract({
    contractName: "StarhomesContract",
    functionName: "list_property",
  });

  const listPropertyForSale = async (property: any) => {
    try {
      console.log("Listing property:", property);
      await listPropertyAsync({ args: [property] });
      toast.success("Property listed successfully!");
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
      throw error;
    }
  };

  return {
    listPropertyForSale,
    isPending
  };
};