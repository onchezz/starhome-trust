import { useState, useEffect, useCallback } from 'react';
import { 
  fetchGaslessStatus, 
  fetchAccountCompatibility, 
  fetchAccountsRewards, 
  fetchGasTokenPrices,
  fetchBuildTypedData,
  fetchExecuteTransaction,
  executeCalls,
  getGasFeesInGasToken,
  GaslessOptions,
  GaslessStatus,
  GaslessCompatibility,
  PaymasterReward,
  GasTokenPrice,
} from '@avnu/gasless-sdk';
import { AccountInterface, Call, Signature } from 'starknet';

// Define hook configuration options
interface UseGaslessConfig {
  // Base URL for the AVNU API
  baseUrl?: string;
  // API key for sponsored transactions
  apiKey?: string;
  // AVNU public key for response signature verification
  apiPublicKey?: string;
  // Default gas token address (optional)
  defaultGasToken?: string;
  // Account class hash (needed for non-deployed accounts)
  accountClassHash?: string;
}

// Hook return type
interface UseGaslessReturn {
  // Service status
  status: GaslessStatus | null;
  // Account compatibility information
  compatibility: GaslessCompatibility | null;
  // Active rewards for the account
  rewards: PaymasterReward[];
  // Available gas tokens with prices
  gasTokens: GasTokenPrice[];
  // Check if the service is loading
  loading: boolean;
  // Any error that occurred
  error: Error | null;
  // Execute transactions with gasless feature
  executeTransaction: (
    account: AccountInterface,
    calls: Call[],
    options?: {
      gasTokenAddress?: string;
      maxGasTokenAmount?: bigint;
      deploymentData?: any;
    }
  ) => Promise<{ transactionHash: string }>;
  // Calculate gas fees in the selected token
  calculateGasTokenAmount: (
    estimatedGasFeesInETH: bigint,
    gasTokenAddress: string
  ) => Promise<bigint>;
  // Refresh the hook data
  refresh: () => void;
}

/**
 * React hook for using AVNU's gasless service
 * @param accountAddress The user's account address
 * @param config Configuration options for the gasless service
 * @returns Gasless service methods and state
 */
export const useGasless = (
  accountAddress: string | undefined,
  config: UseGaslessConfig = {}
): UseGaslessReturn => {
  // Extract configuration
  const { baseUrl, apiKey, apiPublicKey, defaultGasToken, accountClassHash } = config;
  
  // Create gasless options
  const gaslessOptions: GaslessOptions = {
    baseUrl,
    apiKey,
    apiPublicKey
  };

  // Set up state
  const [status, setStatus] = useState<GaslessStatus | null>(null);
  const [compatibility, setCompatibility] = useState<GaslessCompatibility | null>(null);
  const [rewards, setRewards] = useState<PaymasterReward[]>([]);
  const [gasTokens, setGasTokens] = useState<GasTokenPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch gasless service status, account compatibility, rewards, and gas tokens
  const fetchData = useCallback(async () => {
    if (!accountAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch service status
      const statusResult = await fetchGaslessStatus(gaslessOptions);
      setStatus(statusResult);
      
      // If service is available and account address is provided
      if (statusResult.status && accountAddress) {
        // Fetch account compatibility
        const compatibilityResult = await fetchAccountCompatibility(accountAddress, gaslessOptions);
        setCompatibility(compatibilityResult);
        
        // Fetch account rewards
        const rewardsResult = await fetchAccountsRewards(accountAddress, gaslessOptions);
        setRewards(rewardsResult);
      }
      
      // Fetch gas token prices
      const gasTokensResult = await fetchGasTokenPrices(gaslessOptions);
      setGasTokens(gasTokensResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      console.error('Error fetching gasless data:', err);
    } finally {
      setLoading(false);
    }
  }, [accountAddress, gaslessOptions]);

  // Initialize data
  useEffect(() => {
    fetchData();
    
    // Abort controller for fetch requests
    const controller = new AbortController();
    
    // Add abort signal to options
    gaslessOptions.abortSignal = controller.signal;
    
    // Cleanup function
    return () => {
      controller.abort();
    };
  }, [accountAddress, fetchData]);

  // Calculate gas fees in the selected token
  const calculateGasTokenAmount = useCallback(async (
    estimatedGasFeesInETH: bigint,
    gasTokenAddress: string
  ): Promise<bigint> => {
    if (!compatibility) {
      throw new Error('Account compatibility not available');
    }
    
    // Find the specified gas token
    const gasToken = gasTokens.find(token => token.tokenAddress === gasTokenAddress);
    if (!gasToken) {
      throw new Error('Gas token not found');
    }
    
    // Calculate gas fees in the gas token with overhead
    return getGasFeesInGasToken(
      estimatedGasFeesInETH,
      gasToken,
      BigInt(0), // Default gas cost (adjust if needed)
      BigInt(0), // Default data gas cost (adjust if needed)
      compatibility.gasConsumedOverhead,
      compatibility.dataGasConsumedOverhead
    );
  }, [compatibility, gasTokens]);

  // Execute transaction with gasless feature
  const executeTransaction = useCallback(async (
    account: AccountInterface,
    calls: Call[],
    options: {
      gasTokenAddress?: string;
      maxGasTokenAmount?: bigint;
      deploymentData?: any;
    } = {}
  ) => {
    if (!accountAddress) {
      throw new Error('Account address is required');
    }
    
    const gasTokenAddress = options.gasTokenAddress || defaultGasToken;
    const maxGasTokenAmount = options.maxGasTokenAmount;
    
    if (!gasTokenAddress && !apiKey && rewards.length === 0) {
      throw new Error('Either a gas token, API key, or reward is required for gasless transactions');
    }
    
    // Execute the calls
    return executeCalls(
      account,
      calls,
      {
        gasTokenAddress,
        maxGasTokenAmount,
        deploymentData: options.deploymentData
      },
      {
        ...gaslessOptions,
        apiPublicKey,
      }
    );
  }, [accountAddress, defaultGasToken, apiKey, rewards, gaslessOptions, apiPublicKey]);

  return {
    status,
    compatibility,
    rewards,
    gasTokens,
    loading,
    error,
    executeTransaction,
    calculateGasTokenAmount,
    refresh: fetchData
  };
};