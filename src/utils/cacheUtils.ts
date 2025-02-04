import { QueryClient } from '@tanstack/react-query';

const CACHE_TIME = 10 * 60 * 1000; // 10 minutes
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      refetchOnWindowFocus: false,
    },
  },
});

export const CACHE_KEYS = {
  PROPERTIES: 'properties',
  INVESTMENTS: 'investments',
  USER_INVESTMENTS: 'user_investments',
  TOKEN_BALANCES: 'token_balances',
  PROPERTY: (id: string) => ['property', id],
  INVESTMENT: (id: string) => ['investment', id],
  USER_BALANCE: (address: string) => ['balance', address],
};

export const getLocalStorageKey = (key: string) => `starhomes_${key}`;

export const setLocalCache = (key: string, data: any) => {
  try {
    localStorage.setItem(
      getLocalStorageKey(key),
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Error setting local cache:', error);
  }
};

export const getLocalCache = (key: string) => {
  try {
    const cached = localStorage.getItem(getLocalStorageKey(key));
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TIME) {
      localStorage.removeItem(getLocalStorageKey(key));
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting local cache:', error);
    return null;
  }
};