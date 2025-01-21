// import { useBalance, useAccount } from "@starknet-react/core";
import { useState } from "react";
import {
  useReadContract,
  useBalance,
  useSendTransaction,
  useContract,
  useAccount,
} from "@starknet-react/core";
import {
  starhomesContract,
  universalEthAddress,
  universalStrkAddress,
  usdTTokenAddress,
} from "@/lib/constants";
import { universalErc20Abi } from "@/data/universalTokenabi";

export const tokenAddresses = {
  USDT: usdTTokenAddress,
  STRK: universalStrkAddress,
  ETH: universalEthAddress,
} as const;

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

export function useReadTokenAllowance(amount: bigint) {
  const { address } = useAccount();

  // Approve tokens
  const { contract } = useContract({
    abi: universalErc20Abi,
    address: tokenAddresses.STRK,
  });
  const { send: readTokenAllowance, error: readTokenAllowanceError } =
    useSendTransaction({
      calls:
        contract && address
          ? [contract.populate("allowance", [starhomesContract, address])]
          : undefined, // Default to 0, will be overridden
    });

  return {
    readTokenAllowance,
    readTokenAllowanceError,
  };
}

export function useIncreaseTokenAllowance(amount: bigint) {
  const { address } = useAccount();

  // Approve tokens
  const { contract } = useContract({
    abi: universalErc20Abi,
    address: tokenAddresses.STRK,
  });
  const { send: increaseTokenAllowance, error: increaseTokenAllowanceError } =
    useSendTransaction({
      calls:
        contract && address
          ? [
              contract.populate("increase_allowance", [
                starhomesContract,
                amount,
              ]),
            ]
          : undefined, // Default to 0, will be overridden
    });

  return {
    increaseTokenAllowance,
    increaseTokenAllowanceError,
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
