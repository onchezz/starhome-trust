import { useState } from "react";
import {
  useReadContract,
  useBalance,
  useSendTransaction,
  useContract,
  useAccount,
} from "@starknet-react/core";
import { starhomesContract } from "@/utils/constants";
import { universalErc20Abi } from "@/data/universalTokenabi";
import { num } from "starknet";

// Token decimals (assuming 18 decimals for all tokens)
const tokenDecimals = {
  USDT: 18,
  STRK: 18,
  ETH: 18,
};

export const useToken = (tokenAddress: string) => {
  const { address: owner } = useAccount();
  const spender = starhomesContract;

  // Read token metadata using universal ERC20 ABI
  const { data: name } = useReadContract({
    functionName: "name",
    address: tokenAddress,
    abi: universalErc20Abi,
  });

  const { data: symbol } = useReadContract({
    functionName: "symbol",
    address: tokenAddress,
    abi: universalErc20Abi,
  });

  const { data: decimals } = useReadContract({
    functionName: "decimals",
    address: tokenAddress,
    abi: universalErc20Abi,
  });

  // Check balance
  const { data: balance } = useReadContract({
    functionName: "balance_of",
    address: tokenAddress,
    abi: universalErc20Abi,
    args: [owner || "0x0"],
  });

  // Check allowance
  const { data: allowance, error: allowanceError } = useReadContract({
    functionName: "allowance",
    address: tokenAddress,
    abi: universalErc20Abi,
    args: [owner || "0x0", spender],
  });

  // Contract interactions
  const { contract } = useContract({
    abi: universalErc20Abi,
    address: tokenAddress,
  });

  const { sendAsync: sendTransaction } = useSendTransaction();

  const approveAndInvest = async (amount: string, investmentId: string, investCallback: (id: string, amount: string) => Promise<any>) => {
    if (!contract || !owner) {
      throw new Error("Contract or owner not initialized");
    }

    try {
      const amountBigInt = num.toBigInt(amount);
      const currentAllowance = allowance ? BigInt(allowance.toString()) : BigInt(0);
      const currentBalance = balance ? BigInt(balance.toString()) : BigInt(0);

      console.log("Investment check:", {
        amount: amountBigInt.toString(),
        allowance: currentAllowance.toString(),
        balance: currentBalance.toString()
      });

      if (currentBalance < amountBigInt) {
        throw new Error("Insufficient balance");
      }

      const calls = [];

      if (currentAllowance < amountBigInt) {
        // Need to increase allowance first
        const approveCall = contract.populate("approve", [spender, amountBigInt]);
        calls.push(approveCall);
      }

      // If we have calls to make before investing
      if (calls.length > 0) {
        const tx = await sendTransaction(calls);
        console.log("Approval transaction:", tx);
      }

      // Now proceed with investment
      await investCallback(investmentId, amount);

    } catch (error) {
      console.error("Error in approveAndInvest:", error);
      throw error;
    }
  };

  return {
    name,
    symbol,
    decimals,
    balance,
    allowance,
    allowanceError,
    approveAndInvest,
  };
};