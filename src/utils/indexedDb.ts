import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'starhomes_db';
const DB_VERSION = 1;

export async function initDB() {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('properties')) {
                db.createObjectStore('properties', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('investments')) {
                db.createObjectStore('investments', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('tokenAllowances')) {
                db.createObjectStore('tokenAllowances', { keyPath: 'id' });
            }
        }
    });
    return db;
}

// Properties
export async function saveProperty(property: any) {
    const db = await initDB();
    await db.put('properties', property);
}

export async function getProperty(id: string) {
    const db = await initDB();
    return db.get('properties', id);
}

export async function getAllProperties() {
    const db = await initDB();
    return db.getAll('properties');
}

// Investments
export async function saveInvestment(investment: any) {
    const db = await initDB();
    await db.put('investments', investment);
}

export async function getInvestment(id: string) {
    const db = await initDB();
    return db.get('investments', id);
}

export async function getAllInvestments() {
    const db = await initDB();
    return db.getAll('investments');
}

// Users
export async function saveUser(user: any) {
    const db = await initDB();
    await db.put('users', user);
}

export async function getUser(id: string) {
    const db = await initDB();
    return db.get('users', id);
}

export async function getAllUsers() {
    const db = await initDB();
    return db.getAll('users');
}

// Token Allowances
export async function saveTokenAllowance(
    tokenAddress: string,
    ownerAddress: string,
    allowance: string | number
) {
    console.log('Saving token allowance:', { tokenAddress, ownerAddress, allowance });
    const db = await initDB();
    const id = `${tokenAddress}-${ownerAddress}`;
    await db.put('tokenAllowances', {
        id,
        tokenAddress,
        ownerAddress,
        allowance: allowance.toString(),
        timestamp: Date.now()
    });
}

export async function getTokenAllowance(tokenAddress: string, ownerAddress: string): Promise<string | null> {
    console.log('Getting token allowance for:', { tokenAddress, ownerAddress });
    const db = await initDB();
    const id = `${tokenAddress}-${ownerAddress}`;
    const allowance = await db.get('tokenAllowances', id);
    console.log('Retrieved allowance:', allowance);
    return allowance ? allowance.allowance : null;
}

export async function deleteTokenAllowance(tokenAddress: string, ownerAddress: string) {
    const db = await initDB();
    const id = `${tokenAddress}-${ownerAddress}`;
    await db.delete('tokenAllowances', id);
}

export async function clearDatabase() {
    const db = await initDB();
    await Promise.all([
        db.clear('properties'),
        db.clear('investments'),
        db.clear('users'),
        db.clear('tokenAllowances')
    ]);
}