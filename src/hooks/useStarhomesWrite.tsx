import { useContract } from "@starknet-react/core";
import { toast } from "sonner";
import { Property } from "../types/property";
import abi from "../data/abi";
import { Call, hash } from "starknet";

const CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function useStarhomesWrite() {
  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi
  });

  const listPropertyForSale = async (property: Property, tokenAddress: string) => {
    if (!contract) {
      console.error("Contract not available");
      return;
    }

    try {
      console.log("Listing property for sale:", { property, tokenAddress });
      
      const calls: Call[] = [{
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "list_property_for_sale",
        calldata: [property, tokenAddress]
      }];

      await contract.invoke("list_property_for_sale", [property, tokenAddress]);
      toast.success("Property listed successfully");
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
      throw error;
    }
  };

  return {
    listPropertyForSale,
  };
}