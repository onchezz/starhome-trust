import { useContract, useReadContract, useSendTransaction, useAccount } from "@starknet-react/core";
import { BigNumberish } from "starknet";
import abi from "../data/abi";
import { toast } from "sonner";

export const STAKING_CONTRACT_ADDRESS = "0x018830450ae57c3cf9207bb7eba2e3b7c4451c22bd72612284a925a483641369";

export function useStakingContract() {
  const { contract } = useContract({
    address: STAKING_CONTRACT_ADDRESS,
    abi
  });

  const { address } = useAccount();

  const { data: properties, isPending: isLoadingProperties } = useReadContract({
    functionName: "get_properties",
    args: [],
    address: STAKING_CONTRACT_ADDRESS,
    abi,
    watch: true,
    enabled: !!address
  });

  const { send: sendStake, isPending: isStakePending } = useSendTransaction({
    calls: []
  });

  const { send: sendWithdraw, isPending: isWithdrawPending } = useSendTransaction({
    calls: []
  });

  const { send: sendClaimRewards, isPending: isClaimRewardsPending } = useSendTransaction({
    calls: []
  });

  const handleStake = async (propertyId: string, amount: BigNumberish) => {
    console.log("Staking amount:", amount, "for property:", propertyId);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendStake([{
        contractAddress: STAKING_CONTRACT_ADDRESS,
        entrypoint: "invest_in_property",
        calldata: [BigInt(propertyId), amount]
      }]);
      toast.success("Stake transaction sent successfully");
    } catch (error) {
      console.error("Staking error:", error);
      toast.error("Failed to stake tokens");
      throw error;
    }
  };

  const withdraw = async (propertyId: string, amount: BigNumberish, tokenAddress: string) => {
    console.log("Withdrawing amount:", amount);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendWithdraw([{
        contractAddress: STAKING_CONTRACT_ADDRESS,
        entrypoint: "list_property_for_investment",
        calldata: [BigInt(propertyId), amount, tokenAddress]
      }]);
      toast.success("Withdrawal transaction sent successfully");
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to withdraw tokens");
      throw error;
    }
  };

  const claimRewards = async (propertyId: string) => {
    console.log("Claiming rewards for property:", propertyId);
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }

    try {
      await sendClaimRewards([{
        contractAddress: STAKING_CONTRACT_ADDRESS,
        entrypoint: "get_property",
        calldata: [BigInt(propertyId)]
      }]);
      toast.success("Claim rewards transaction sent successfully");
    } catch (error) {
      console.error("Claim rewards error:", error);
      toast.error("Failed to claim rewards");
      throw error;
    }
  };

  return {
    contract,
    properties,
    isLoadingProperties,
    handleStake,
    withdraw,
    claimRewards,
    isStakePending,
    isWithdrawPending,
    isClaimRewardsPending,
    loading: isStakePending || isWithdrawPending || isClaimRewardsPending || isLoadingProperties
  };
}