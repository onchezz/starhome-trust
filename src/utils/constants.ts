// const starhomesContract = "0x032974461adde24e64bf4dbacf77308dfa2c58c8aca40ad86c69ee512690e278" as const;


const starhomesContract = "0x0568f7130f1dc0ee20fa52ce9038ad0e023248270fd5d7d3ae27dc427eed8a95" as const;

// Eth
const universalEthAddress =
  "0x49D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7" as const;
  // Strk
const universalStrkAddress =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d" as const;

  const usdcTokenAddress = 
  "0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080"as const;

  const usdTTokenAddress = 
  "0x02Ab8758891E84b968fF11361789070c6B1Af2dF618D6D2f4a78b0757573C6eB"as const;

export const LAST_CONNECTED_TIME_LOCALSTORAGE_KEY = "lastConnectedTime";
const tokenOptions = [
  { symbol: "USDC", address: usdcTokenAddress },
  { symbol: "USDT", address: usdTTokenAddress },
  { symbol: "ETH", address: universalEthAddress },
  { symbol: "STRK", address: universalStrkAddress },
];
export {
  tokenOptions,
  starhomesContract,
  usdcTokenAddress,
  usdTTokenAddress,
  universalEthAddress,
  universalStrkAddress,
};


