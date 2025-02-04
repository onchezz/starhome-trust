export const CACHE_KEYS = {
  PROPERTIES: 'properties',
  PROPERTY: (id: string) => ['property', id],
  AGENT_PROPERTIES: 'agent_properties',
  INVESTMENT_PROPERTIES: 'investment_properties',
  USER_INVESTMENTS: 'user_investments',
  INVESTMENT_ASSET: (id: string) => ['investment_asset', id],
  TOKEN_BALANCES: 'token_balances',
};

export const getLocalCache = (key: string) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

export const setLocalCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
};