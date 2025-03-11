
import { InvestmentAsset, InvestmentAssetConverter } from "@/types/investment";
import { useStarHomeWriteContract } from "../contract_hooks/useStarHomeWriteContract";
import { toast } from "sonner";
import { useAccount } from "@starknet-react/core";
import { useGaslessStarHomeContract } from "../contract_hooks/useStarHomeWriteGassless";
import { useState, useCallback } from 'react';
import { usdTTokenAddress } from "@/utils/constants";

export const useInvestmentWrite = () => {
  const { address } = useAccount();
  const { execute, status } = useStarHomeWriteContract();

  const handleWithdraw = async (investmentId: string, amount: number) => {
    try {
      console.log("Initiating withdrawal:", { investmentId, amount });
      
      const response = await execute("withdraw_from_investment_property", [
        investmentId,
        amount*Math.pow(10,6)
      ]);

      if (response?.status?.isSuccess) {
       
        toast.success("Successfully withdrawn funds");
        return  response;
      } else if (response?.status?.isError) {
        toast.error("Failed to withdraw funds");
        console.error("Withdrawal error:", response?.status?.error);
      }

      return response;
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to withdraw funds");
      throw error;
    }
  };
  const handleMakeInvestment = async (investmentId: string, amount: number) => {
    try {
      console.log("Initiating Investment:", { investmentId, amount });
      
      const response = await execute("invest_in_investment_property", [
        investmentId,
        amount
      ]);

      if (response?.status?.isSuccess) {
        toast.success("Successfully Invested funds");
      } else if (response?.status?.isError) {
        toast.error("Failed to Invest funds");
        console.error("Investing error:", response?.status?.error);
      }

      return response;
    } catch (error) {
      console.error("Investing error", error);
      toast.error("Failed to Invest funds");
      throw error;
    }
  };


   const handleListInvestmentProperty = async (investment: InvestmentAsset) => {
    try {
      console.log("Listing investment property:", investment);
      const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
        investment,
        address 
      );
     const tx =  await execute("list_investment_property", [processedInvestment]);
      toast.success("Investment property listed successfully!");
      
      return tx;
    } catch (error) {
      console.error("Error listing investment property:", error);
      toast.error("Failed to list investment property");
      throw error;
    }
  };

  const handleEditInvestmentProperty = async (investmentId: string, investment: InvestmentAsset) => {
    try {
      console.log("Editing investment property:", { investmentId, investment });
      const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
        investment,
        address
      );
     const tx =   await execute("edit_listed_investment_property", [investmentId, processedInvestment]);
      toast.success("Investment property updated successfully!");
      return tx;
    } catch (error) {
      console.error("Error updating investment property:", error);
      toast.error("Failed to update investment property");
      throw error;
    }
  };

  return {
    handleMakeInvestment,
    handleWithdraw,
    handleListInvestmentProperty,
    handleEditInvestmentProperty,
    status
  };
};


// export const useGaslessInvestmentWrite = () => {
//   const { address } = useAccount();
//   const [isEstimating, setIsEstimating] = useState(false);
  
//   const { 
//     execute, 
//     status, 
//     gasless,
//     prepareTransaction,
//     estimateFees,
//     feeEstimate,
//     resetFeeEstimation
//   } = useGaslessStarHomeContract();

//   const executeWithGaslessHandling = useCallback(async (
//     functionName: string,
//     args: any[],
//     options: ExecuteOptions = {}
//   ) => {
//     try {
//       if (options.autoEstimateGas) {
//         setIsEstimating(true);
//         await estimateFees([prepareTransaction(functionName, args)]);
//       }
      
//       return execute(functionName, args, options);
//     } catch (error) {
//       console.error("Transaction error:", error);
//       toast.error("Transaction failed");
//       throw error;
//     } finally {
//       setIsEstimating(false);
//     }
//   }, [execute, estimateFees, prepareTransaction]);

//   const handleWithdraw = async (investmentId: string, amount: number, useGasless = true) => {
//     return executeWithGaslessHandling(
//       "withdraw_from_investment_property",
//       [investmentId, amount * Math.pow(10, 6)],
//       {
//         enabled: useGasless,
//         maxGasTokenAmount: gasless.maxGasTokenAmount,
//         autoEstimateGas: true
//       }
//     );
//   };

//   const handleMakeInvestment = async (investmentId: string, amount: number, useGasless = true) => {
//     return executeWithGaslessHandling(
//       "invest_in_investment_property",
//       [investmentId, amount],
//       {
//         enabled: useGasless,
//         maxGasTokenAmount: gasless.maxGasTokenAmount,
//         autoEstimateGas: true
//       }
//     );
//   };

//   const handleListInvestmentProperty = async (investment: InvestmentAsset, useGasless = true) => {
//     const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
//       investment,
//       address 
//     );
    
