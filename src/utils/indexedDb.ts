import { openDB, deleteDB } from 'idb';

const DB_NAME = 'starhomes_db';
const DB_VERSION = 2; // Incrementing version to force upgrade
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

export const deleteDatabase = async () => {
  console.log('Deleting database...');
  try {
    await deleteDB(DB_NAME);
    console.log('Database deleted successfully');
  } catch (error) {
    console.error('Error deleting database:', error);
    throw error;
  }
};

export const initDB = async () => {
  console.log('Initializing IndexedDB...');
  try {
    // Delete existing database if there are issues
    try {
      const tempDB = await openDB(DB_NAME, DB_VERSION);
      if (!tempDB.objectStoreNames.contains(STORE_NAME)) {
        tempDB.close();
        await deleteDatabase();
      } else {
        tempDB.close();
      }
    } catch (error) {
      console.log('Initial DB check failed, attempting to create new database');
    }

    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log('Upgrading database from version', oldVersion, 'to', newVersion);
        
        // Delete old store if it exists
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        
        // Create new store
        console.log('Creating tokenData store...');
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
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
    
    // Verify store exists
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      throw new Error('Store was not created successfully');
    }
    
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