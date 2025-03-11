// import { useContract, useSendTransaction, useEstimateFees } from "@starknet-react/core";
// import type { Abi, Call, EstimateFeeResponse } from "starknet";
// import { useMemo, useCallback, useState, useEffect } from "react";
// import { starhomesContract, usdTTokenAddress } from "@/utils/constants";
// import { starhomes_abi } from "@/data/starhomes_abi";
// import { useAccount } from "@starknet-react/core";
// import { Provider, AccountInterface, stark, transaction } from "starknet";
// import {
//   executeCalls,
//   fetchAccountCompatibility,
//   fetchAccountsRewards,
//   fetchGasTokenPrices,
//   GaslessCompatibility,
//   GaslessOptions,
//   GasTokenPrice,
//   getGasFeesInGasToken,
//   PaymasterReward,
//   SEPOLIA_BASE_URL
// } from '@avnu/gasless-sdk';

// interface TransactionStatus {
//   isError: boolean;
//   isSuccess: boolean;
//   isPending: boolean;
//   error: Error | null;
//   reset: () => void;
// }

// interface GaslessConfig {
//   protocol?: string; // For filtering rewards by protocol
//   nodeUrl?: string; // For fee estimation
// }

// interface GaslessExecuteOptions {
//   enabled?: boolean;
//   maxGasTokenAmount?: bigint;
//   deploymentData?: any;
//   autoEstimateGas?: boolean;
// }

// interface FeeEstimateResult {
//   fee: EstimateFeeResponse | undefined;
//   gasTokenAmount: bigint | undefined;
//   isLoading: boolean;
//   error: Error | null;
// }

// export function useGaslessStarHomeContract(config: GaslessConfig = {}) {
//   // Use fixed configuration for gasless options
//   const gaslessOptions: GaslessOptions = useMemo(() => ({ baseUrl: SEPOLIA_BASE_URL }), []);
  
//   // Extract other configuration
//   const { 
//     protocol = "starhomes",
//     nodeUrl = "https://starknet-mainnet.public.blastapi.io" 
//   } = config;

//   // Get account from starknet-react
//   const { address, account, isConnected } = useAccount();
//   const [isGasless, setIsGasless] = useState<boolean>(false);
  
//   // Fee estimation state
//   const [estimationCalls, setEstimationCalls] = useState<Call[] | undefined>(undefined);
//   const [lastEstimatedFee, setLastEstimatedFee] = useState<EstimateFeeResponse | undefined>(undefined);
  
//   // Gasless state
//   const [gaslessCompatibility, setGaslessCompatibility] = useState<GaslessCompatibility | null>(null);
//   const [paymasterRewards, setPaymasterRewards] = useState<PaymasterReward[]>([]);
//   const [gasTokenPrices, setGasTokenPrices] = useState<GasTokenPrice[]>([]);
//   const [selectedGasToken, setSelectedGasToken] = useState<GasTokenPrice | null>(null);
//   const [maxGasTokenAmount, setMaxGasTokenAmount] = useState<bigint | null>(null);
//   const [gaslessLoading, setGaslessLoading] = useState<boolean>(true);
//   const [gaslessError, setGaslessError] = useState<Error | null>(null);

//   // Contract state
//   const { contract } = useContract({
//     abi: starhomes_abi as Abi,
//     address: starhomesContract,
//   });

//   // Transaction hook
//   const { sendAsync, error, reset, status } = useSendTransaction({
//     calls: undefined,
//   });
  
//   // Fee estimation hook
//   const { 
//     data: feeEstimateData,
//     error: feeEstimateError,
//     isLoading: isFeeEstimating,
//     refetch: refetchFeeEstimate
//   } = useEstimateFees({
//     calls: estimationCalls,
//     enabled: estimationCalls !== undefined && estimationCalls.length > 0,
//   });
  
//   // Update last estimated fee when fee estimation completes
//   useEffect(() => {
//     if (feeEstimateData && !isFeeEstimating && selectedGasToken) {
//       setLastEstimatedFee(feeEstimateData);
//       console.log("Fee estimate:", feeEstimateData);
      
//       // Auto-calculate gas token amount if we have a gas token selected
//       if (gaslessCompatibility) {
//         try {
//           const gasTokenAmount = getGasFeesInGasToken(
//             BigInt(feeEstimateData.overall_fee),
//             selectedGasToken,
//             BigInt(feeEstimateData.gas_price),
//             BigInt(feeEstimateData.data_gas_price || "0x1"),
//             gaslessCompatibility.gasConsumedOverhead,
//             gaslessCompatibility.dataGasConsumedOverhead
//           );
          
//           // Add 50% buffer for safety
//           const safeAmount = (gasTokenAmount * BigInt(3)) / BigInt(2);
          
//           setMaxGasTokenAmount(safeAmount);
//           console.log(`Estimated gas token amount: ${safeAmount}`);
//         } catch (err) {
//           console.error("Error calculating gas token amount:", err);
//         }
//       }
//     }
//   }, [feeEstimateData, isFeeEstimating, selectedGasToken, gaslessCompatibility]);

//   // Compute transaction status
//   const txStatus: TransactionStatus = useMemo(
//     () => ({
//       isError: status === "error",
//       isSuccess: status === "success",
//       isPending: status === "pending",
//       error,
//       reset,
//     }),
//     [status, error, reset]
//   );

//   // Fetch gasless compatibility for the account and set USDT as default gas token
//   useEffect(() => {
//     if (!address || !isConnected) return;
    
//     setGaslessLoading(true);
//     setGaslessError(null);
    
//     // Fetch account compatibility
//     fetchAccountCompatibility(address, gaslessOptions)
//       .then((compatibility) => {
//         setGaslessCompatibility(compatibility);
//         console.log("Gasless compatibility:", compatibility);
//       })
//       .catch((err) => {
//         console.error("Error fetching gasless compatibility:", err);
//         setGaslessError(err instanceof Error ? err : new Error('Failed to check gasless compatibility'));
//       });
      
//     // Fetch account rewards
//     fetchAccountsRewards(address, { ...gaslessOptions, protocol })
//       .then((rewards) => {
//         setPaymasterRewards(rewards);
//         console.log("Paymaster rewards:", rewards);
//       })
//       .catch((err) => {
//         console.error("Error fetching paymaster rewards:", err);
//       });
      
