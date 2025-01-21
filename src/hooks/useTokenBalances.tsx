// import { useBalance, useAccount } from "@starknet-react/core";
import { useState } from "react";
import {
  useReadContract,
  useBalance,
  useSendTransaction,
  useContract,
  useAccount,
} from "@starknet-react/core";
import { starhomesContract, universalErc20Abi, universalEthAddress, universalStrkAddress, usdTTokenAddress } from "@/lib/constants";
// xport const STAKING_CONTRACT_ADDRESS = "0x06711323c3dae0c666a108be21ded892463c1abe08ed77157ff19fb343de7800";
export const tokenAddresses = {
  USDT: usdTTokenAddress,
  STRK: universalStrkAddress,
  ETH: universalEthAddress,
} as const;
// starhomesContract,
//   usdcTokenAddress,
//   usdTTokenAddress,
//   devnetEthClassHash,
//   devnetStrkClassHash,
//   universalEthAddress,
//   sepoliaMainnetEthClassHash,
//   universalStrkAddress,
//   sepoliaMainnetStrkClassHash,
//   universalErc20Abi,
export type TokenSymbol = keyof typeof tokenAddresses;

export function useTokenApprove(amount: bigint) {
  const { address } = useAccount();

  // Approve tokens
  const { contract } = useContract({
    abi: universalErc20Abi,
    
    address: tokenAddresses.STRK,
  });
  const { send: approveToken, error: approveError } = useSendTransaction({
    calls:
      contract && address
        ? [contract.populate("approve", [starhomesContract, amount])]
        : undefined, // Default to 0, will be overridden
  });
  // console.log("USDT Balance:", usdtBalance?.formatted);
  // console.log("STRK Balance:", strkBalance?.formatted);
  // console.log("ETH Balance:", ethBalance?.formatted);

  return {
    approveToken,
    approveError,
  };
}
export function useTokenBalances() {
  const { address } = useAccount();

  const { data: usdtBalance, isLoading: isLoadingUsdt } = useBalance({
    address,
    token: tokenAddresses.USDT,
    watch: true,
    enabled: !!address,
  });

  const { data: strkBalance, isLoading: isLoadingStrk } = useBalance({
    address,
    token: tokenAddresses.STRK,
    watch: true,
    enabled: !!address,
  });

  const { data: ethBalance, isLoading: isLoadingEth } = useBalance({
    address,
    token: tokenAddresses.ETH,
    watch: true,
    enabled: !!address,
  });
 
  console.log("USDT Balance:", usdtBalance?.formatted);
  console.log("STRK Balance:", strkBalance?.formatted);
  console.log("ETH Balance:", ethBalance?.formatted);

  return {
   
    balances: {
      USDT: usdtBalance,
      STRK: strkBalance,
      ETH: ethBalance,
    },

    isLoading: isLoadingUsdt || isLoadingStrk || isLoadingEth,
  };
}

