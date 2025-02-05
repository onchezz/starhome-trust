
import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { useState, useEffect } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { useAccount } from "@starknet-react/core";
import { openDB } from "@/utils/indexedDb";

const INVESTMENTS_CACHE_KEY = 'investments';

const saveInvestmentsToDB = async (investments: InvestmentAsset[]) => {
  const db = await openDB();
  const tx = db.transaction(INVESTMENTS_CACHE_KEY, 'readwrite');
  const store = tx.objectStore(INVESTMENTS_CACHE_KEY);
  await store.clear(); // Clear old data
  await Promise.all(investments.map(investment => store.put(investment)));
};

const getInvestmentsFromDB = async () => {
  const db = await openDB();
  const tx = db.transaction(INVESTMENTS_CACHE_KEY, 'readonly');
  const store = tx.objectStore(INVESTMENTS_CACHE_KEY);
  return store.getAll();
};

export const useInvestorsForInvestment = (investmentId: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investors_for_investment",
    args: [investmentId],
    options: {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  });

  return {
    investors: data,
    isLoading,
    error,
  };
};

export const useInvestorBalance = (investmentId: string, investorAddress?: string) => {
  const { address } = useAccount();
  
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investor_balance_in_investment",
    args: [investmentId, address],
    options: {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  });

  return {
    balance: data ? Number(data)/Math.pow(10,6) : 0,
    isLoading,
    error,
  };
};

export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();
  const { data: rawInvestmentProperties, isLoading: isLoadingProperties } = useStarHomeReadContract({
    functionName: "get_investment_properties",
    options: {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  });

  const { data: rawUserInvestments, isLoading: isLoadingInvestments } = useStarHomeReadContract({
    functionName: "get_investment_properties_by_lister",
    args: [address || ""],
    options: {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: !!address,
    }
  });

  const [formattedProperties, setFormattedProperties] = useState<InvestmentAsset[]>([]);
  const [formattedInvestments, setFormattedInvestments] = useState<InvestmentAsset[]>([]);

  // Load cached data first
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedInvestments = await getInvestmentsFromDB();
        if (cachedInvestments?.length > 0) {
          setFormattedProperties(cachedInvestments);
        }
      } catch (error) {
        console.error("Error loading from IndexedDB:", error);
      }
    };
    loadCachedData();
  }, []);

  // Update with fresh data from contract
  useEffect(() => {
    const updateInvestments = async () => {
      if (rawInvestmentProperties) {
        const investmentsArray = Array.isArray(rawInvestmentProperties) 
          ? rawInvestmentProperties 
          : Object.values(rawInvestmentProperties);
        const formatted = investmentsArray.map(inv => InvestmentAssetConverter.fromStarknetProperty(inv));
        
        await saveInvestmentsToDB(formatted);
        setFormattedProperties(formatted);
      }
    };
    updateInvestments();
  }, [rawInvestmentProperties]);

  useEffect(() => {
    if (rawUserInvestments) {
      const investmentsArray = Array.isArray(rawUserInvestments) 
        ? rawUserInvestments 
        : Object.values(rawUserInvestments);
      setFormattedInvestments(investmentsArray.map(inv => InvestmentAssetConverter.fromStarknetProperty(inv)));
    }
  }, [rawUserInvestments]);

  return {
    investmentProperties: formattedProperties,
    userInvestments: formattedInvestments,
    isLoading: isLoadingProperties || isLoadingInvestments,
    error: null
  };
};

export const useInvestmentAssetReadById = (id: string) => {
  const { data: rawInvestment, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investment",
    args: [id],
    options: {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  });

  const [investment, setInvestment] = useState<InvestmentAsset | null>(null);

  useEffect(() => {
    const fetchInvestment = async () => {
      if (rawInvestment) {
        const formatted = InvestmentAssetConverter.fromStarknetProperty(rawInvestment);
        setInvestment(formatted);
      } else {
        try {
          const cachedInvestments = await getInvestmentsFromDB();
          const cachedInvestment = cachedInvestments.find(inv => inv.id === id);
          if (cachedInvestment) {
            setInvestment(cachedInvestment);
          }
        } catch (error) {
          console.error("Error fetching from IndexedDB:", error);
        }
      }
    };

    fetchInvestment();
  }, [rawInvestment, id]);

  return {
    investment,
    isLoading,
    error
  };
};