//     // Fetch gas token prices
//     fetchGasTokenPrices(gaslessOptions)
//       .then((prices) => {
//         setGasTokenPrices(prices);
//         console.log("Gas token prices:", prices);
        
//         // Find USDT token and set it as selected token
//         const usdtToken = prices.find(token => token.tokenAddress === usdTTokenAddress);
//         if (usdtToken) {
//           setSelectedGasToken(usdtToken);
//           console.log("USDT selected as gas token:", usdtToken);
//         } else if (prices.length > 0) {
//           // Fallback to first token if USDT not found
//           setSelectedGasToken(prices[0]);
//           console.log("USDT not found, using first token:", prices[0]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching gas token prices:", err);
//       })
//       .finally(() => {
//         setGaslessLoading(false);
//       });
//   }, [address, isConnected, gaslessOptions, protocol]);

//   // Check if gasless transactions are possible
//   const canUseGasless = useMemo(() => {
//     const hasCompatibleAccount = gaslessCompatibility?.isCompatible === true;
//     const hasPaymentMethod = paymasterRewards.length > 0 || (gasTokenPrices.length > 0 && selectedGasToken !== null);
    
//     return !gaslessLoading && hasCompatibleAccount && hasPaymentMethod;
//   }, [gaslessLoading, gaslessCompatibility, paymasterRewards, gasTokenPrices, selectedGasToken]);

//   // Estimate fees for calls using the useEstimateFees hook
//   const estimateFees = useCallback((calls: Call[]): FeeEstimateResult => {
//     // Set the calls for estimation
//     setEstimationCalls(calls);
    
//     return {
//       fee: lastEstimatedFee,
//       gasTokenAmount: maxGasTokenAmount || undefined,
//       isLoading: isFeeEstimating,
//       error: feeEstimateError
//     };
//   }, [lastEstimatedFee, maxGasTokenAmount, isFeeEstimating, feeEstimateError]);

//   // Reset fee estimation
//   const resetFeeEstimation = useCallback(() => {
//     setEstimationCalls(undefined);
//     setLastEstimatedFee(undefined);
//     setMaxGasTokenAmount(null);
//   }, []);

//   // Handle gasless execution for calls
//   const executeGasless = useCallback(async (
//     calls: Call[],
//     options: GaslessExecuteOptions = {}
//   ) => {
//     if (!account) {
//       throw new Error("Account not connected");
//     }
    
//     // Check if we can use rewards or have a gas token
//     const hasRewards = paymasterRewards.length > 0;
    
//     // Determine gas token address
//     let gasTokenAddress: string | undefined;
//     if (hasRewards) {
//       // If user has rewards, no need for gas token
//       gasTokenAddress = undefined;
//     } else if (selectedGasToken) {
//       // Use the selected gas token (USDT or fallback)
//       gasTokenAddress = selectedGasToken.tokenAddress;
//     } else {
//       // No rewards and no gas token - can't proceed
//       throw new Error("No rewards and no gas token selected");
//     }
    
//     try {
//       // Determine max gas amount
//       let maxAmount = options.maxGasTokenAmount;
      
//       // Auto-estimate gas if needed
//       if (!hasRewards && options.autoEstimateGas !== false && !maxAmount && selectedGasToken && lastEstimatedFee) {
//         try {
//           const gasTokenAmount = getGasFeesInGasToken(
//             BigInt(lastEstimatedFee.overall_fee),
//             selectedGasToken,
//             BigInt(lastEstimatedFee.gas_price),
//             BigInt(lastEstimatedFee.data_gas_price || "0x1"),
//             gaslessCompatibility!.gasConsumedOverhead,
//             gaslessCompatibility!.dataGasConsumedOverhead
//           );
          
//           // Add 50% buffer for safety
//           maxAmount = (gasTokenAmount * BigInt(3)) / BigInt(2);
//           console.log(`Using estimated gas amount: ${maxAmount}`);
//         } catch (err) {
//           console.error("Error estimating gas amount:", err);
//           // If we can't estimate, set a default high value
//           if (selectedGasToken) {
//             const defaultAmount = BigInt(10) ** BigInt(selectedGasToken.decimals); // 10 tokens
//             maxAmount = defaultAmount;
//             console.log(`Using default gas amount: ${maxAmount}`);
//           }
//         }
//       }
      
//       console.log("Executing gasless transaction:", {
//         calls: calls.length,
//         gasTokenAddress,
//         maxGasTokenAmount: maxAmount?.toString(),
//         hasRewards
//       });
      
//       // Execute the transaction
//       const result = await executeCalls(
//         account as AccountInterface,
//         calls,
//         {
//           gasTokenAddress,
//           maxGasTokenAmount: maxAmount,
//           deploymentData: options.deploymentData
//         },
//         gaslessOptions
//       );
      
//       // Reset fee estimation after a successful transaction
//       resetFeeEstimation();
      
//       return { 
//         response: { transaction_hash: result.transactionHash },
//         status: { 
//           ...txStatus, 
//           isSuccess: true,
//           isPending: false
//         } 
//       };
//     } catch (error) {
//       console.error("Error executing gasless transaction:", error);
//       throw error;
//     }
//   }, [account, paymasterRewards, selectedGasToken, lastEstimatedFee, gaslessCompatibility, txStatus, gaslessOptions, resetFeeEstimation]);

//   // Prepare a transaction for estimation and possible execution
//   const prepareTransaction = useCallback((
//     functionName: string, 
//     args: any[]
//   ): Call => {
//     if (!contract) {
//       throw new Error("Contract not initialized");
//     }

//     // Process boolean values
//     const processedArgs = args.map(arg => {
//       if (typeof arg === 'boolean') {
//         return arg ? 1 : 0; // Convert boolean to 1/0 for contract
//       }
//       return arg;
//     });

//     // Create the contract call
//     return contract.populate(functionName, processedArgs);
//   }, [contract]);

//   // Execute a contract function (with optional gasless support)
//   const execute = useCallback(
//     async (functionName: string, args: any[], gaslessOptions?: GaslessExecuteOptions) => {
//       if (!contract) {
//         throw new Error("Contract not initialized");
//       }

//       // Create the contract call
//       const call = prepareTransaction(functionName, args);
//       console.log(`Populated call:`, call);

