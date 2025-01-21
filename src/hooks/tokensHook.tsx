import { useState } from "react";
import {
  useReadContract,
  useBalance,
  useSendTransaction,
  useContract,
  useAccount,
} from "@starknet-react/core";
// Token decimals (assuming 18 decimals for all tokens)
const tokenDecimals = {
  USDT: 18,
  STRK: 18,
  ETH: 18,
};
 const tokenAddresses = {
  USDT: "0x02ab8758891e84b968ff11361789070c6b1af2df618d6d2f4a78b0757573c6eb",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
} as const;

// Helper function to convert user input to token decimals
const toTokenAmount = (amount, decimals) => {
  return BigInt(amount) * 10n ** BigInt(decimals);
};

// Custom hook to interact with the token contract
const useToken = (tokenAddress) => {
  const { address: owner } = useAccount();
  const spender = "0xSpenderAddress";
  const amount = 10000000000000; // Replace with the spender's address

  // Read token metadata
  const { data: name } = useReadContract({
    abi: [
      {
        name: "name",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
    ] as const,
    functionName: "name",
    address: tokenAddress,
  });

  const { data: symbol } = useReadContract({
    abi: [
      {
        name: "symbol",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
    ] as const,
    functionName: "symbol",
    address: tokenAddress,
  });

  const { data: decimals } = useReadContract({
    abi: [
      {
        name: "decimals",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u8",
          },
        ],
        state_mutability: "view",
      },
    ] as const,
    functionName: "decimals",
    address: tokenAddress,
  });

  // Check allowance
  const { data: allowance, error: allowanceError } = useReadContract({
    abi: [
      {
        name: "allowance",
        type: "function",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
    ] as const,
    functionName: "allowance",
    address: tokenAddress,
    args: [owner || "0x0", spender],
  });

  // Approve tokens
  const { contract } = useContract({
    abi: [
      {
        name: "approve",
        type: "function",
        inputs: [
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
    ] as const,
    address: tokenAddress,
  });

  const { send, error: approveError } = useSendTransaction({
    calls:
      contract && owner
        ? [contract.populate("approve", [spender, amount])]
        : undefined, // Default to 0, will be overridden
  });

  return {
    name,
    symbol,
    decimals,
    allowance,
    allowanceError,
    send,
    approveError,
  };
};

// Main component
const MyComponent = () => {
  const [amount, setAmount] = useState("");

  // Use the custom hook for each token
  const {
    name: usdtName,
    symbol: usdtSymbol,
    decimals: usdtDecimals,
    allowance: usdtAllowance,
    send: approveUSDT,
  } = useToken(tokenAddresses.USDT);
  const {
    name: strkName,
    symbol: strkSymbol,
    decimals: strkDecimals,
    allowance: strkAllowance,
    send: approveSTRK,
  } = useToken(tokenAddresses.STRK);
  const {
    name: ethName,
    symbol: ethSymbol,
    decimals: ethDecimals,
    allowance: ethAllowance,
    send: approveETH,
  } = useToken(tokenAddresses.ETH);

  // Handle approval with decimal conversion
  const handleApprove = async (approveFunction, amount, decimals) => {
    try {
      const tokenAmount = toTokenAmount(amount, decimals);
      await approveFunction([tokenAmount.toString()]);
      console.log("Tokens approved successfully!");
    } catch (err) {
      console.error("Error approving tokens:", err);
    }
  };

  
};

export default MyComponent;
