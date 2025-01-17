import { useReadContract, useAccount } from "@starknet-react/core";
import abi from "../data/abi";
import { Property, Investor } from "../types/property";

const CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function useStarhomesRead() {
  const { address } = useAccount();

  // Get all properties
  const { data: properties, isPending: isLoadingProperties } = useReadContract({
    functionName: "get_properties",
    args: [],
    address: CONTRACT_ADDRESS,
    abi,
    watch: true
  });

  // Get single property
  const { data: property, isPending: isLoadingProperty } = useReadContract({
    functionName: "get_property",
    args: [address || "0x0"],
    address: CONTRACT_ADDRESS,
    abi,
    watch: true,
    enabled: !!address
  });

  // Get all investors
  const { data: investors, isPending: isLoadingInvestors } = useReadContract({
    functionName: "get_investors",
    args: [],
    address: CONTRACT_ADDRESS,
    abi,
    watch: true
  });

  // Get single investor
  const { data: investor, isPending: isLoadingInvestor } = useReadContract({
    functionName: "get_investor",
    args: [],
    address: CONTRACT_ADDRESS,
    abi,
    watch: true,
    enabled: !!address
  });

  // Get contract version
  const { data: version, isPending: isLoadingVersion } = useReadContract({
    functionName: "version",
    args: [],
    address: CONTRACT_ADDRESS,
    abi,
    watch: true
  });

  console.log("Properties:", properties);
  console.log("Single property:", property);
  console.log("Investors:", investors);
  console.log("Single investor:", investor);
  console.log("Contract version:", version);

  return {
    properties,
    property,
    investors,
    investor,
    version,
    isLoading: 
      isLoadingProperties || 
      isLoadingProperty || 
      isLoadingInvestors || 
      isLoadingInvestor || 
      isLoadingVersion
  };
}