//     return executeWithGaslessHandling(
//       "list_investment_property",
//       [processedInvestment],
//       {
//         enabled: useGasless,
//         maxGasTokenAmount: gasless.maxGasTokenAmount,
//         autoEstimateGas: true
//       }
//     );
//   };

//   const handleEditInvestmentProperty = async (
//     investmentId: string, 
//     investment: InvestmentAsset, 
//     useGasless = true
//   ) => {
//     const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
//       investment,
//       address
//     );
    
//     return executeWithGaslessHandling(
//       "edit_listed_investment_property",
//       [investmentId, processedInvestment],
//       {
//         enabled: useGasless,
//         maxGasTokenAmount: gasless.maxGasTokenAmount,
//         autoEstimateGas: true
//       }
//     );
//   };

//   return {
//     handleMakeInvestment,
//     handleWithdraw,
//     handleListInvestmentProperty,
//     handleEditInvestmentProperty,
//     estimateTransactionFees: (fn: string, args: any[]) => 
//       estimateFees([prepareTransaction(fn, args)]),
//     status,
//     gasless,
//     feeEstimate,
//     isEstimating
//   };
// };

// export const useGaslessInvestmentWrite = () => {
//   const { address } = useAccount();
//   const [isEstimating, setIsEstimating] = useState(false);
  
//   // Use fixed config without any params
//   const { 
//     execute, 
//     status, 
//     gasless, 
//     prepareTransaction,
//     estimateFees,
//     feeEstimate,
//     resetFeeEstimation
//   } = useGaslessStarHomeContract();

//   // Estimate fees for a transaction
//   const estimateTransactionFees = useCallback((functionName: string, args: any[]) => {
//     try {
//       setIsEstimating(true);
      
//       // Prepare the call
//       const call = prepareTransaction(functionName, args);
      
//       // Estimate fees
//       const estimate = estimateFees([call]);
      
//       return {
//         ...estimate,
//         reset: resetFeeEstimation
//       };
//     } catch (error) {
//       console.error("Error estimating fees:", error);
//       toast.error("Failed to estimate transaction fees");
//       return {
//         fee: undefined,
//         gasTokenAmount: undefined,
//         isLoading: false,
//         error: error instanceof Error ? error : new Error("Failed to estimate fees"),
//         reset: resetFeeEstimation
//       };
//     } finally {
//       setIsEstimating(false);
//     }
//   }, [prepareTransaction, estimateFees, resetFeeEstimation]);

//   const handleWithdraw = async (investmentId: string, amount: number, useGasless = true) => {
//     try {
//       console.log("Initiating withdrawal:", { investmentId, amount });
      
//       const response = await execute("withdraw_from_investment_property", [
//         investmentId,
//         amount * Math.pow(10, 6)
//       ], {
//         enabled: useGasless,
//         maxGasTokenAmount: gasless.maxGasTokenAmount || undefined,
//         autoEstimateGas: true
//       });

//       if (response?.status?.isSuccess) {
//         toast.success("Successfully withdrawn funds");
//         return response;
//       } else if (response?.status?.isError) {
//         toast.error("Failed to withdraw funds");
//         console.error("Withdrawal error:", response?.status?.error);
//       }

//       return response;
//     } catch (error) {
//       console.error("Withdrawal error:", error);
//       toast.error("Failed to withdraw funds");
//       throw error;
//     }
//   };

//   const handleMakeInvestment = async (investmentId: string, amount: number, useGasless = true) => {
//     try {
//       console.log("Initiating Investment:", { investmentId, amount });
      
//       const response = await execute("invest_in_investment_property", [
//         investmentId,
//         amount
//       ], {
//         enabled: useGasless,
//         maxGasTokenAmount: gasless.maxGasTokenAmount || undefined,
//         autoEstimateGas: true
//       });

//       if (response?.status?.isSuccess) {
//         toast.success("Successfully Invested funds");
//       } else if (response?.status?.isError) {
//         toast.error("Failed to Invest funds");
//         console.error("Investing error:", response?.status?.error);
//       }

//       return response;
//     } catch (error) {
//       console.error("Investing error", error);
//       toast.error("Failed to Invest funds");
//       throw error;
//     }
//   };

//   const handleListInvestmentProperty = async (investment: InvestmentAsset, useGasless = true) => {
//     try {
//       console.log("Listing investment property:", investment);
//       const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
//         investment,
//         address 
//       );
      
//       const tx = await execute("list_investment_property", [processedInvestment], {
//         enabled: useGasless,
//         maxGasTokenAmount: gasless.maxGasTokenAmount || undefined,
//         autoEstimateGas: true
//       });
      
//       toast.success("Investment property listed successfully!");
//       return tx;
//     } catch (error) {
//       console.error("Error listing investment property:", error);
//       toast.error("Failed to list investment property");
//       throw error;
//     }
//   };

