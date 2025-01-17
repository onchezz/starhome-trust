import { useContract, useSendTransaction, useAccount } from "@starknet-react/core";
import { toast } from "sonner";

export const CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function useTokenInteractions(tokenAddress: `0x${string}`) {
  const { address } = useAccount();

  const { contract: tokenContract } = useContract({
    abi: [
      {
        name: "approve",
        type: "function",
        inputs: [
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [{ type: "core::bool" }],
        state_mutability: "external",
      },
      {
        name: "allowance",
        type: "function",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [{ type: "core::integer::u256" }],
        state_mutability: "view",
      }
    ] as const,
    address: tokenAddress
  });

  const { send: sendApprove } = useSendTransaction();

  const approveSpending = async (amount: bigint) => {
    if (!tokenContract || !address) {
      console.error("Token contract or address not available");
      return;
    }

    try {
      await sendApprove({
        calls: [
          {
            contractAddress: tokenAddress,
            entrypoint: "approve",
            calldata: [CONTRACT_ADDRESS, amount.toString()]
          }
        ]
      });
      toast.success("Approval transaction sent");
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve token spending");
    }
  };

  return {
    approveSpending,
    tokenContract
  };
}