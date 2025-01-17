import { useContract, useSendTransaction, useAccount } from "@starknet-react/core";
import { toast } from "sonner";
import { BigNumberish, Call } from "starknet";

export const CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function useTokenInteractions(tokenAddress: string) {
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
    ] as const,
    address: tokenAddress as `0x${string}`
  });

  const { send: sendApprove } = useSendTransaction();

  const approveSpending = async (amount: BigNumberish) => {
    if (!tokenContract || !address) {
      console.error("Token contract or address not available");
      return;
    }

    try {
      const calls: Call[] = [{
        contractAddress: tokenAddress,
        entrypoint: "approve",
        calldata: [CONTRACT_ADDRESS, amount]
      }];

      await sendApprove({ calls });
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