//   const handleEditInvestmentProperty = async (investmentId: string, investment: InvestmentAsset, useGasless = true) => {
//     try {
//       console.log("Editing investment property:", { investmentId, investment });
//       const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
//         investment,
//         address
//       );
      
//       const tx = await execute("edit_listed_investment_property", [investmentId, processedInvestment], {
//         enabled: useGasless,
//         maxGasTokenAmount: gasless.maxGasTokenAmount || undefined,
//         autoEstimateGas: true
//       });
      
//       toast.success("Investment property updated successfully!");
//       return tx;
//     } catch (error) {
//       console.error("Error updating investment property:", error);
//       toast.error("Failed to update investment property");
//       throw error;
//     }
//   };

//   return {
//     handleMakeInvestment,
//     handleWithdraw,
//     handleListInvestmentProperty,
//     handleEditInvestmentProperty,
//     estimateTransactionFees,
//     status,
//     gasless,
//     feeEstimate
//   };
// };
// export const useGaslessInvestmentWrite = () => {
//   const { address } = useAccount();
//   const { execute, status, gasless } = useGaslessStarHomeContract({
//   });

//   const handleWithdraw = async (investmentId: string, amount: number, useGasless = true) => {
//     try {
//       console.log("Initiating withdrawal:", { investmentId, amount });
      
//       const response = await execute("withdraw_from_investment_property", [
//         investmentId,
//         amount * Math.pow(10, 6)
//       ], {
//         enabled: useGasless,
//         gasTokenAddress: usdTTokenAddress,
//         maxGasTokenAmount: gasless.maxGasTokenAmount,
//         autoEstimateGas: true
//       });

//       if (response?.status?.isSuccess) {
//         toast.success("Successfully withdrawn funds");
//         return response;
//       } else if (response?.status?.isError) {
//         toast.error("Failed to withdraw funds");
//         console.error("Withdrawal error:", response?.status?.error);
//       }

//       return response;
//     } catch (error) {
//       console.error("Withdrawal error:", error);
//       toast.error("Failed to withdraw funds");
//       throw error;
//     }
//   };

//   const handleMakeInvestment = async (investmentId: string, amount: number, useGasless = true) => {
//     try {
//       console.log("Initiating Investment:", { investmentId, amount });
      
//       const response = await execute("invest_in_investment_property", [
//         investmentId,
//         amount
//       ], {
//         enabled: useGasless,
//         gasTokenAddress: gasless.selectedGasToken?.tokenAddress,
//         maxGasTokenAmount: gasless.maxGasTokenAmount || undefined,
//         autoEstimateGas: true
//       });

//       if (response?.status?.isSuccess) {
//         toast.success("Successfully Invested funds");
//       } else if (response?.status?.isError) {
//         toast.error("Failed to Invest funds");
//         console.error("Investing error:", response?.status?.error);
//       }

//       return response;
//     } catch (error) {
//       console.error("Investing error", error);
//       toast.error("Failed to Invest funds");
//       throw error;
//     }
//   };

//   const handleListInvestmentProperty = async (investment: InvestmentAsset, useGasless = true) => {
//     try {
//       console.log("Listing investment property:", investment);
//       const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
//         investment,
//         address 
//       );
      
//       const tx = await execute("list_investment_property", [processedInvestment], {
//         enabled: useGasless,
//         gasTokenAddress: gasless.selectedGasToken?.tokenAddress,
//         maxGasTokenAmount: gasless.maxGasTokenAmount || undefined,
//         autoEstimateGas: true
//       });
      
//       toast.success("Investment property listed successfully!");
//       return tx;
//     } catch (error) {
//       console.error("Error listing investment property:", error);
//       toast.error("Failed to list investment property");
//       throw error;
//     }
//   };

//   const handleEditInvestmentProperty = async (investmentId: string, investment: InvestmentAsset, useGasless = true) => {
//     try {
//       console.log("Editing investment property:", { investmentId, investment });
//       const processedInvestment = InvestmentAssetConverter.toStarknetProperty(
//         investment,
//         address
//       );
      
//       const tx = await execute("edit_listed_investment_property", [investmentId, processedInvestment], {
//         enabled: useGasless,
//         gasTokenAddress: gasless.selectedGasToken?.tokenAddress,
//         maxGasTokenAmount: gasless.maxGasTokenAmount || undefined,
//         autoEstimateGas: true
//       });
      
//       toast.success("Investment property updated successfully!");
//       return tx;
//     } catch (error) {
//       console.error("Error updating investment property:", error);
//       toast.error("Failed to update investment property");
//       throw error;
//     }
//   };

//   return {
//     handleMakeInvestment,
//     handleWithdraw,
//     handleListInvestmentProperty,
//     handleEditInvestmentProperty,
//     status,
//     gasless
//   };
// };