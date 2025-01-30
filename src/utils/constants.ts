const starhomesContract =
"0x026e90d3e7cb7e4f240104e41bb0659ccb48c6f9d479069bbf91c2075572208c"as const; //new

const rpcProvideUr =  "https://starknet-sepolia.infura.io/v3/YOUR_INFURA_KEY" as const;

const pinataImageUrl = "https://gateway.pinata.cloud/ipfs/" as const;

const universalEthAddress =
  "0x49D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7" as const;

const universalStrkAddress =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d" as const;

const usdcTokenAddress = 
  "0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080" as const;

const usdTTokenAddress = 
  "0x02Ab8758891E84b968fF11361789070c6B1Af2dF618D6D2f4a78b0757573C6eB" as const;

export const LAST_CONNECTED_TIME_LOCALSTORAGE_KEY = "lastConnectedTime";

export const propertyTypes = [
  "House",
  "Apartment",
  "Condo",
  "Townhouse",
  "Villa",
  "Land",
  "Commercial",
  "Other",
] as const;

export const statusOptions = [
  "Available",
  "Sold",
  "Under Contract",
  "Pending",
  "Off Market",
] as const;

export const tokenOptions = [
  { symbol: "USDC", address: usdcTokenAddress },
  { symbol: "USDT", address: usdTTokenAddress },
  { symbol: "ETH", address: universalEthAddress },
  { symbol: "STRK", address: universalStrkAddress },
] as const;

export {
  pinataImageUrl,
  rpcProvideUr,
  starhomesContract,
  usdcTokenAddress,
  usdTTokenAddress,
  universalEthAddress,
  universalStrkAddress,
};