//       // Determine whether to use gasless transactions
//       const useGasless = 
//         (gaslessOptions?.enabled !== false) && // Not explicitly disabled
//         canUseGasless; // And gasless is available
      
//       setIsGasless(useGasless);

//       try {
//         if (useGasless) {
//           // Use gasless transaction
//           console.log(`Using gasless transaction for ${functionName}`);
//           return executeGasless([call], gaslessOptions);
//         } else {
//           // Use regular transaction
//           console.log(`Using regular transaction for ${functionName}`);
//           const response = await sendAsync([call]);
//           return { response, status: txStatus };
//         }
//       } catch (err) {
//         console.error(`Error executing ${functionName}:`, err);
//         throw err;
//       }
//     },
//     [contract, prepareTransaction, sendAsync, txStatus, canUseGasless, executeGasless]
//   );

//   // Execute multiple contract functions in a batch
//   const executeBatch = useCallback(
//     async (calls: { functionName: string; args: any[] }[], gaslessOptions?: GaslessExecuteOptions) => {
//       if (!contract) {
//         throw new Error("Contract not initialized");
//       }

//       // Create all calls using the contract's populate method
//       const populatedCalls = calls.map(({ functionName, args }) => 
//         prepareTransaction(functionName, args)
//       );
      
//       // Determine whether to use gasless transactions
//       const useGasless = 
//         (gaslessOptions?.enabled !== false) && // Not explicitly disabled
//         canUseGasless; // And gasless is available
      
//       setIsGasless(useGasless);

//       try {
//         if (useGasless) {
//           // Use gasless transaction for the batch
//           console.log(`Using gasless transaction for batch of ${populatedCalls.length} calls`);
//           return executeGasless(populatedCalls, gaslessOptions);
//         } else {
//           // Use regular transaction for the batch
//           console.log(`Using regular transaction for batch of ${populatedCalls.length} calls`);
//           const response = await sendAsync(populatedCalls);
//           return { response, status: txStatus };
//         }
//       } catch (err) {
//         console.error("Error executing batch transaction:", err);
//         throw err;
//       }
//     },
//     [contract, prepareTransaction, sendAsync, txStatus, canUseGasless, executeGasless]
//   );

//   return {
//     contract,
//     execute,
//     executeBatch,
//     prepareTransaction,
//     estimateFees,
//     resetFeeEstimation,
//     feeEstimate: {
//       data: lastEstimatedFee,
//       isLoading: isFeeEstimating,
//       error: feeEstimateError,
//       refetch: refetchFeeEstimate
//     },
//     status: txStatus,
//     gasless: {
//       isAvailable: canUseGasless,
//       isLoading: gaslessLoading,
//       isActive: isGasless,
//       error: gaslessError,
//       rewards: paymasterRewards,
//       gasTokens: gasTokenPrices,
//       selectedGasToken,
//       maxGasTokenAmount,
//       setMaxGasTokenAmount,
//       compatibility: gaslessCompatibility
//     }
//   };
// }
// import { useContract, useSendTransaction, useEstimateFees } from "@starknet-react/core";
// import type { Abi, Call, EstimateFeeResponse } from "starknet";
// import { useMemo, useCallback, useState, useEffect } from "react";
// import { starhomesContract, usdcTokenAddress, usdTTokenAddress } from "@/utils/constants";
// import { starhomes_abi } from "@/data/starhomes_abi";
// import { useAccount } from "@starknet-react/core";
// import { Provider, AccountInterface, stark, transaction } from "starknet";
// import {
//   executeCalls,
//   fetchAccountCompatibility,
//   fetchAccountsRewards,
//   fetchGasTokenPrices,
//   GaslessCompatibility,
//   GaslessOptions,
//   GasTokenPrice,
//   getGasFeesInGasToken,
//   PaymasterReward,
//   SEPOLIA_BASE_URL
// } from '@avnu/gasless-sdk';

// interface TransactionStatus {
//   isError: boolean;
//   isSuccess: boolean;
//   isPending: boolean;
//   error: Error | null;
//   reset: () => void;
// }

// interface GaslessConfig {
//   protocol?: string; // For filtering rewards by protocol
//   nodeUrl?: string; // For fee estimation
// }

// interface GaslessExecuteOptions {
//   enabled?: boolean;
//   maxGasTokenAmount?: bigint;
//   deploymentData?: any;
//   autoEstimateGas?: boolean;
// }

// interface FeeEstimateResult {
//   fee: EstimateFeeResponse | undefined;
//   gasTokenAmount: bigint | undefined;
//   isLoading: boolean;
//   error: Error | null;
// }

// export function useGaslessStarHomeContract(config: GaslessConfig = {}) {
//   // Use fixed configuration for gasless options
//   const gaslessOptions: GaslessOptions = useMemo(() => ({ baseUrl: SEPOLIA_BASE_URL }), []);
  
//   // Extract other configuration
//   const { 
//     protocol = "starhomes",
//     nodeUrl = "https://starknet-mainnet.public.blastapi.io" 
//   } = config;

//   // Get account from starknet-react
//   const { address, account, isConnected } = useAccount();
//   const [isGasless, setIsGasless] = useState<boolean>(false);
  
//   // Fee estimation state
//   const [estimationCalls, setEstimationCalls] = useState<Call[] | undefined>(undefined);
//   const [lastEstimatedFee, setLastEstimatedFee] = useState<EstimateFeeResponse | undefined>(undefined);
  
//   // Gasless state
//   const [gaslessCompatibility, setGaslessCompatibility] = useState<GaslessCompatibility | null>(null);
//   const [paymasterRewards, setPaymasterRewards] = useState<PaymasterReward[]>([]);
//   const [gasTokenPrices, setGasTokenPrices] = useState<GasTokenPrice[]>([]);
//   const [selectedGasToken, setSelectedGasToken] = useState<GasTokenPrice | null>(null);
//   const [maxGasTokenAmount, setMaxGasTokenAmount] = useState<bigint | null>(null);
//   const [gaslessLoading, setGaslessLoading] = useState<boolean>(true);
//   const [gaslessError, setGaslessError] = useState<Error | null>(null);

//   // Contract state
//   const { contract } = useContract({
//     abi: starhomes_abi as Abi,
//     address: starhomesContract,
//   });

