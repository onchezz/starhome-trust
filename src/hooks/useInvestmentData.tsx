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

  const { data: ethBalance } = useEthBalance({ address });
  const { data: strkBalance } = useStrkBalance({ address });

  // Read investment properties from contract
  const { data: properties, isLoading: isLoadingProperties } = useStarHomeReadContract({
    contractName: "StarhomesContract",
    functionName: "get_investment_properties",
    args: [],
  });

  // Parse property data
  const parsedProperties = properties?.map((property: any) => {
    console.log("Raw property data:", property);
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
      balance: ethBalance?.formatted || '0',
      value: ethBalance?.value || BigInt(0),
      price: ethPrice,
    },
    STRK: {
      balance: strkBalance?.formatted || '0',
      value: strkBalance?.value || BigInt(0),
      price: strkPrice,
    },
  };

  console.log("ETH Balance:", ethBalance);
  console.log("STRK Balance:", strkBalance);
  console.log("Token prices:", { ETH: ethPrice, STRK: strkPrice });

  return {
    properties: parsedProperties || [],
    balances: formattedBalances,
    isLoading: isLoadingProperties,
    address,
  };
};