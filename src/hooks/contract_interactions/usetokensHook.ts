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

export const useToken = (tokenAddress: string) => {
  const { address: owner } = useAccount();
  const spender = starhomesContract;

  // Ensure addresses are properly formatted with 0x prefix
  const formattedTokenAddress = tokenAddress?.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
  const formattedSpender = spender;
  
  // Only proceed with contract operations if we have a valid owner address
  const { contract } = useContract({
    abi: universalErc20Abi,
    address: formattedTokenAddress,
  });

  const { sendAsync: sendTransaction, status, isError, isIdle, isPending, isSuccess } = useSendTransaction({});

  // Initialize state for token data
  const [tokenData, setTokenData] = useState({
    name: '',
    symbol: '',
    decimals: 0,
    balance: 0,
    allowance: 0
  });

  // Only fetch token data if we have both contract and owner address
  const fetchTokenData = async () => {
    if (!contract || !owner) {
      console.log("Missing contract or owner address:", { contract: !!contract, owner });
      return;
    }

    try {
      const [name, symbol, decimals, balance, allowance] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.balance_of(owner),
        contract.allowance(owner, formattedSpender)
      ]);

      setTokenData({
        name,
        symbol,
        decimals: Number(decimals),
        balance: Number(balance),
        allowance: Number(allowance)
      });
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };

  // Fetch token data when contract and owner are available
  React.useEffect(() => {
    if (contract && owner) {
      fetchTokenData();
    }
  }, [contract, owner]);

  const approveAndInvest = async (amount: number, investmentId: string, investCallback: (id: string, amount: number) => Promise<any>) => {
    if (!contract || !owner) {
      console.error("Contract or owner not initialized:", { contract: !!contract, owner });
      throw new Error("Contract or owner not initialized");
    }

    try {
      const tokenDecimals = await contract.decimals();
      const contractAllowance = Number(await contract.allowance(owner, formattedSpender)) / Math.pow(10, tokenDecimals);
      const currentBalance = Number(await contract.balance_of(owner)) / Math.pow(10, tokenDecimals);
      
      const amountInToken = amount * Math.pow(10, tokenDecimals);
      
      console.log("Investment check:", {
        amount,
        allowance: contractAllowance.toString(),
        balance: currentBalance.toString()
      });

      if (currentBalance < amount) {
        throw new Error("Insufficient balance");
      }

      if (contractAllowance >= amount) {
        console.log("Sufficient allowance exists");
        await investCallback(investmentId, amountInToken);
        return;
      }

      console.log("Insufficient allowance, requesting increase");

      const additionalAllowance = amountInToken - contractAllowance;
      const increaseAllowanceCall = contract.populate("increase_allowance", [formattedSpender, additionalAllowance]);
      const approveCall = contract.populate('approve', [formattedSpender, amountInToken]);

      const tx = await sendTransaction([increaseAllowanceCall, approveCall]);
      console.log("Allowance transaction:", tx);

      if (status === "success") {
        await investCallback(investmentId, amountInToken);
      }
    } catch (error) {
      console.error("Error in approveAndInvest:", error);
      throw error;
    }
  };

  return {
    ...tokenData,
    approveAndInvest,
    status,
    isError,
    isIdle,
    isPending,
    isSuccess
  };
};