//   // Transaction hook
//   const { sendAsync, error, reset, status } = useSendTransaction({
//     calls: undefined,
//   });
  
//   // Fee estimation hook
//   const { 
//     data: feeEstimateData,
//     error: feeEstimateError,
//     isLoading: isFeeEstimating,
//     refetch: refetchFeeEstimate
//   } = useEstimateFees({
//     calls: estimationCalls,
//     enabled: estimationCalls !== undefined && estimationCalls.length > 0,
//   });
  
//   // Update last estimated fee when fee estimation completes
//   useEffect(() => {
//     if (feeEstimateData && !isFeeEstimating && selectedGasToken) {
//       setLastEstimatedFee(feeEstimateData);
//       console.log("Fee estimate:", feeEstimateData);
      
//       // Auto-calculate gas token amount if we have a gas token selected
//       if (gaslessCompatibility) {
//         try {
//           const gasTokenAmount = getGasFeesInGasToken(
//             BigInt(feeEstimateData.overall_fee),
//             selectedGasToken,
//             BigInt(feeEstimateData.gas_price),
//             BigInt(feeEstimateData.data_gas_price || "0x1"),
//             gaslessCompatibility.gasConsumedOverhead,
//             gaslessCompatibility.dataGasConsumedOverhead
//           );
          
//           // Add 50% buffer for safety
//           const safeAmount = (gasTokenAmount * BigInt(3)) / BigInt(2);
          
//           setMaxGasTokenAmount(safeAmount);
//           console.log(`Estimated gas token amount: ${safeAmount}`);
//         } catch (err) {
//           console.error("Error calculating gas token amount:", err);
//         }
//       }
//     }
//   }, [feeEstimateData, isFeeEstimating, selectedGasToken, gaslessCompatibility]);

//   // Compute transaction status
//   const txStatus: TransactionStatus = useMemo(
//     () => ({
//       isError: status === "error",
//       isSuccess: status === "success",
//       isPending: status === "pending",
//       error,
//       reset,
//     }),
//     [status, error, reset]
//   );

//   // Fetch gasless compatibility for the account and set USDT as default gas token
//   useEffect(() => {
//     if (!address || !isConnected) return;
    
//     setGaslessLoading(true);
//     setGaslessError(null);
    
//     // Fetch account compatibility
//     fetchAccountCompatibility(address, gaslessOptions)
//       .then((compatibility) => {
//         setGaslessCompatibility(compatibility);
//         console.log("Gasless compatibility:", compatibility);
//       })
//       .catch((err) => {
//         console.error("Error fetching gasless compatibility:", err);
//         setGaslessError(err instanceof Error ? err : new Error('Failed to check gasless compatibility'));
//       });
      
//     // Fetch account rewards
//     fetchAccountsRewards(address, { ...gaslessOptions, protocol })
//       .then((rewards) => {
//         setPaymasterRewards(rewards);
//         console.log("Paymaster rewards:", rewards);
//       })
//       .catch((err) => {
//         console.error("Error fetching paymaster rewards:", err);
//       });
      
//     // Fetch gas token prices
//     fetchGasTokenPrices(gaslessOptions)
//       .then((prices) => {
//         setGasTokenPrices(prices);
//         console.log("Gas token prices:", prices);
        
//         // Find USDT token and set it as selected token
//         const usdtToken = prices.find(token => token.tokenAddress === usdTTokenAddress);
//         if (usdtToken) {
//           setSelectedGasToken(usdtToken);
//           console.log("USDT selected as gas token:", usdtToken);
//         } else if (prices.length > 0) {
//           // Fallback to first token if USDT not found
//           setSelectedGasToken(prices[0]);
//           console.log("USDT not found, using first token:", prices[0]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching gas token prices:", err);
//       })
//       .finally(() => {
//         setGaslessLoading(false);
//       });
//   }, [address, isConnected, gaslessOptions, protocol]);

//   // Check if gasless transactions are possible
//   const canUseGasless = useMemo(() => {
//     const hasCompatibleAccount = gaslessCompatibility?.isCompatible === true;
//     const hasPaymentMethod = paymasterRewards.length > 0 || gasTokenPrices.length > 0;
    
//     return !gaslessLoading && hasCompatibleAccount && hasPaymentMethod;
//   }, [gaslessLoading, gaslessCompatibility, paymasterRewards, gasTokenPrices]);

//   // Estimate fees for calls using the useEstimateFees hook
//   const estimateFees = useCallback((calls: Call[]): FeeEstimateResult => {
//     // Set the calls for estimation
//     setEstimationCalls(calls);
    
//     return {
//       fee: lastEstimatedFee,
//       gasTokenAmount: maxGasTokenAmount,
//       isLoading: isFeeEstimating,
//       error: feeEstimateError
//     };
//   }, [lastEstimatedFee, maxGasTokenAmount, isFeeEstimating, feeEstimateError]);

//   // Reset fee estimation
//   const resetFeeEstimation = useCallback(() => {
//     setEstimationCalls(undefined);
//     setLastEstimatedFee(undefined);
//     setMaxGasTokenAmount(null);
//   }, []);

//   // Handle gasless execution for calls
//   const executeGasless = useCallback(async (
//     calls: Call[],
//     options: GaslessExecuteOptions = {}
//   ) => {
//     if (!account) {
//       throw new Error("Account not connected");
//     }
    
//     if (!selectedGasToken && paymasterRewards.length === 0) {
//       throw new Error("No gas token selected and no rewards available");
//     }
    
//     try {
//       // Determine max gas amount
//       const maxAmount = options.maxGasTokenAmount;
     
//       console.log("Executing gasless transaction:", {
//         calls: calls.length,
//         usdcTokenAddress,
//         maxGasTokenAmount: maxAmount?.toString(),
//         // hasRewards: paymasterRewards.length > 0
//       });
      
//       // Execute the transaction
//       const result = await executeCalls(
//         account as AccountInterface,
//         calls,
//         {
//            gasTokenAddress:usdcTokenAddress,
//           maxGasTokenAmount: maxAmount,
//           deploymentData: options.deploymentData
//         },
//         gaslessOptions
//       );
      
//       // Reset fee estimation after a successful transaction
//       resetFeeEstimation();
      
