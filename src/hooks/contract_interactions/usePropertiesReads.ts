import { Property, PropertyConverter } from '@/types/property';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { num } from 'starknet';
import { InvestmentAsset, InvestmentAssetConverter } from '@/types/investment';
import { useAccount } from '@starknet-react/core';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';

// Increase cache time for better performance
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export const usePropertyRead = () => {
  const salePropertiesHook = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  const { data: propertiesData, isLoading: salePropertiesLoading, error: salePropertiesError } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log("[usePropertyRead] Contract hook result:", salePropertiesHook);
      
      if (salePropertiesHook.error) {
        console.error("[usePropertyRead] Error fetching properties:", salePropertiesHook.error);
        throw salePropertiesHook.error;
      }
      
      return salePropertiesHook.data || [];
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchInterval: CACHE_TIME,
    enabled: !salePropertiesHook.isLoading,
  });

  const saleProperties = Array.isArray(propertiesData) ? propertiesData.map((prop: any) => {
    console.log("[usePropertyRead] Converting property:", prop);
    try {
      return PropertyConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[usePropertyRead] Error converting property:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

  return {
    saleProperties,
    salePropertiesLoading,
    salePropertiesError,
  };
};

export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();
  const investmentPropertiesHook = useStarHomeReadContract({
    functionName: "get_investment_properties",
  });

  const userInvestmentsHook = useStarHomeReadContract({
    functionName: "get_investment_properties_by_lister",
    args: address ? [address] : undefined,
  });

  console.log("[useInvestmentAssetsRead] User investments hook:", userInvestmentsHook);

  const { data: investmentPropertiesData, isLoading: allInvestmentsLoading } = useQuery({
    queryKey: ['investment_properties'],
    queryFn: async () => {
      console.log("[useInvestmentAssetsRead] Raw investment properties data:", investmentPropertiesHook);
      
      if (investmentPropertiesHook.error) {
        console.error("[useInvestmentAssetsRead] Error fetching investment properties:", investmentPropertiesHook.error);
        throw investmentPropertiesHook.error;
      }
      
      const investments = investmentPropertiesHook.data || [];
      console.log("[useInvestmentAssetsRead] Fetched investments:", investments);
      return investments;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    enabled: !investmentPropertiesHook.isLoading,
  });

  const { data: userInvestmentsData, isLoading: userInvestmentsLoading } = useQuery({
    queryKey: ['user_investments', address],
    queryFn: async () => {
      console.log("[useInvestmentAssetsRead] Raw user investments data:", userInvestmentsHook);
      
      if (userInvestmentsHook.error) {
        console.error("[useInvestmentAssetsRead] Error fetching user investments:", userInvestmentsHook.error);
        throw userInvestmentsHook.error;
      }
      
      const investments = userInvestmentsHook.data || [];
      console.log("[useInvestmentAssetsRead] Fetched user investments:", investments);
      return investments;
    },
    staleTime: CACHE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    enabled: !!address && !userInvestmentsHook.isLoading,
  });

  const investmentProperties = Array.isArray(investmentPropertiesData) ? investmentPropertiesData.map((prop: any) => {
    console.log("[useInvestmentAssetsRead] Converting investment property:", prop);
    try {   
      return InvestmentAssetConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[useInvestmentAssetsRead] Error converting investment property:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

  const userInvestments = Array.isArray(userInvestmentsData) ? userInvestmentsData.map((prop: any) => {
    console.log("[useInvestmentAssetsRead] Converting user investment:", prop);
    try {   
      return InvestmentAssetConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[useInvestmentAssetsRead] Error converting user investment:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

  console.log("[useInvestmentAssetsRead] Final investments:", {
    all: investmentProperties,
    user: userInvestments,
    userAddress: address
  });

  return {
    investmentProperties,
    userInvestments,
    isLoading: allInvestmentsLoading || userInvestmentsLoading,
    error: investmentPropertiesHook.error || userInvestmentsHook.error
  };
};
