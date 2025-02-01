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

export const useToken = (tokenAddress) => {
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

  const { sendAsync: sendTransaction } = useSendTransaction();

  const approveAndInvest = async (amount: number, investmentId: string, investCallback: (id: string, amount: number) => Promise<any>) => {
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

      if (currentBalance < amount) {
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

      // After approval, proceed with investment
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