//       return { 
//         response: { transaction_hash: result.transactionHash },
//         status: { 
//           ...txStatus, 
//           isSuccess: true,
//           isPending: false
//         } 
//       };
//     } catch (error) {
//       console.error("Error executing gasless transaction:", error);
//       throw error;
//     }
//   }, [account, paymasterRewards, selectedGasToken, txStatus, gaslessOptions, resetFeeEstimation]);

//   // Prepare a transaction for estimation and possible execution
//   const prepareTransaction = useCallback((
//     functionName: string, 
//     args: any[]
//   ): Call => {
//     if (!contract) {
//       throw new Error("Contract not initialized");
//     }

//     // Process boolean values
//     const processedArgs = args.map(arg => {
//       if (typeof arg === 'boolean') {
//         return arg ? 1 : 0; // Convert boolean to 1/0 for contract
//       }
//       return arg;
//     });

//     // Create the contract call
//     return contract.populate(functionName, processedArgs);
//   }, [contract]);

//   // Execute a contract function (with optional gasless support)
//   const execute = useCallback(
//     async (functionName: string, args: any[], gaslessOptions?: GaslessExecuteOptions) => {
//       if (!contract) {
//         throw new Error("Contract not initialized");
//       }

//       // Create the contract call
//       const call = prepareTransaction(functionName, args);
//       console.log(`Populated call:`, call);

//       // Determine whether to use gasless transactions
//       const useGasless = 
//         (gaslessOptions?.enabled !== false) && // Not explicitly disabled
//         canUseGasless; // And gasless is available
      
//       setIsGasless(useGasless);

//       try {
//         if (useGasless) {
//           // Use gasless transaction
//           console.log(`Using gasless transaction for ${functionName}`);
//           return executeGasless([call], gaslessOptions);
//         } else {
//           // Use regular transaction
//           console.log(`Using regular transaction for ${functionName}`);
//           const response = await sendAsync([call]);
//           return { response, status: txStatus };
//         }
//       } catch (err) {
//         console.error(`Error executing ${functionName}:`, err);
//         throw err;
//       }
//     },
//     [contract, prepareTransaction, sendAsync, txStatus, canUseGasless, executeGasless]
//   );

//   // Execute multiple contract functions in a batch
//   const executeBatch = useCallback(
//     async (calls: { functionName: string; args: any[] }[], gaslessOptions?: GaslessExecuteOptions) => {
//       if (!contract) {
//         throw new Error("Contract not initialized");
//       }

//       // Create all calls using the contract's populate method
//       const populatedCalls = calls.map(({ functionName, args }) => 
//         prepareTransaction(functionName, args)
//       );
      
//       // Determine whether to use gasless transactions
//       const useGasless = 
//         (gaslessOptions?.enabled !== false) && // Not explicitly disabled
//         canUseGasless; // And gasless is available
      
//       setIsGasless(useGasless);

//       try {
//         if (useGasless) {
//           // Use gasless transaction for the batch
//           console.log(`Using gasless transaction for batch of ${populatedCalls.length} calls`);
//           return executeGasless(populatedCalls, gaslessOptions);
//         } else {
//           // Use regular transaction for the batch
//           console.log(`Using regular transaction for batch of ${populatedCalls.length} calls`);
//           const response = await sendAsync(populatedCalls);
//           return { response, status: txStatus };
//         }
//       } catch (err) {
//         console.error("Error executing batch transaction:", err);
//         throw err;
//       }
//     },
//     [contract, prepareTransaction, sendAsync, txStatus, canUseGasless, executeGasless]
//   );

//   return {
//     contract,
//     execute,
//     executeBatch,
//     prepareTransaction,
//     estimateFees,
//     resetFeeEstimation,
//     feeEstimate: {
//       data: lastEstimatedFee,
//       isLoading: isFeeEstimating,
//       error: feeEstimateError,
//       refetch: refetchFeeEstimate
//     },
//     status: txStatus,
//     gasless: {
//       isAvailable: canUseGasless,
//       isLoading: gaslessLoading,
//       isActive: isGasless,
//       error: gaslessError,
//       rewards: paymasterRewards,
//       gasTokens: gasTokenPrices,
//       selectedGasToken,
//       maxGasTokenAmount,
//       setMaxGasTokenAmount,
//       compatibility: gaslessCompatibility
//     }
//   };
// }

// import { useContract, useEstimateFees, useSendTransaction } from "@starknet-react/core";
// import type { Abi, Call, EstimateFeeResponse } from "starknet";
// import { useMemo, useCallback, useState, useEffect } from "react";
// import { starhomesContract } from "@/utils/constants";
// import { starhomes_abi } from "@/data/starhomes_abi";
// import { useAccount } from "@starknet-react/core";
// import { Provider, AccountInterface, stark, transaction } from "starknet";
// import {
//   executeCalls,
//   fetchAccountCompatibility,
//   fetchAccountsRewards,
//   fetchGasTokenPrices,
//   GaslessCompatibility,
//   GaslessOptions,
//   GasTokenPrice,
//   getGasFeesInGasToken,
//   PaymasterReward,
//   SEPOLIA_BASE_URL,
// } from '@avnu/gasless-sdk';

// interface TransactionStatus {
//   isError: boolean;
//   isSuccess: boolean;
//   isPending: boolean;
//   error: Error | null;
//   reset: () => void;
// }

// interface GaslessConfig {
//   baseUrl?: string;
//   apiKey?: string;
//   apiPublicKey?: string;
//   protocol?: string; // For filtering rewards by protocol
//   nodeUrl?: string; // For fee estimation
// }

// interface GaslessExecuteOptions {
//   enabled?: boolean;
//   gasTokenAddress?: string;
//   maxGasTokenAmount?: bigint;
//   deploymentData?: any;
//   autoEstimateGas?: boolean;
// }

// export function useGaslessStarHomeContract(config: GaslessConfig = {}) {
//   // Extract configuration
//   const { 
//     baseUrl = "https://api.avnu.fi", 
//     // apiKey, 
//     // apiPublicKey, 
//     protocol = "starhomes",
//     nodeUrl = "https://starknet-mainnet.public.blastapi.io" 
//   } = config;
// const gaslessOptions: GaslessOptions = useMemo(() => ({ baseUrl: SEPOLIA_BASE_URL }), []);
//   const { address, account, isConnected } = useAccount();
//   const [isGasless, setIsGasless] = useState<boolean>(false);
  
