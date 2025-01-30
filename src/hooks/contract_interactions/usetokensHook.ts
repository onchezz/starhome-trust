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

export const useToken = (tokenAddress: string) => {
  const { address: owner } = useAccount();
  const spender = starhomesContract;

  // Ensure addresses are properly formatted with 0x prefix
  const formattedTokenAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
  const formattedSpender = spender.startsWith('0x') ? spender : `0x${spender}`;
  const formattedOwner = owner ? (owner.startsWith('0x') ? owner : `0x${owner}`) : '0x0';

  // Read token metadata using universal ERC20 ABI
  const { data: name } = useReadContract({
    functionName: "name",
    address: formattedTokenAddress as `0x${string}`,
    abi: universalErc20Abi,
  });

  const { data: symbol } = useReadContract({
    functionName: "symbol",
    address: formattedTokenAddress as `0x${string}`,
    abi: universalErc20Abi,
  });

  const { data: decimals } = useReadContract({
    functionName: "decimals",
    address: formattedTokenAddress as `0x${string}`,
    abi: universalErc20Abi,
  });

  // Check balance
  const { data: balance } = useReadContract({
    functionName: "balance_of",
    address: formattedTokenAddress as `0x${string}`,
    abi: universalErc20Abi,
    args: [formattedOwner as `0x${string}`],
  });

  // Check allowance
  const { data: allowance, error: allowanceError } = useReadContract({
    functionName: "allowance",
    address: formattedTokenAddress as `0x${string}`,
    abi: universalErc20Abi,
    args: [formattedOwner as `0x${string}`, formattedSpender as `0x${string}`],
  });

  // Contract interactions
  const { contract } = useContract({
    abi: universalErc20Abi,
    address: formattedTokenAddress as `0x${string}`,
  });

  const { sendAsync } = useSendTransaction({
    calls: [],
  });

  const approveAndInvest = async (amount: string, investmentId: string, investCallback: (id: string, amount: string) => Promise<any>) => {
    if (!contract || !owner) {
      throw new Error("Contract or owner not initialized");
    }

    try {
      // Convert amount to token units based on decimals
      const tokenDecimals = decimals ? Number(decimals.toString()) : 18; // Default to 18 if not available
      const amountInTokenUnits = Number(amount) * Math.pow(10, tokenDecimals);
      const amountBigInt = num.toBigInt(Math.floor(amountInTokenUnits).toString());
      
      console.log("Investment amount conversion:", {
        originalAmount: amount,
        tokenDecimals,
        amountInTokenUnits,
        amountBigInt: amountBigInt.toString()
      });

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
        const approveCall = contract.populate("approve", [formattedSpender as `0x${string}`, amountBigInt]);
        calls.push(approveCall);
      }

      // If we have calls to make before investing
      if (calls.length > 0) {
        const tx = await sendAsync(calls);
        console.log("Approval transaction:", tx);
      }

      // Now proceed with investment using the amount in token units
      await investCallback(investmentId, Math.floor(amountInTokenUnits).toString());

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