const starhomesContract ="0x05ac9fe7a619672c4ac2c98193266d5e429b13e0d76c2c7bd5a1ab96ee2326cf"as const;
// "0x04ca966dbe927ab79127eaf0415fd90d07b802b857beee3fe8840088a9c10493" as const;
// "0x030e7db139490658ebdc76d6fed7645e85d792edd981ad0aa5ed9df28cc62b14" as const;

const rpcProvideUr =  "https://starknet-sepolia.public.blastapi.io/rpc/v0_7" as const;

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

export const tokenOptions = [
  { symbol: "USDC", address: usdcTokenAddress },
  { symbol: "USDT", address: usdTTokenAddress },
  { symbol: "ETH", address: universalEthAddress },
  { symbol: "STRK", address: universalStrkAddress },
] as const;

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

export {
  pinataImageUrl,
  rpcProvideUr,
  starhomesContract,
  usdcTokenAddress,
  usdTTokenAddress,
  universalEthAddress,
  universalStrkAddress,
};