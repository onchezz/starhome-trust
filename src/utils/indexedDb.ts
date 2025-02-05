import { openDB as idbOpenDB } from 'idb';
import { InvestmentAsset } from '@/types/investment';
import { Property } from '@/types/property';

export interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  allowance: string;
  timestamp: number;
}

// Generic functions
export const openDB = async () => {
  return idbOpenDB('starhomes-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('properties')) {
        db.createObjectStore('properties', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('investments')) {
        db.createObjectStore('investments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('tokens')) {
        db.createObjectStore('tokens', { keyPath: ['address', 'owner'] });
      }
    },
  });
};

// Investment specific functions
export const saveInvestments = async (investments: InvestmentAsset[]) => {
  const db = await openDB();
  const tx = db.transaction('investments', 'readwrite');
  const store = tx.objectStore('investments');
  
  for (const investment of investments) {
    await store.put(investment);
  }
};

export const getInvestments = async (): Promise<InvestmentAsset[]> => {
  const db = await openDB();
  const tx = db.transaction('investments', 'readonly');
  const store = tx.objectStore('investments');
  return store.getAll();
};

// Token specific functions
export const saveTokenData = async (
  tokenAddress: string, 
  ownerAddress: string, 
  data: Omit<TokenData, 'timestamp'>
) => {
  const db = await openDB();
  const tx = db.transaction('tokens', 'readwrite');
  const store = tx.objectStore('tokens');
  
  const tokenData: TokenData = {
    ...data,
    timestamp: Date.now()
  };
  
  await store.put({
    address: tokenAddress,
    owner: ownerAddress,
    ...tokenData
  });
};

export const getTokenData = async (
  tokenAddress: string,
  ownerAddress: string
): Promise<TokenData | undefined> => {
  const db = await openDB();
  const tx = db.transaction('tokens', 'readonly');
  const store = tx.objectStore('tokens');
  return store.get([tokenAddress, ownerAddress]);
};