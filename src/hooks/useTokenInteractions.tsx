import { useContract, useSendTransaction, useAccount, useReadContract } from "@starknet-react/core";
import { toast } from "sonner";
import { BigNumberish } from "starknet";

export const tokenAddresses = {
  USDT: "0x02ab8758891e84b968ff11361789070c6b1af2df618d6d2f4a78b0757573c6eb",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
} as const;

const CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

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

  // Check allowance
  const { data: allowance } = useReadContract({
    abi: [
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
      },
    ] as const,
    functionName: "allowance",
    address: tokenAddress,
    args: [address || "0x0", CONTRACT_ADDRESS],
    watch: true,
    enabled: !!address
  });

  const { send: sendTransaction } = useSendTransaction();

  const approveSpending = async (amount: BigNumberish) => {
    if (!tokenContract || !address) {
      console.error("Token contract or address not available");
      return;
    }

    try {
      await sendTransaction({
        calls: [{
          contractAddress: tokenAddress,
          entrypoint: "approve",
          calldata: [CONTRACT_ADDRESS, amount]
        }]
      });
      toast.success("Approval transaction sent");
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve token spending");
    }
  };

  return {
    approveSpending,
    allowance,
    tokenContract
  };
}