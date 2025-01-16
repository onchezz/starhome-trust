import { useBalance, useAccount } from "@starknet-react/core";

export const tokenAddresses = {
  USDT: "0x02ab8758891e84b968ff11361789070c6b1af2df618d6d2f4a78b0757573c6eb",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
} as const;

export type TokenSymbol = keyof typeof tokenAddresses;

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