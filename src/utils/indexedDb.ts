import { openDB } from 'idb';

const DB_NAME = 'starhomes_db';
const DB_VERSION = 1;
const STORE_NAME = 'tokenData';

interface TokenData {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  allowance: string;
  timestamp: number;
}

export const initDB = async () => {
  console.log('Initializing IndexedDB...');
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log('Upgrading database from version', oldVersion, 'to', newVersion);
        
        // Check if store exists before creating it
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          console.log('Creating tokenData store...');
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
      blocked() {
        console.log('Database upgrade was blocked');
      },
      blocking() {
        console.log('Database is blocking an upgrade');
      },
      terminated() {
        console.log('Database connection was terminated');
      },
    });
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const saveTokenData = async (
  tokenAddress: string,
  ownerAddress: string,
  data: {
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
    allowance: string;
  }
) => {
  console.log('Saving token data:', { tokenAddress, ownerAddress, data });
  try {
    const db = await initDB();
    const id = `${tokenAddress}-${ownerAddress}`;
    const tokenData = {
      id,
      address: tokenAddress,
      ...data,
      timestamp: Date.now()
    };
    
    await db.put(STORE_NAME, tokenData);
    console.log('Token data saved successfully');
  } catch (error) {
    console.error('Error saving token data:', error);
    throw error;
  }
};

export const getTokenData = async (tokenAddress: string, ownerAddress: string): Promise<TokenData | null> => {
  console.log('Getting token data for:', { tokenAddress, ownerAddress });
  try {
    const db = await initDB();
    const id = `${tokenAddress}-${ownerAddress}`;
    const data = await db.get(STORE_NAME, id);
    console.log('Retrieved token data:', data);
    return data;
  } catch (error) {
    console.error('Error retrieving token data:', error);
    throw error;
  }
};

export const clearTokenData = async () => {
  console.log('Clearing token data...');
  try {
    const db = await initDB();
    await db.clear(STORE_NAME);
    console.log('Token data cleared successfully');
  } catch (error) {
    console.error('Error clearing token data:', error);
    throw error;
  }
};