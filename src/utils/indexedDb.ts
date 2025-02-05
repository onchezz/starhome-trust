import { openDB as idbOpenDB } from 'idb';

export const openDB = async () => {
  return idbOpenDB('starhomes-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('properties')) {
        db.createObjectStore('properties', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('property')) {
        db.createObjectStore('property', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('agentProperties')) {
        db.createObjectStore('agentProperties', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
    },
  });
};

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