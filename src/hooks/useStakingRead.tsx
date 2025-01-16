import { useReadContract, useAccount } from "@starknet-react/core";
import { STAKING_CONTRACT_ADDRESS } from "./useStakingContract";
import abi from "../data/abi";

export function useStakingRead() {
  const { address } = useAccount();

  const { data: rewards, isPending: isLoadingRewards } = useReadContract({
    functionName: "get_rewards",
    args: address ? [address] : undefined,
    address: STAKING_CONTRACT_ADDRESS,
    abi,
    watch: true,
    enabled: !!address
  });

  console.log("Reading rewards for address:", address);
  console.log("Current rewards:", rewards);

  return {
    rewards,
    isLoadingRewards
  };
}