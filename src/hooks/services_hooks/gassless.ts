import { useCallback, useEffect, useState } from 'react';
import { useAccount } from '@starknet-react/core';
import {
  executeCalls,
  fetchAccountCompatibility,
  fetchAccountsRewards,
  fetchGasTokenPrices,
  GaslessCompatibility,
  GaslessOptions,
  GasTokenPrice,
  getGasFeesInGasToken,
  PaymasterReward,
  SEPOLIA_BASE_URL,
} from '@avnu/gasless-sdk';
import { AccountInterface, Call, EstimateFeeResponse, Provider, stark, transaction } from 'starknet';

// Constants
const NODE_URL = 'https://starknet-sepolia.public.blastapi.io';
const DEFAULT_OPTIONS: GaslessOptions = { baseUrl: SEPOLIA_BASE_URL };

interface GaslessHookOptions extends Partial<GaslessOptions> {
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

interface GaslessHookState {
  isLoading: boolean;
  error: string | undefined;
  transactionHash: string | undefined;
  gasTokenPrices: GasTokenPrice[];
  selectedGasToken: GasTokenPrice | undefined;
  compatibility: GaslessCompatibility | undefined;
  estimatedFees: {
    maxGasTokenAmount: bigint | undefined;
    gasFees: bigint | undefined;
  };
  rewards: {
    hasRewards: boolean;
    paymasterRewards: PaymasterReward[];
  };
}

export const useGasless = (options?: GaslessHookOptions) => {
  const { account } = useAccount();
  const [state, setState] = useState<GaslessHookState>({
    isLoading: false,
    error: undefined,
    transactionHash: undefined,
    gasTokenPrices: [],
    selectedGasToken: undefined,
    compatibility: undefined,
    estimatedFees: {
      maxGasTokenAmount: undefined,
      gasFees: undefined,
    },
    rewards: {
      hasRewards: false,
      paymasterRewards: [],
    },
  });

  const gaslessOptions = { ...DEFAULT_OPTIONS, ...options };

  // Estimate transaction fees
  const estimateCalls = useCallback(
    async (account: AccountInterface, calls: Call[]): Promise<EstimateFeeResponse> => {
      const provider = new Provider({ nodeUrl: NODE_URL });
      const [contractVersion, nonce] = await Promise.all([
        provider.getContractVersion(account.address),
        provider.getNonceForAddress(account.address),
      ]);

      const details = stark.v3Details({ skipValidate: true });
      const invocation = {
        ...details,
        contractAddress: account.address,
        calldata: transaction.getExecuteCalldata(calls, contractVersion.cairo),
        signature: [],
      };

      return provider.getInvokeEstimateFee(
        invocation,
        { ...details, nonce, version: 1 },
        'pending',
        true
      );
    },
    []
  );

  // Initialize gasless data
  useEffect(() => {
    if (!account?.address) return;

    const initGasless = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));

      try {
        const [compatibility, rewards, prices] = await Promise.all([
          fetchAccountCompatibility(account.address, gaslessOptions),
          fetchAccountsRewards(account.address, { ...gaslessOptions, protocol: 'gasless-sdk' }),
          fetchGasTokenPrices(gaslessOptions),
        ]);

        setState(prev => ({
          ...prev,
          gasTokenPrices: prices,
          compatibility,
          rewards: {
            hasRewards: rewards.length > 0,
            paymasterRewards: rewards,
          },
          isLoading: false,
        }));
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to initialize gasless';
        setState(prev => ({ ...prev, error, isLoading: false }));
        options?.onError?.(new Error(error));
      }
    };

    initGasless();
  }, [account?.address, gaslessOptions]);

  // Calculate gas estimation
  const calculateGasEstimation = useCallback(
    async (calls: Call[]) => {
      if (!account || !state.selectedGasToken || !state.compatibility) return;

      setState(prev => ({ ...prev, isLoading: true, error: undefined }));

      try {
        const fees = await estimateCalls(account, calls);
        const estimatedGasFeesInGasToken = getGasFeesInGasToken(
          BigInt(fees.overall_fee),
          state.selectedGasToken,
          BigInt(fees.gas_price!),
          BigInt(fees.data_gas_price ?? '0x1'),
          state.compatibility.gasConsumedOverhead,
          state.compatibility.dataGasConsumedOverhead,
        );

        setState(prev => ({
          ...prev,
          estimatedFees: {
            gasFees: estimatedGasFeesInGasToken,
            maxGasTokenAmount: estimatedGasFeesInGasToken * BigInt(2),
          },
          isLoading: false,
        }));
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to estimate gas';
        setState(prev => ({ ...prev, error, isLoading: false }));
        options?.onError?.(new Error(error));
      }
    },
    [account, state.selectedGasToken, state.compatibility, estimateCalls]
  );

  // Execute transaction
  const execute = useCallback(
    async (calls: Call[]) => {
      if (!account) {
        throw new Error('No account connected');
      }

      setState(prev => ({
        ...prev,
        isLoading: true,
        error: undefined,
        transactionHash: undefined,
      }));

      try {
        const response = await executeCalls(
          account,
          calls,
          {
            gasTokenAddress: state.selectedGasToken?.tokenAddress,
            maxGasTokenAmount: state.estimatedFees.maxGasTokenAmount,
          },
          gaslessOptions
        );

        setState(prev => ({
          ...prev,
          transactionHash: response.transactionHash,
          isLoading: false,
        }));

        options?.onSuccess?.(response.transactionHash);
        return response;
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Transaction failed';
        setState(prev => ({ ...prev, error, isLoading: false }));
        options?.onError?.(new Error(error));
        throw err;
      }
    },
    [account, state.selectedGasToken, state.estimatedFees.maxGasTokenAmount, gaslessOptions]
  );

  const selectGasToken = useCallback((token: GasTokenPrice) => {
    setState(prev => ({ ...prev, selectedGasToken: token }));
  }, []);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    transactionHash: state.transactionHash,
    gasTokenPrices: state.gasTokenPrices,
    selectedGasToken: state.selectedGasToken,
    estimatedFees: state.estimatedFees,
    rewards: state.rewards,
    
    // Actions
    execute,
    selectGasToken,
    calculateGasEstimation,

    // Utils
    isReady: Boolean(account && (state.rewards.hasRewards || state.selectedGasToken)),
    canExecute: Boolean(
      !state.isLoading && 
      (state.rewards.hasRewards || (state.selectedGasToken && state.estimatedFees.maxGasTokenAmount))
    ),
  };
};