//   // Gasless state
//   const [gaslessCompatibility, setGaslessCompatibility] = useState<GaslessCompatibility | null>(null);
//   const [paymasterRewards, setPaymasterRewards] = useState<PaymasterReward[]>([]);
//   const [gasTokenPrices, setGasTokenPrices] = useState<GasTokenPrice[]>([]);
//   const [selectedGasToken, setSelectedGasToken] = useState<GasTokenPrice | null>(null);
//   const [maxGasTokenAmount, setMaxGasTokenAmount] = useState<bigint | null>(null);
//   const [gaslessLoading, setGaslessLoading] = useState<boolean>(true);
//   const [gaslessError, setGaslessError] = useState<Error | null>(null);

//   // Contract state
//   const { contract } = useContract({
//     abi: starhomes_abi as Abi,
//     address: starhomesContract,
//   });

//   // Transaction hook
//   const { sendAsync, error, reset, status } = useSendTransaction({
//     calls: undefined,
//   });

//   // Compute transaction status
//   const txStatus: TransactionStatus = useMemo(
//     () => ({
//       isError: status === "error",
//       isSuccess: status === "success",
//       isPending: status === "pending",
//       error,
//       reset,
//     }),
//     [status, error, reset]
//   );

//   // Fetch gasless compatibility for the account
//   useEffect(() => {
//     if (!address || !isConnected) return;
    
//     setGaslessLoading(true);
//     setGaslessError(null);
    
//     // Fetch account compatibility
//     fetchAccountCompatibility(address, gaslessOptions)
//       .then((compatibility) => {
//         setGaslessCompatibility(compatibility);
//         console.log("Gasless compatibility:", compatibility);
//       })
//       .catch((err) => {
//         console.error("Error fetching gasless compatibility:", err);
//         setGaslessError(err instanceof Error ? err : new Error('Failed to check gasless compatibility'));
//       });
      
//     // Fetch account rewards
//     fetchAccountsRewards(address, { ...gaslessOptions, protocol })
//       .then((rewards) => {
//         setPaymasterRewards(rewards);
//         console.log("Paymaster rewards:", rewards);
//       })
//       .catch((err) => {
//         console.error("Error fetching paymaster rewards:", err);
//       });
      
//     // Fetch gas token prices
//     fetchGasTokenPrices(gaslessOptions)
//       .then((prices) => {
//         setGasTokenPrices(prices);
//         console.log("Gas token prices:", prices);
        
//         // Auto-select first gas token if available
//         if (prices.length > 0) {
//           setSelectedGasToken(prices[0]);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching gas token prices:", err);
//       })
//       .finally(() => {
//         setGaslessLoading(false);
//       });
//   }, [address, isConnected, gaslessOptions, protocol]);

//   // Check if gasless transactions are possible
//   const canUseGasless = useMemo(() => {
//     const hasCompatibleAccount = gaslessCompatibility?.isCompatible === true;
//     const hasPaymentMethod = paymasterRewards.length > 0 || gasTokenPrices.length > 0;
    
//     return !gaslessLoading && hasCompatibleAccount && hasPaymentMethod;
//   }, [gaslessLoading, gaslessCompatibility, paymasterRewards, gasTokenPrices]);

//   // Estimate transaction fees
// //   const estimateFees = useCallback(async (calls: Call[]): Promise<EstimateFeeResponse> => {
// //     if (!account || !address) {
// //       throw new Error("Account not connected");
// //     }
    
// //     try {
// //       // Create a provider for estimation
// //       const provider = new Provider({ nodeUrl });
      
// //       // Get contract version and nonce
// //       const contractVersion = await provider.getContractVersion(address);
// //       const nonce = await provider.getNonceForAddress(address);
      
// //       // Prepare invocation details
// //       const details = stark.v3Details({ skipValidate: true });
// //       const invocation = {
// //         ...details,
// //         contractAddress: address,
// //         calldata: transaction.getExecuteCalldata(calls, contractVersion.cairo),
// //         signature: [],
// //       };
      
// //       // Get fee estimate
// //       return provider.getInvokeEstimateFee(invocation, { ...details, nonce, version: 1 }, 'pending', true);
// //     } catch (error) {
// //       console.error("Error estimating fees:", error);
// //       throw error;
// //     }
// //   }, [account, address, nodeUrl]);



//   // Calculate gas token amount for a transaction
//   const calculateGasAmount = useCallback(async (
//     calls: Call[],
//     gasTokenAddress: string
//   ): Promise<bigint> => {
//     if (!gaslessCompatibility) {
//       throw new Error("Account compatibility not available");
//     }

//     // Find the specified gas token
//     const gasToken = gasTokenPrices.find(token => token.tokenAddress === gasTokenAddress);
//     if (!gasToken) {
//       throw new Error(`Gas token not found: ${gasTokenAddress}`);
//     }
    
//     try {
//       // Estimate the gas fees
//       const fees = await estimateFees(calls);
      
//       // Calculate gas fees in the gas token with overhead
//       const estimatedAmount = getGasFeesInGasToken(
//         BigInt(fees.overall_fee),
//         gasToken,
//         BigInt(fees.gas_price),
//         BigInt(fees.data_gas_price || "0x1"),
//         gaslessCompatibility.gasConsumedOverhead,
//         gaslessCompatibility.dataGasConsumedOverhead
//       );
      
//       // Add a buffer (multiply by 1.5 for safety)
//       return (estimatedAmount * BigInt(3)) / BigInt(2);
//     } catch (error) {
//       console.error("Error calculating gas amount:", error);
//       throw error;
//     }
//   }, [gaslessCompatibility, gasTokenPrices, estimateFees]);

//   // Handle gasless execution for a single call
//   const executeGasless = useCallback(async (
//     calls: Call[],
//     options: GaslessExecuteOptions = {}
//   ) => {
//     if (!account) {
//       throw new Error("Account not connected");
//     }
    
//     try {
//       // Determine gas payment method
//       let gasTokenAddress = options.gasTokenAddress;
//       let maxAmount = options.maxGasTokenAmount;
      
//       // If user has rewards, no need for gas token
//       const hasRewards = paymasterRewards.length > 0;
      
