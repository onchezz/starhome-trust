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
// import { num } from "starknet";

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

  const { sendAsync: sendTransaction } = useSendTransaction({});

  const approveAndInvest = async (amount: number, investmentId: string, investCallback: (id: string, amount: number) => Promise<any>) => {
    if (!contract || !owner) {
      throw new Error("Contract or owner not initialized");
    }

    try {
      // Convert amount to token units based on decimals
      const tokenDecimals = decimals ? Number(decimals.toString()) : 18; // Default to 18 if not available
      const amountInTokenUnits = Math.floor(Number(amount) * Math.pow(10, tokenDecimals));
      
      console.log("Amount before BigInt conversion:", {
        amount,
        amountInTokenUnits: amountInTokenUnits.toString(),
        tokenDecimals
      });

      // Convert to BigInt after ensuring we have an integer
      const amountBigInt = num.toBigInt(amountInTokenUnits.toString());
      
      console.log("Investment amount details:", {
        originalAmount: amount,
        tokenDecimals,
        amountInTokenUnits: amountInTokenUnits.toString(),
        amountBigInt: amountBigInt.toString()
      });

      const currentAllowance = allowance ? BigInt(allowance.toString()) : BigInt(0);
      const currentBalance = balance ? BigInt(balance.toString()) : BigInt(0);

      console.log("Investment check:", {
        amount:amount,
        allowance: currentAllowance.toString(),
        balance: currentBalance.toString()
      });

      if (currentBalance < amount) {
        throw new Error("Insufficient balance");
      }

      // Check if current allowance is sufficient
      if (currentAllowance >= amountBigInt) {
        console.log("Sufficient allowance exists:", {
          currentAllowance: currentAllowance.toString(),
          requiredAmount: amountBigInt.toString()
        });
        // If allowance is sufficient, proceed directly with investment
        await investCallback(investmentId, amountInTokenUnits);
        return;
      }

      // If allowance is insufficient, increase allowance first
      console.log("Insufficient allowance, requesting increase:", {
        currentAllowance: currentAllowance.toString(),
        requestingApprovalFor: amountBigInt.toString()
      });

      // Calculate the additional allowance needed
      const additionalAllowance = amountBigInt - currentAllowance;
      console.log("Increasing allowance by:", additionalAllowance.toString());

      // Use increase_allowance instead of approve
      const increaseAllowanceCall = contract.populate("increase_allowance", [
        formattedSpender as `0x${string}`, 
        additionalAllowance
      ]);

      const tx = await sendTransaction([increaseAllowanceCall]);
      console.log("Allowance increase transaction completed:", tx);

      // After increasing allowance, proceed with investment
      await investCallback(investmentId, amountInTokenUnits);

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