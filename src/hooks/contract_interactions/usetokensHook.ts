import { useState, useCallback, useRef } from "react";
import {
  useContract,
  useAccount,
  useSendTransaction,
} from "@starknet-react/core";
import { rpcProvideUr, starhomesContract } from "@/utils/constants";
import { universalErc20Abi } from "@/data/universalTokenabi";
import { RpcProvider, shortString } from 'starknet';
import { saveTokenData, getTokenData } from "@/utils/indexedDb";
import { useTransactionStatus } from "../useTransactionStatus";
import { toast } from "sonner";

export const useToken = (tokenAddress: string) => {
  const provider = new RpcProvider({ nodeUrl: `${rpcProvideUr}` });
  const { address: owner } = useAccount();
  const spender = starhomesContract;
  const formattedTokenAddress = tokenAddress as `0x${string}`;
  const formattedOwner = owner;
  const formattedSpender = spender;
  const fetchInProgress = useRef(false);
  const { checkTransaction } = useTransactionStatus();
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  

  const { contract } = useContract({
    abi: universalErc20Abi,
    address: formattedTokenAddress,
    provider: provider,
  });

  const [tokenData, setTokenData] = useState<{
    name: string | null;
    symbol: string | null;
    decimals: number | null;
    balance: string | null;
    allowance: string | null;
  }>({
    name: null,
    symbol: null,
    decimals: null,
    balance: null,
    allowance: null,
  });

  const fetchAndCacheTokenData = useCallback(async () => {
    if (!contract || !formattedOwner || fetchInProgress.current) return;

    try {
      fetchInProgress.current = true;
      console.log('Fetching token data for:', {
        tokenAddress: formattedTokenAddress,
        ownerAddress: formattedOwner
      });

      // First check cache
      const cachedData = await getTokenData(formattedTokenAddress, formattedOwner);
      
      if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) { // 5 minutes cache
        console.log(`Using cached token data:, ${cachedData}`);
        setTokenData({
          name: cachedData.name,
          symbol: cachedData.symbol,
          decimals: cachedData.decimals,
          balance: cachedData.balance,
          allowance: cachedData.allowance,
        });
        return;
      }

      // If no cache or expired, fetch fresh data
      const [name, symbol, decimals, balance,allowance ] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.balance_of(formattedOwner),
        contract.allowance(formattedOwner, formattedSpender),
      ]);
     
      const newData = {
        name:shortString.decodeShortString(name.toString()) ,
        symbol:shortString.decodeShortString(symbol.toString()),
        decimals: Number(decimals),
        balance: (Number(balance)/ Math.pow(10, Number(decimals))).toString() ,
        allowance:(Number(allowance)/ Math.pow(10, Number(decimals))).toString(),
      };

      // Save to cache
      await saveTokenData(formattedTokenAddress, formattedOwner, newData);
      
      setTokenData(newData);
      console.log('Fetched and cached new token data:', newData);
    } catch (error) {
      console.error('Error fetching token data:', error);
    } finally {
      fetchInProgress.current = false;
    }
  }, [contract, formattedOwner, formattedSpender, formattedTokenAddress]);

  const { sendAsync: sendTransaction } = useSendTransaction({});

  const approveAndInvest = useCallback(
    async (
      amount: number,
      investmentId: string,
      investCallback: (id: string, amountInTokenUnits: number) => Promise<any>
    ) => {
      if (!contract || !formattedOwner) {
        throw new Error('Contract or owner not initialized');
      }

      try {

        const [ allowance] = await Promise.all([contract.allowance(formattedOwner, formattedSpender)]);
        console.log(`fetched  allowance ${allowance}`)

        const tokenDecimals = tokenData.decimals || 18;
        const amountInToken = Number(amount * Math.pow(10, tokenDecimals));
        const currentAllowance = allowance ? Number(allowance): Number(0);
        const currentBalance = tokenData.balance ? Number(tokenData.balance) : Number(0);

        console.log(`converted   allowance ${currentAllowance}`)
        console.log(`converted   balance  ${currentBalance}`)
        console.log(`converted   token amount   ${amountInToken}`)

           console.log("Allowances and balance:", {
          tokenDecimals,
          amountInToken,
          currentAllowance,
          currentBalance
        });

        if (currentBalance < amount) {
          await fetchAndCacheTokenData();
          
          console.log(`Balance ${currentBalance} is less than token amount ${amountInToken}`);
          // throw new Error('Insufficient balance');
          toast.error('Insufficient balance')
        }

        if (currentAllowance >= amountInToken) {
        
          await investCallback(investmentId, Number(amountInToken));
       
          return;
        }

        const additionalAllowance = amountInToken - currentAllowance;
        const increaseAllowanceCall = await contract.populate('increase_allowance', [
          formattedSpender,
          additionalAllowance
        ]);
        const approveCall = await contract.populate('approve', [
          formattedSpender, 
          amountInToken
        ]);

        setIsWaitingApproval(true);
        console.log('Sending approval transaction...');
        
        const tx = await sendTransaction([increaseAllowanceCall, approveCall]);
        console.log('Approval transaction sent:', tx);

        // Wait for transaction confirmation
        const txStatus = await checkTransaction(tx.transaction_hash);
        console.log('Transaction status:', txStatus);
        setIsWaitingApproval(false);

        if (txStatus.isSuccess) {
          // Refresh token data after successful approval
          await fetchAndCacheTokenData();
          console.log('Token data refreshed, proceeding with investment');
          // Only proceed with investment if approval was successful
        
          await investCallback(investmentId, Number(amountInToken));
       
        } else {
         
          toast.error("Transaction failed");
          throw new Error('Transaction failed');
        }
      } catch (error) {
        setIsWaitingApproval(false);
       
        console.error('Error in approveAndInvest:', error);
        throw error;
      }
    },
    [contract,  formattedOwner, tokenData.decimals, tokenData.balance, formattedSpender, sendTransaction, checkTransaction, fetchAndCacheTokenData]
  );

  return {
    ...tokenData,
    approveAndInvest,
    allowance: tokenData.allowance,
    refreshTokenData: fetchAndCacheTokenData,
    isWaitingApproval,
  };
};