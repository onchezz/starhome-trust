import { useContract, useSendTransaction } from "@starknet-react/core";
import { toast } from "sonner";

const ERC20_ABI = [
  {
    members: [
      {
        name: "low",
        offset: 0,
        type: "felt"
      },
      {
        name: "high",
        offset: 1,
        type: "felt"
      }
    ],
    name: "Uint256",
    size: 2,
    type: "struct"
  },
  {
    inputs: [
      {
        name: "spender",
        type: "felt"
      },
      {
        name: "amount",
        type: "Uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        name: "success",
        type: "felt"
      }
    ],
    type: "function"
  }
];

export function useTokenInteractions(tokenAddress: string) {
  const { contract } = useContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI
  });

  const { sendTransaction } = useSendTransaction();

  const approveToken = async (spender: string, amount: string) => {
    if (!contract) {
      console.error("Contract not available");
      return;
    }

    try {
      console.log("Approving token:", { spender, amount });
      
      const calls = contract.populateTransaction("approve", [
        spender,
        amount
      ]);

      await sendTransaction({ calls });
      toast.success("Token approved successfully");
    } catch (error) {
      console.error("Error approving token:", error);
      toast.error("Failed to approve token");
      throw error;
    }
  };

  return {
    approveToken
  };
}