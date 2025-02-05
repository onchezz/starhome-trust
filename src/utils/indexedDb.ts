import { openDB as idbOpenDB } from 'idb';
import { InvestmentAsset } from '@/types/investment';
import { Property } from '@/types/property';

interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  allowance: string;
  timestamp: number;
}

export const openDB = async () => {
  return idbOpenDB('starhomes-db', 1, {
    upgrade(db) {
      // Create object stores if they don't exist
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

// Generic save function
export const saveToDB = async (storeName: string, data: any) => {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  
  if (Array.isArray(data)) {
    for (const item of data) {
      await store.put(item);
    }
  } else {
    await store.put(data);
  }
};

// Generic get function
export const getFromDB = async (storeName: string, key?: string) => {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  
  if (key) {
    return store.get(key);
  } else {
    return store.getAll();
  }
};

// Investment specific functions
export const saveInvestments = async (investments: InvestmentAsset[]) => {
  return saveToDB('investments', investments);
};

export const getInvestments = async (): Promise<InvestmentAsset[]> => {
  return getFromDB('investments') as Promise<InvestmentAsset[]>;
};

// Property specific functions
export const saveProperties = async (properties: Property[]) => {
  return saveToDB('properties', properties);
};

export const getProperties = async (): Promise<Property[]> => {
  return getFromDB('properties') as Promise<Property[]>;
};

// Token specific functions
export const saveTokenData = async (
  tokenAddress: string, 
  ownerAddress: string, 
  data: TokenData
) => {
  return saveToDB('tokens', {
    address: tokenAddress,
    owner: ownerAddress,
    ...data,
    timestamp: Date.now()
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