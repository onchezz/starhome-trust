import { Property } from "@/types/property";
import { InvestmentAsset } from "@/types/investment";

const DB_NAME = 'starhomes_db';
const DB_VERSION = 1;

interface CachedBalance {
  address: string;
  token: string;
  balance: string;
  timestamp: number;
}

export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      console.log('[IndexedDB] Database initialized successfully');
      resolve();
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('properties')) {
        db.createObjectStore('properties', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('investments')) {
        db.createObjectStore('investments', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('balances')) {
        db.createObjectStore('balances', { keyPath: 'id' });
      }
    };
  });
};

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const cacheProperties = async (properties: Property[]): Promise<void> => {
  try {
    const db = await getDB();
    const tx = db.transaction('properties', 'readwrite');
    const store = tx.objectStore('properties');

    properties.forEach(property => {
      store.put({
        ...property,
        timestamp: Date.now()
      });
    });

    console.log('[IndexedDB] Properties cached successfully');
  } catch (error) {
    console.error('[IndexedDB] Error caching properties:', error);
  }
};

export const getCachedProperties = async (): Promise<Property[]> => {
  try {
    const db = await getDB();
    const tx = db.transaction('properties', 'readonly');
    const store = tx.objectStore('properties');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[IndexedDB] Retrieved cached properties:', request.result);
        resolve(request.result);
      };
    });
  } catch (error) {
    console.error('[IndexedDB] Error getting cached properties:', error);
    return [];
  }
};

export const cacheInvestments = async (investments: InvestmentAsset[]): Promise<void> => {
  try {
    const db = await getDB();
    const tx = db.transaction('investments', 'readwrite');
    const store = tx.objectStore('investments');

    investments.forEach(investment => {
      store.put({
        ...investment,
        timestamp: Date.now()
      });
    });

    console.log('[IndexedDB] Investments cached successfully');
  } catch (error) {
    console.error('[IndexedDB] Error caching investments:', error);
  }
};

export const getCachedInvestments = async (): Promise<InvestmentAsset[]> => {
  try {
    const db = await getDB();
    const tx = db.transaction('investments', 'readonly');
    const store = tx.objectStore('investments');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[IndexedDB] Retrieved cached investments:', request.result);
        resolve(request.result);
      };
    });
  } catch (error) {
    console.error('[IndexedDB] Error getting cached investments:', error);
    return [];
  }
};

export const cacheBalance = async (address: string, token: string, balance: string): Promise<void> => {
  try {
    const db = await getDB();
    const tx = db.transaction('balances', 'readwrite');
    const store = tx.objectStore('balances');

    await store.put({
      id: `${address}-${token}`,
      address,
      token,
      balance,
      timestamp: Date.now()
    });

    console.log('[IndexedDB] Balance cached successfully');
  } catch (error) {
    console.error('[IndexedDB] Error caching balance:', error);
  }
};

export const getCachedBalance = async (address: string, token: string): Promise<CachedBalance | null> => {
  try {
    const db = await getDB();
    const tx = db.transaction('balances', 'readonly');
    const store = tx.objectStore('balances');
    const request = store.get(`${address}-${token}`);

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as CachedBalance;
        if (result && Date.now() - result.timestamp < 5 * 60 * 1000) { // 5 minutes cache
          console.log('[IndexedDB] Retrieved cached balance:', result);
          resolve(result);
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.error('[IndexedDB] Error getting cached balance:', error);
    return null;
  }
};