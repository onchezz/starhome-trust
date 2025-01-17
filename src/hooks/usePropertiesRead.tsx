import { useReadContract } from "@starknet-react/core";
import abi from "../data/abi";

const CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function usePropertiesRead() {
  const { data: properties, isPending: isLoading } = useReadContract({
    functionName: "get_properties",
    args: [],
    address: CONTRACT_ADDRESS,
    abi,
    watch: true
  });

  console.log("Properties from contract:", properties);

  return {
    properties,
    isLoading
  };
}