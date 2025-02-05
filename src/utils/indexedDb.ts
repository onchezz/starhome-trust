import { openDB } from 'idb';

const DB_NAME = 'starhomes_db';
const DB_VERSION = 1;

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
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('tokenData')) {
        db.createObjectStore('tokenData', { keyPath: 'id' });
      }
    },
  });
  return db;
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
  const db = await initDB();
  const id = `${tokenAddress}-${ownerAddress}`;
  await db.put('tokenData', {
    id,
    address: tokenAddress,
    ...data,
    timestamp: Date.now()
  });
};

export const getTokenData = async (tokenAddress: string, ownerAddress: string): Promise<TokenData | null> => {
  console.log('Getting token data for:', { tokenAddress, ownerAddress });
  const db = await initDB();
  const id = `${tokenAddress}-${ownerAddress}`;
  const data = await db.get('tokenData', id);
  console.log('Retrieved token data:', data);
  return data;
};