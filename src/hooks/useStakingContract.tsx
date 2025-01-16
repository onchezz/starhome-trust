import { useContract, useSendTransaction } from "@starknet-react/core";
import { Contract } from "starknet";
import type { Abi } from "starknet";

// Contract address for the staking contract
export const STAKING_CONTRACT_ADDRESS = "0x06711323c3dae0c666a108be21ded892463c1abe08ed77157ff19fb343de7800";

const abi = [
  {
    type: "function",
    name: "stake",
    state_mutability: "external",
    inputs: [
      {
        name: "amount",
        type: "core::integer::u256"
      }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "withdraw",
    state_mutability: "external",
    inputs: [
      {
        name: "amount",
        type: "core::integer::u256"
      }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "get_rewards",
    state_mutability: "view",
    inputs: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress"
      }
    ],
    outputs: [
      {
        type: "core::integer::u256"
      }
    ]
  },
  {
    type: "function",
    name: "claim_rewards",
    state_mutability: "external",
    inputs: [],
    outputs: []
  }
] as const satisfies Abi;

export function useStakingContract() {
  const { contract } = useContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi
  });

  const { send: stake, isPending: isStakePending } = useSendTransaction({
    calls: contract ? [] : undefined
  });

  const handleStake = async (amount: bigint) => {
    console.log("Staking amount:", amount);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await stake([
        contract.populate("stake", [amount])
      ]);
      console.log("Stake transaction sent successfully");
    } catch (error) {
      console.error("Staking error:", error);
      throw error;
    }
  };

  return {
    contract,
    handleStake,
    isStakePending
  };
}