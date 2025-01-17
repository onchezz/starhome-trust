import { useContract, useSendTransaction, useAccount } from "@starknet-react/core";
import { Property } from "../types/property";
import { toast } from "sonner";
import abi from "../data/abi";

const CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function useStarhomesWrite() {
  const { address } = useAccount();
  
  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi
  });

  const { send: sendTransaction, isPending } = useSendTransaction();

  const listPropertyForSale = async (property: Property, tokenAddress: string) => {
    if (!contract || !address) {
      console.error("Contract or address not available");
      return;
    }

    try {
      await sendTransaction({
        calls: [{
          contractAddress: CONTRACT_ADDRESS,
          entrypoint: "list_property_for_sale",
          calldata: [property, tokenAddress]
        }]
      });
      toast.success("Property listed successfully");
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to list property");
      throw error;
    }
  };

  const listPropertyForInvestment = async (
    price: bigint,
    totalShares: bigint,
    paymentToken: string
  ) => {
    if (!contract || !address) {
      console.error("Contract or address not available");
      return;
    }

    try {
      await sendTransaction({
        calls: [{
          contractAddress: CONTRACT_ADDRESS,
          entrypoint: "list_property_for_investment",
          calldata: [price, totalShares, paymentToken]
        }]
      });
      toast.success("Investment property listed successfully");
    } catch (error) {
      console.error("Error listing investment property:", error);
      toast.error("Failed to list investment property");
      throw error;
    }
  };

  const investInProperty = async (propertyId: string, amount: bigint) => {
    if (!contract || !address) {
      console.error("Contract or address not available");
      return;
    }

    try {
      await sendTransaction({
        calls: [{
          contractAddress: CONTRACT_ADDRESS,
          entrypoint: "invest_in_property",
          calldata: [propertyId, amount]
        }]
      });
      toast.success("Investment successful");
    } catch (error) {
      console.error("Error investing in property:", error);
      toast.error("Failed to invest in property");
      throw error;
    }
  };

  const registerInvestor = async (investor: Investor) => {
    if (!contract || !address) {
      console.error("Contract or address not available");
      return;
    }

    try {
      await sendTransaction({
        calls: [{
          contractAddress: CONTRACT_ADDRESS,
          entrypoint: "register_investor",
          calldata: [investor]
        }]
      });
      toast.success("Investor registered successfully");
    } catch (error) {
      console.error("Error registering investor:", error);
      toast.error("Failed to register investor");
      throw error;
    }
  };

  return {
    listPropertyForSale,
    listPropertyForInvestment,
    investInProperty,
    registerInvestor,
    isPending
  };
}