//       if (!hasRewards && !gasTokenAddress && selectedGasToken) {
//         // Use selected gas token if none specified
//         gasTokenAddress = selectedGasToken.tokenAddress;
//       }
      
//       // Auto-estimate gas if needed
//       if (options.autoEstimateGas !== false && !maxAmount && gasTokenAddress) {
//         try {
//           maxAmount = await calculateGasAmount(calls, gasTokenAddress);
//           console.log(`Estimated max gas amount: ${maxAmount}`);
//           setMaxGasTokenAmount(maxAmount);
//         } catch (err) {
//           console.warn("Failed to estimate gas, using default:", err);
//         }
//       }
      
//       console.log("Executing gasless transaction:", {
//         calls: calls.length,
//         gasTokenAddress,
//         maxGasTokenAmount: maxAmount?.toString(),
//         hasRewards
//       });
      
//       // Execute the transaction
//       const result = await executeCalls(
//         account as AccountInterface,
//         calls,
//         {
//           gasTokenAddress,
//           maxGasTokenAmount: maxAmount,
//           deploymentData: options.deploymentData
//         },
//         gaslessOptions
//       );
      
//       return { 
//         response: { transaction_hash: result.transactionHash },
//         status: { 
//           ...txStatus, 
//           isSuccess: true,
//           isPending: false
//         } 
//       };
//     } catch (error) {
//       console.error("Error executing gasless transaction:", error);
//       throw error;
//     }
//   }, [account, paymasterRewards, selectedGasToken, calculateGasAmount, txStatus, gaslessOptions]);

//   // Execute a contract function (with optional gasless support)
//   const execute = useCallback(
//     async (functionName: string, args: any[], gaslessOptions?: GaslessExecuteOptions) => {
//       if (!contract) {
//         throw new Error("Contract not initialized");
//       }

//       // Process boolean values
//       const processedArgs = args.map(arg => {
//         if (typeof arg === 'boolean') {
//           return arg ? 1 : 0; // Convert boolean to 1/0 for contract
//         }
//         return arg;
//       });

//       // Create the contract call
//       const call = contract.populate(functionName, processedArgs);
//       console.log(`Populated call:`, call);

//       // Determine whether to use gasless transactions
//       const useGasless = 
//         (gaslessOptions?.enabled !== false) && // Not explicitly disabled
//         canUseGasless; // And gasless is available
      
//       setIsGasless(useGasless);

//       try {
//         if (useGasless) {
//           // Use gasless transaction
//           console.log(`Using gasless transaction for ${functionName}`);
//           return executeGasless([call], gaslessOptions);
//         } else {
//           // Use regular transaction
//           console.log(`Using regular transaction for ${functionName}`);
//           const response = await sendAsync([call]);
//           return { response, status: txStatus };
//         }
//       } catch (err) {
//         console.error(`Error executing ${functionName}:`, err);
//         throw err;
//       }
//     },
//     [contract, sendAsync, txStatus, canUseGasless, executeGasless]
//   );

//   // Execute multiple contract functions in a batch
//   const executeBatch = useCallback(
//     async (calls: { functionName: string; args: any[] }[], gaslessOptions?: GaslessExecuteOptions) => {
//       if (!contract) {
//         throw new Error("Contract not initialized");
//       }

//       // Create all calls using the contract's populate method
//       const populatedCalls = calls.map(({ functionName, args }) => {
//         // Process boolean values
//         const processedArgs = args.map(arg => {
//           if (typeof arg === 'boolean') {
//             return arg ? 1 : 0;
//           }
//           return arg;
//         });
        
//         return contract.populate(functionName, processedArgs);
//       });
      
//       // Determine whether to use gasless transactions
//       const useGasless = 
//         (gaslessOptions?.enabled !== false) && // Not explicitly disabled
//         canUseGasless; // And gasless is available
      
//       setIsGasless(useGasless);

//       try {
//         if (useGasless) {
//           // Use gasless transaction for the batch
//           console.log(`Using gasless transaction for batch of ${populatedCalls.length} calls`);
//           return executeGasless(populatedCalls, gaslessOptions);
//         } else {
//           // Use regular transaction for the batch
//           console.log(`Using regular transaction for batch of ${populatedCalls.length} calls`);
//           const response = await sendAsync(populatedCalls);
//           return { response, status: txStatus };
//         }
//       } catch (err) {
//         console.error("Error executing batch transaction:", err);
//         throw err;
//       }
//     },
//     [contract, sendAsync, txStatus, canUseGasless, executeGasless]
//   );

//   return {
//     contract,
//     execute,
//     executeBatch,
//     status: txStatus,
//     gasless: {
//       isAvailable: canUseGasless,
//       isLoading: gaslessLoading,
//       isActive: isGasless,
//       error: gaslessError,
//       rewards: paymasterRewards,
//       gasTokens: gasTokenPrices,
//       selectedGasToken,
//       selectGasToken: setSelectedGasToken,
//       maxGasTokenAmount,
//       setMaxGasTokenAmount,
//       compatibility: gaslessCompatibility,
//       estimateFees,
//       calculateGasAmount
//     }
//   };
// }

import { useContract, useSendTransaction } from "@starknet-react/core";
import type { Abi, Call } from "starknet";
import { useMemo, useCallback, useState } from "react";
import { starhomesContract } from "@/utils/constants";
import { starhomes_abi } from "@/data/starhomes_abi";

import { useAccount } from "@starknet-react/core";
import { useGasless } from "../services_hooks/gassless";
import { useGaslessTransaction } from "../services_hooks/useAvnuGasless";

interface TransactionStatus {
  isError: boolean;
  isSuccess: boolean;
  isPending: boolean;
  error: Error | null;
  reset: () => void;
}

interface GaslessOptions {
  enabled?: boolean;
  gasTokenAddress?: string;
  maxGasTokenAmount?: bigint;
}

