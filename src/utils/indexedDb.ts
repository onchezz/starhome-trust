import { openDB, deleteDB } from 'idb';
import { InvestmentAsset } from '@/types/investment';
import { Property } from '@/types/property';

const DB_NAME = 'starhomes_db';
const DB_VERSION = 3; // Incrementing version to force upgrade
const TOKEN_STORE = 'tokenData';
const INVESTMENT_STORE = 'investments';
const PROPERTY_STORE = 'properties';

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
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log('Upgrading database from version', oldVersion, 'to', newVersion);
        
        // Create or update token store
        if (!db.objectStoreNames.contains(TOKEN_STORE)) {
          db.createObjectStore(TOKEN_STORE, { keyPath: 'id' });
        }
        
        // Create or update investment store
        if (!db.objectStoreNames.contains(INVESTMENT_STORE)) {
          db.createObjectStore(INVESTMENT_STORE, { keyPath: 'id' });
        }
        
        // Create or update property store
        if (!db.objectStoreNames.contains(PROPERTY_STORE)) {
          db.createObjectStore(PROPERTY_STORE, { keyPath: 'id' });
        }
      },
    });
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Token Data Operations
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
    
    await db.put(TOKEN_STORE, tokenData);
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
    const data = await db.get(TOKEN_STORE, id);
    console.log('Retrieved token data:', data);
    return data;
  } catch (error) {
    console.error('Error retrieving token data:', error);
    throw error;
  }
};

// Investment Data Operations
export const saveInvestments = async (investments: InvestmentAsset[]) => {
  console.log('Saving investments:', investments);
  try {
    const db = await initDB();
    const tx = db.transaction(INVESTMENT_STORE, 'readwrite');
    const store = tx.objectStore(INVESTMENT_STORE);
    
    await Promise.all(investments.map(investment => 
      store.put({ ...investment, timestamp: Date.now() })
    ));
    
    await tx.done;
    console.log('Investments saved successfully');
  } catch (error) {
    console.error('Error saving investments:', error);
    throw error;
  }
};

export const getInvestments = async (): Promise<InvestmentAsset[]> => {
  console.log('Getting investments from IndexedDB');
  try {
    const db = await initDB();
    const investments = await db.getAll(INVESTMENT_STORE);
    console.log('Retrieved investments:', investments);
    return investments;
  } catch (error) {
    console.error('Error retrieving investments:', error);
    throw error;
  }
};

// Property Data Operations
export const saveProperties = async (properties: Property[]) => {
  console.log('Saving properties:', properties);
  try {
    const db = await initDB();
    const tx = db.transaction(PROPERTY_STORE, 'readwrite');
    const store = tx.objectStore(PROPERTY_STORE);
    
    await Promise.all(properties.map(property => 
      store.put({ ...property, timestamp: Date.now() })
    ));
    
    await tx.done;
    console.log('Properties saved successfully');
  } catch (error) {
    console.error('Error saving properties:', error);
    throw error;
  }
};

export const getProperties = async (): Promise<Property[]> => {
  console.log('Getting properties from IndexedDB');
  try {
    const db = await initDB();
    const properties = await db.getAll(PROPERTY_STORE);
    console.log('Retrieved properties:', properties);
    return properties;
  } catch (error) {
    console.error('Error retrieving properties:', error);
    throw error;
  }
};

export const clearTokenData = async () => {
  console.log('Clearing token data...');
  try {
    const db = await initDB();
    await db.clear(TOKEN_STORE);
    console.log('Token data cleared successfully');
  } catch (error) {
    console.error('Error clearing token data:', error);
    throw error;
  }
};