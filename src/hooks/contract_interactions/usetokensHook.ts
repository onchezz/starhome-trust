import { useState, useEffect, useCallback } from "react";
import { useContract, useAccount } from "@starknet-react/core";
import { rpcProvideUr, starhomesContract } from "@/utils/constants";
import { universalErc20Abi } from "@/data/universalTokenabi";
import { RpcProvider } from 'starknet';
import { saveTokenAllowance, getTokenAllowance } from "@/utils/indexedDb";

export const useToken = (tokenAddress: string) => {
  const provider = new RpcProvider({ nodeUrl: `${rpcProvideUr}` });
  const { address: owner } = useAccount();
  const spender = starhomesContract;
  const formattedTokenAddress = tokenAddress as `0x${string}`;
  const formattedOwner = owner;
  const formattedSpender = spender;

  const [tokenData, setTokenData] = useState({
    name: null,
    symbol: null,
    decimals: null,
    balance: null,
    allowance: null,
  });

  const { contract } = useContract({
    abi: universalErc20Abi,
    address: formattedTokenAddress,
    provider: provider,
  });

  // Fetch token metadata and cached allowance
  useEffect(() => {
    if (!contract || !formattedOwner) return;

    const fetchTokenData = async () => {
      try {
        const [name, symbol, decimals, balance] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
          contract.balance_of(formattedOwner),
        ]);

        // Try to get cached allowance first
        const cachedAllowance = await getTokenAllowance(formattedTokenAddress, formattedOwner);
        console.log('Cached allowance:', cachedAllowance);

        setTokenData({ 
          name, 
          symbol, 
          decimals, 
          balance, 
          allowance: cachedAllowance || '0'
        });
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, [contract, formattedOwner, formattedTokenAddress]);

  const updateAllowance = async () => {
    if (!contract || !formattedOwner || !formattedSpender) return;
    
    try {
      const allowance = await contract.allowance(formattedOwner, formattedSpender);
      console.log('Fetched new allowance:', allowance);
      
      // Save the new allowance locally
      await saveTokenAllowance(formattedTokenAddress, formattedOwner, allowance.toString());
      
      setTokenData(prev => ({
        ...prev,
        allowance: allowance.toString()
      }));
      
      return allowance;
    } catch (error) {
      console.error('Error updating allowance:', error);
      return null;
    }
  };

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
        console.log('Starting approveAndInvest process:', { amount, investmentId });
        
        // Force update allowance before proceeding
        const currentAllowance = await updateAllowance();
        const tokenDecimals = Number(await contract.decimals());
        const amountInToken = amount * Math.pow(10, tokenDecimals);

        console.log('Current state:', {
          currentAllowance: currentAllowance?.toString(),
          amountInToken: amountInToken.toString(),
          tokenDecimals
        });

        if (currentAllowance && Number(currentAllowance) >= amountInToken) {
          console.log('Sufficient allowance exists, proceeding with investment');
          await investCallback(investmentId, amountInToken);
          return;
        }

        console.log('Insufficient allowance, requesting approval');
        const approveCall = await contract.populate('approve', [
          formattedSpender,
          amountInToken.toString()
        ]);

        const tx = await contract.approve(formattedSpender, amountInToken.toString());
        console.log('Approval transaction:', tx);

        // Update cached allowance after approval
        await updateAllowance();
        
        // Proceed with investment
        await investCallback(investmentId, amountInToken);
      } catch (error) {
        console.error('Error in approveAndInvest:', error);
        throw error;
      }
    },
    [contract, formattedOwner, formattedSpender]
  );

  return {
    ...tokenData,
    approveAndInvest,
    updateAllowance
  };
};