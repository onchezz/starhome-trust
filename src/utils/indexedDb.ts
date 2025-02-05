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

export const cacheUserInfo = async (userInfo: any): Promise<void> => {
  try {
    const db = await getDB();
    const tx = db.transaction('userInfo', 'readwrite');
    const store = tx.objectStore('userInfo');

    await store.put({
      ...userInfo,
      timestamp: Date.now()
    });

    console.log('[IndexedDB] User info cached successfully');
  } catch (error) {
    console.error('[IndexedDB] Error caching user info:', error);
  }
};

export const getCachedUserInfo = async (): Promise<any | null> => {
  try {
    const db = await getDB();
    const tx = db.transaction('userInfo', 'readonly');
    const store = tx.objectStore('userInfo');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[IndexedDB] Retrieved cached user info:', request.result[0]);
        resolve(request.result[0] || null);
      };
    });
  } catch (error) {
    console.error('[IndexedDB] Error getting cached user info:', error);
    return null;
  }
};

export const cacheUserInvestments = async (investments: any[]): Promise<void> => {
  try {
    const db = await getDB();
    const tx = db.transaction('userInvestments', 'readwrite');
    const store = tx.objectStore('userInvestments');

    investments.forEach(investment => {
      store.put({
        ...investment,
        timestamp: Date.now()
      });
    });

    console.log('[IndexedDB] User investments cached successfully');
  } catch (error) {
    console.error('[IndexedDB] Error caching user investments:', error);
  }
};

export const getCachedUserInvestments = async (): Promise<any[]> => {
  try {
    const db = await getDB();
    const tx = db.transaction('userInvestments', 'readonly');
    const store = tx.objectStore('userInvestments');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('[IndexedDB] Retrieved cached user investments:', request.result);
        resolve(request.result);
      };
    });
  } catch (error) {
    console.error('[IndexedDB] Error getting cached user investments:', error);
    return [];
  }
};

// Update the initDB function to include new stores
const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION + 1);

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

      if (!db.objectStoreNames.contains('userInfo')) {
        db.createObjectStore('userInfo', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('userInvestments')) {
        db.createObjectStore('userInvestments', { keyPath: 'id' });
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
