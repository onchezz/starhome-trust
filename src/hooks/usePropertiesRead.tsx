import { useReadContract } from "@starknet-react/core";
import abi from "../data/abi";
import { decodePropertyFromContract } from "../utils/contractDataDecoder";

const CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function usePropertiesRead() {
  const { data: rawProperties, isPending: isLoading } = useReadContract({
    functionName: "get_properties",
    args: [],
    address: CONTRACT_ADDRESS,
    abi,
    watch: true
  });

  const properties = rawProperties?.map(property => decodePropertyFromContract(property)) || [];

  console.log("Decoded properties:", properties);

  return {
    properties,
    isLoading
  };
}