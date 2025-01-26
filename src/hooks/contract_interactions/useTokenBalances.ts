// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useCallback, useEffect } from "react";
// import { useState } from "react";
// import {
//   useBalance,
//   useSendTransaction,
//   useContract,
//   useAccount,
// } from "@starknet-react/core";
// import {
//   starhomesContract,
//   universalEthAddress,
//   universalStrkAddress,
//   usdTTokenAddress,
// } from "@/utils/constants";
// import { universalErc20Abi } from "@/data/universalTokenabi";
// import { PrismaClient } from '@prisma/client';
// export const tokenAddresses = {
//   USDT: usdTTokenAddress,
//   STRK: universalStrkAddress,
//   ETH: universalEthAddress,
// } as const;


// export function useTokenBalances() {
//   const { address } = useAccount();
//   const [cachedBalances, setCachedBalances] = useState({
//     USDT: null,
//     STRK: null,
//     ETH: null
//   });
//   const [lastFetchTime, setLastFetchTime] = useState(0);
//   const CACHE_DURATION = 30000;
//   const CACHE_KEY = `token_balances_${address}`;

//   const shouldRefetch = useCallback(() => {
//     return Date.now() - lastFetchTime > CACHE_DURATION;
//   }, [lastFetchTime]);

//   const { 
//     data: usdtBalance, 
//     isLoading: isLoadingUsdt,
//     refetch: refetchUsdt
//   } = useBalance({
//     address,
//     token: tokenAddresses.USDT,
//     watch: false,
//     enabled: !!address && shouldRefetch(),
//     refetchInterval: CACHE_DURATION
//   });

//   const { 
//     data: strkBalance, 
//     isLoading: isLoadingStrk,
//     refetch: refetchStrk
//   } = useBalance({
//     address,
//     token: tokenAddresses.STRK,
//     watch: false,
//     enabled: !!address && shouldRefetch(),
//     refetchInterval: CACHE_DURATION
//   });

//   const { 
//     data: ethBalance, 
//     isLoading: isLoadingEth,
//     refetch: refetchEth
//   } = useBalance({
//     address,
//     token: tokenAddresses.ETH,
//     watch: false,
//     enabled: !!address && shouldRefetch(),
//     refetchInterval: CACHE_DURATION
//   });

//   const loadFromCache = useCallback(() => {
//     const cached = localStorage.getItem(CACHE_KEY);
//     if (cached) {
//       const { balances, timestamp } = JSON.parse(cached);
//       setCachedBalances(balances);
//       setLastFetchTime(timestamp);
//     }
//   }, [CACHE_KEY]);

//   const saveToCache = useCallback((balances: any) => {
//     const cacheData = {
//       balances,
//       timestamp: Date.now()
//     };
//     localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
//   }, [CACHE_KEY]);

//   const fetchAndCacheBalances = async () => {
//     await Promise.all([refetchUsdt(), refetchStrk(), refetchEth()]);
//   };

//   useEffect(() => {
//     if (address) {
//       loadFromCache();
//     }
//   }, [address, loadFromCache]);

//   useEffect(() => {
//     if (usdtBalance || strkBalance || ethBalance) {
//       const newBalances = {
//         USDT: usdtBalance?.formatted || cachedBalances.USDT,
//         STRK: strkBalance?.formatted || cachedBalances.STRK,
//         ETH: ethBalance?.formatted || cachedBalances.ETH
//       };

//       setCachedBalances(newBalances);
//       setLastFetchTime(Date.now());
//       saveToCache(newBalances);
//     }
//   }, [usdtBalance, strkBalance, ethBalance, saveToCache]);

//   // Refresh on interval
//   useEffect(() => {
//     if (!address) return;
    
//     const interval = setInterval(() => {
//       if (shouldRefetch()) {
//         fetchAndCacheBalances();
//       }
//     }, CACHE_DURATION);

//     return () => clearInterval(interval);
//   }, [address, shouldRefetch]);

//   const clearCache = useCallback(() => {
//     localStorage.removeItem(CACHE_KEY);
//     setCachedBalances({
//       USDT: null,
//       STRK: null,
//       ETH: null
//     });
//   }, [CACHE_KEY]);

//   return {
//     balances: cachedBalances,
//     isLoading: isLoadingUsdt || isLoadingStrk || isLoadingEth,
//     refresh: () => setLastFetchTime(0),
//     forceRefresh: fetchAndCacheBalances,
//     clearCache
//   };
// }



import {
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
} from "@/utils/constants";
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
    // watch: true,
    enabled: !!address,
     refetchInterval: 10000000,
  });

  const { data: strkBalance, isLoading: isLoadingStrk } = useBalance({
    address,
    token: tokenAddresses.STRK,
    // watch: true,
    enabled: !!address,
    refetchInterval: 10000000,
  });

  const { data: ethBalance, isLoading: isLoadingEth } = useBalance({
    address,
    token: tokenAddresses.ETH,
    // watch: true,
    enabled: !!address,
     refetchInterval: 10000000,
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


// const { data: usdtBalance, isLoading: isLoadingUsdt } = useCall({
  //   abi: universalErc20Abi as Abi,
  //   functionName: "balance_of",
  //   address: chain.nativeCurrency.address,
  //   args: [address],
  // });
  // const { data: strkBalance, isLoading: isLoadingStrk } = useCall({
  //   abi: universalErc20Abi as Abi,
  //   functionName: "balance_of",
  //   address: chain.nativeCurrency.address,
  //   args: [address],
  // });
  // const { data: ethBalance, isLoading: isLoadingEth } = useCall({
  //   abi: universalErc20Abi as Abi,
  //   functionName: "balance_of",
  //   address: tokenAddresses.ETH,
  //   args: [address],
  // });