export function useGaslessStarHomeContract(gaslessConfig = {}) {
  const { address, account } = useAccount();
  const [isGasless, setIsGasless] = useState<boolean>(false);
  
  // Initialize the gasless hook
  const { 
    status: gaslessStatus, 
    compatibility, 
    rewards, 
    gasTokens, 
    loading: gaslessLoading, 
    executeTransaction,
    calculateGasTokenAmount
  } = useGasless(address, gaslessConfig);

  // Initialize the contract hook
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
  });

  // Initialize the transaction hook
  const { sendAsync, error, reset, status } = useSendTransaction({
    calls: undefined,
  });

  // Compute transaction status
  const txStatus: TransactionStatus = useMemo(
    () => ({
      isError: status === "error",
      isSuccess: status === "success",
      isPending: status === "pending",
      error,
      reset,
    }),
    [status, error, reset]
  );

  // Initialize gasless transaction hook
  const { sendGaslessTransaction } = useGaslessTransaction([]);

  // Check if gasless transactions are possible
  const canUseGasless = useMemo(() => {
    return (
      !gaslessLoading &&
      gaslessStatus?.status === true &&
      compatibility?.isCompatible === true &&
      (gasTokens.length > 0 || rewards.length > 0)
    );
  }, [gaslessLoading, gaslessStatus, compatibility, gasTokens, rewards]);

  // Execute a contract function (with optional gasless support)
  const execute = useCallback(
    async (functionName: string, args: any[], gaslessOptions?: GaslessOptions) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      // Process boolean values
      const processedArgs = args.map(arg => {
        if (typeof arg === 'boolean') {
          return arg ? 1 : 0; // Convert boolean to 1/0 for contract
        }
        return arg;
      });

      // Create the contract call
      const call = contract.populate(functionName, processedArgs);
      console.log(`Populated call:`, call);

      // Determine whether to use gasless transactions
      const useGasless = 
        (gaslessOptions?.enabled !== false) && // Not explicitly disabled
        canUseGasless; // And gasless is available
      
      setIsGasless(useGasless);

      try {
        if (useGasless) {
          // Get the account from the wallet
       
          if (!account) {
            throw new Error("Wallet not connected");
          }

          // Use gasless transaction
          console.log(`Using gasless transaction for ${functionName}`);
          
          // Default to the first available gas token if not specified
          const gasTokenAddress = gaslessOptions?.gasTokenAddress || gasTokens[0]?.tokenAddress;
          let maxGasTokenAmount = gaslessOptions?.maxGasTokenAmount;
          
          // If the amount is not specified, try to calculate it (optional step)
          if (!maxGasTokenAmount && gasTokenAddress) {
            try {
              // Estimate gas fees (this is a placeholder - you need to implement gas estimation)
              const estimatedGasFeesInETH = BigInt("1000000000000000"); // Example value
              maxGasTokenAmount = await calculateGasTokenAmount(estimatedGasFeesInETH, gasTokenAddress);
            } catch (err) {
              console.warn("Failed to estimate gas amount, using default:", err);
              // Use a reasonable default if estimation fails
              maxGasTokenAmount = BigInt("1000000000000000000"); // Example default
            }
          }

          // Execute the gasless transaction
          const result = await executeTransaction(account, [call], {
            maxGasTokenAmount
          });
 
        
          
          return { 
            response: { transaction_hash: result.transactionHash },
            status: { 
              ...txStatus, 
              isSuccess: true,
              isPending: false
            } 
          };
        } else {
          // Use regular transaction
          console.log(`Using regular transaction for ${functionName}`);
          const response = await sendAsync([call]);
          return { response, status: txStatus };
        }
      } catch (err) {
        console.error(`Error executing ${functionName}:`, err);
        throw err;
      }
    },
    [contract, sendAsync, txStatus, canUseGasless, executeTransaction, gasTokens, calculateGasTokenAmount]
  );

  // Execute multiple contract functions in a batch
  const executeBatch = useCallback(
    async (calls: { functionName: string; args: any[] }[], gaslessOptions?: GaslessOptions) => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      // Create all calls using the contract's populate method
      const populatedCalls = calls.map(({ functionName, args }) => {
        // Process boolean values
        const processedArgs = args.map(arg => {
          if (typeof arg === 'boolean') {
            return arg ? 1 : 0;
          }
          return arg;
        });
        
        return contract.populate(functionName, processedArgs);
      });
      
      // Determine whether to use gasless transactions
      const useGasless = 
        (gaslessOptions?.enabled !== false) && // Not explicitly disabled
        canUseGasless; // And gasless is available
      
      setIsGasless(useGasless);

      try {
        if (useGasless) {
          // Get the account from the wallet
        
          if (!account) {
            throw new Error("Wallet not connected");
          }

          // Use gasless transaction for the batch
          console.log(`Using gasless transaction for batch of ${populatedCalls.length} calls`);
          
          // Default to the first available gas token if not specified
          const gasTokenAddress = gaslessOptions?.gasTokenAddress || gasTokens[0]?.tokenAddress;
          let maxGasTokenAmount = gaslessOptions?.maxGasTokenAmount;
          
          // If the amount is not specified, try to calculate it (optional step)
          if (!maxGasTokenAmount && gasTokenAddress) {
            try {
              // For batch calls, you might want to use a higher estimate
              const estimatedGasFeesInETH = BigInt("2000000000000000") * BigInt(populatedCalls.length); 
              maxGasTokenAmount = await calculateGasTokenAmount(estimatedGasFeesInETH, gasTokenAddress);
            } catch (err) {
              console.warn("Failed to estimate gas amount for batch, using default:", err);
              // Use a reasonable default if estimation fails
              maxGasTokenAmount = BigInt("1000000000000000000") * BigInt(populatedCalls.length);
            }
          }

          // Execute the gasless batch transaction
          const result = await executeTransaction(account, populatedCalls, {
            gasTokenAddress,
            maxGasTokenAmount
          });
          
          return { 
            response: { transaction_hash: result.transactionHash },
            status: { 
              ...txStatus, 
              isSuccess: true,
              isPending: false
            } 
          };
        } else {
          // Use regular transaction for the batch
          console.log(`Using regular transaction for batch of ${populatedCalls.length} calls`);
          const response = await sendAsync(populatedCalls);
          return { response, status: txStatus };
        }
      } catch (err) {
        console.error("Error executing batch transaction:", err);
        throw err;
      }
    },
    [contract, sendAsync, txStatus, canUseGasless, executeTransaction, gasTokens, calculateGasTokenAmount]
  );

  return {
    contract,
    execute,
    executeBatch,
    status: txStatus,
    gasless: {
      isAvailable: canUseGasless,
      isLoading: gaslessLoading,
      isActive: isGasless,
      rewards,
      gasTokens
    }
  };
}
