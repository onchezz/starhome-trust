import { useStarHomeReadContract } from './contract_hooks/useStarHomeReadContract';
import useEthBalance from './contract_hooks/useEthBalance';
import useStrkBalance from './contract_hooks/useStrkBalance';
import { useAccount } from '@starknet-react/core';
import { priceService } from '@/services/GetTokePriceService';
import { useEffect, useState } from 'react';
import { Property } from '@/types/property';
import { parseParamWithType } from '@/utils/starhomes/contract';

export const useInvestmentData = () => {
  const { address } = useAccount();
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [strkPrice, setStrkPrice] = useState<number>(0);

  const ethBalance = useEthBalance({ address });
  const strkBalance = useStrkBalance({ address });

  // Read investment properties from contract
  const { data: rawProperties, isLoading: isLoadingProperties } = useStarHomeReadContract({
    contractName: "StarhomesContract",
    functionName: "get_investment_properties",
    args: [],
  });

  console.log("Raw properties from contract:", rawProperties);

  // Parse property data
  const parsedProperties = rawProperties?.map((property: any) => {
    return Object.keys(property).reduce((acc: any, key) => {
      acc[key] = parseParamWithType(property[key]?.type || 'core::felt252', property[key], true);
      return acc;
    }, {}) as Property;
  });

  console.log("Decoded properties:", parsedProperties);

  // Setup price polling
  useEffect(() => {
    const id = priceService.getNextId();
    priceService.startPolling(id, setEthPrice, setStrkPrice);

    return () => {
      priceService.stopPolling(id);
    };
  }, []);

  // Format balances for display
  const formattedBalances = {
    ETH: {
      value: ethBalance?.value || 0n,
      price: ethPrice,
    },
    STRK: {
      value: strkBalance?.value || 0n,
      price: strkPrice,
    },
  };

  console.log("Balances:", formattedBalances);
  console.log("Token prices:", { ETH: ethPrice, STRK: strkPrice });

  return {
    properties: parsedProperties || [],
    balances: formattedBalances,
    isLoading: isLoadingProperties,
    address,
  };
};