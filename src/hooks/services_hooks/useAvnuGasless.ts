
import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import {
  executeCalls,
  fetchGasTokenPrices,
  GaslessOptions,
  GasTokenPrice,
  getGasFeesInGasToken,
  SEPOLIA_BASE_URL,
} from '@avnu/gasless-sdk';
import { Provider, stark, transaction, Call } from 'starknet';

interface GaslessTxOptions {
  gasTokenAddress?: string;
  nodeUrl?: string;
  // Add other options as needed.
}
const options: GaslessOptions = { baseUrl: SEPOLIA_BASE_URL };
export function useGaslessTransaction(calls?: Call[], ) {
  const { account } = useAccount();
  const [txData, setTxData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [gasTokenPrice, setGasTokenPrice] = useState<GasTokenPrice>(null);
  const [maxGasTokenAmount, setMaxGasTokenAmount] = useState<bigint | undefined>(undefined);

  // Use provided nodeUrl or default to a public Sepolia endpoint.
  const NODE_URL =  'https://starknet-sepolia.public.blastapi.io';

  // Fetch gas token prices on mount and set a default token.
  useEffect(() => {
    async function fetchPrices() {
      try {
        const prices = await fetchGasTokenPrices(options);
        if (prices && prices.length > 0) {
          setGasTokenPrice(prices[0]);
        }
      } catch (err) {
        console.error('Error fetching gas token prices:', err);
      }
    }
    fetchPrices();
  }, []);

  // Estimate fees whenever the account, calls, or gas token changes.
  const estimateFees = useCallback(async () => {
    if (!account || !calls || !gasTokenPrice) return;
    try {
      const provider = new Provider({ nodeUrl: NODE_URL });
      const contractVersion = await provider.getContractVersion(account.address);
      const nonce = await provider.getNonceForAddress(account.address);
      const details = stark.v3Details({ skipValidate: true });
      const invocation = {
        ...details,
        contractAddress: account.address,
        calldata: transaction.getExecuteCalldata(calls, contractVersion.cairo),
        signature: [],
      };
      const feeResp = await provider.getInvokeEstimateFee(
        invocation,
        { ...details, nonce, version: 1 },
        'pending',
        true
      );
      // For simplicity, we use overhead factors of 1.
      const estimatedFee = getGasFeesInGasToken(
        BigInt(feeResp.overall_fee),
        gasTokenPrice,
        BigInt(feeResp.gas_price!),
        BigInt(feeResp.data_gas_price ?? '0x1'),
        //  gaslessCompatibility.gasConsumedOverhead,
        // gaslessCompatibility.dataGasConsumedOverhead,
        BigInt(1),
        BigInt(1)
      );
      // Set maxGasTokenAmount with a safety margin (e.g., twice the estimate)
      setMaxGasTokenAmount(estimatedFee * BigInt(2));
    } catch (err) {
      console.error('Fee estimation error:', err);
      setError(err);
    }
  }, [account, calls, gasTokenPrice, NODE_URL]);

  useEffect(() => {
    estimateFees();
  }, [estimateFees]);

  // Execute the gasless transaction using AVNU's executeCalls.
  const sendGaslessTransaction = useCallback(async () => {
    if (!account || !calls) {
      setError(new Error('Missing account or transaction calls.'));
      return;
    }
    setLoading(true);
    try {
      const txResult = await executeCalls(
        account,
        calls,
        {
          gasTokenAddress:  gasTokenPrice?.tokenAddress,
          maxGasTokenAmount,
        },
        options
      );
      setTxData(txResult);
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [account, calls, gasTokenPrice, maxGasTokenAmount]);

  return {
    sendGaslessTransaction,
    txData,
    loading,
    error,
    gasTokenPrice,
    setGasTokenPrice, // For UI selection if needed.
    maxGasTokenAmount,
  };
}

// import { useState, useCallback } from 'react';
// import { useAccount } from '@starknet-react/core';
// import { fetchGasTokenPrices, executeCalls } from '@avnu/gasless-sdk';
// import type { Call } from 'starknet';

// interface GaslessTxOptions {
//   gasTokenAddress?: string;
//   // You can extend this interface with other options as needed
// }

// export function useGaslessTransaction(calls?: Call[], options?: GaslessTxOptions) {
//   const { account } = useAccount();
//   const [txData, setTxData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<any>(null);

//   const sendGaslessTransaction = useCallback(async () => {
//     if (!account) {
//       setError(new Error('No connected account.'));
//       return;
//     }
//     if (!calls || calls.length === 0) {
//       setError(new Error('No transaction calls provided.'));
//       return;
//     }
//     setIsLoading(true);
//     try {
//       // Step 1: Retrieve gas token prices via the AVNU SDK.
//       const gasTokenPrices = await fetchGasTokenPrices();

//       // Step 2: Estimate the gas fee for the transaction calls.
//       // (Assumes your account contract has an estimateInvokeFee method.)
//       const feeEstimate = await account.estimateInvokeFee(calls, { blockIdentifier: 'latest', skipValidate: true });
//       const estimatedGasFees = feeEstimate.overall_fee;

//       // Step 3: Determine which gas token to use.
//       const gasTokenAddress = options?.gasTokenAddress || (gasTokenPrices.length > 0 ? gasTokenPrices[0].tokenAddress : null);
//       if (!gasTokenAddress) {
//         throw new Error('No gas token available.');
//       }

//       // Step 4: Execute the calls via the AVNU gasless SDK.
//       const txResult = await executeCalls(account, calls, {
//         gasTokenAddress,
//         gasTokenPrices,
//         estimatedGasFees,
//       });

//       setTxData(txResult);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [account, calls, options]);

//   return { sendGaslessTransaction, txData, isLoading, error };
// }
