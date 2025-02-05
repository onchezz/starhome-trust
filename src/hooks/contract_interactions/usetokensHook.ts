import { useState ,useEffect, useCallback } from "react";
import {
  useReadContract,
  useBalance,
  useSendTransaction,
  useContract,
  useAccount,
  jsonRpcProvider
} from "@starknet-react/core";
import { rpcProvideUr, starhomesContract } from "@/utils/constants";
import { universalErc20Abi } from "@/data/universalTokenabi";
import { BigNumberish, Provider, RpcProvider } from 'starknet';
import { num ,TransactionStatus} from "starknet";
import { Chain } from "@starknet-react/chains";

// Note: Do not mark the hook as async!
export const useToken = (tokenAddress: string) => {
  const provider = new RpcProvider({ nodeUrl: `${rpcProvideUr}` });
  // Get the owner from your account hook.
  const { address: owner } = useAccount();
  // Assume starhomesContract is defined/imported from somewhere.
  const spender = starhomesContract;

  // Ensure token address has 0x prefix.
  const formattedTokenAddress = tokenAddress as `0x${string}`;
  const formattedOwner = owner;
  const formattedSpender = spender;

  // Initialize the contract instance.
  const { contract } = useContract({
    abi: universalErc20Abi,
    address: formattedTokenAddress,
    provider: provider,
  });

  // Local state for token metadata and values.
  const [tokenData, setTokenData] = useState<{
    name: BigNumberish;
    symbol: BigNumberish;
    decimals: BigNumberish;
    balance: any; // adjust type as needed
    allowance: any; // adjust type as needed
  }>({
    name: null,
    symbol: null,
    decimals: null,
    balance: null,
    allowance: null,
  });

  // Fetch token metadata and balance when contract/owner changes.
  useEffect(() => {
    if (!contract || !formattedOwner) return;

    const fetchTokenData = async () => {
      try {
        const [name, symbol, decimals, balance, allowance] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
          contract.balance_of(formattedOwner),
          contract.allowance(formattedOwner, formattedSpender),
        ]);
        setTokenData({ name, symbol, decimals, balance, allowance:Number(allowance)/Math.pow(10, Number(decimals)) });
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    fetchTokenData();
  }, [contract, formattedOwner, formattedSpender]);

  // Set up transaction sending (assumed from some hook).
  const { sendAsync: sendTransaction, status, isError, isIdle, isPending, isSuccess } =
    useSendTransaction({});

  // The approveAndInvest function is defined using useCallback so that it has a stable identity.
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
        const tokenDecimals = Number(await contract.decimals());
        const allowanceRaw = await contract.allowance(formattedOwner, formattedSpender);
        const contractAllowance = Number(allowanceRaw) / Math.pow(10, tokenDecimals);
        const currentBalanceRaw = await contract.balance_of(formattedOwner);
        const currentBalance = Number(currentBalanceRaw) / Math.pow(10, tokenDecimals);

        // Convert the requested amount to token units.
        const amountInToken = amount * Math.pow(10, tokenDecimals);

        if (currentBalance < amount) {
          throw new Error('Insufficient balance');
        }

        // If the current allowance is sufficient, invest directly.
        if (contractAllowance >= amount) {
          await investCallback(investmentId, amountInToken);
          return;
        }

        // Otherwise, calculate additional allowance needed.
        const additionalAllowance = amountInToken - contractAllowance;
        // Populate contract calls for increasing allowance and approving.
        const increaseAllowanceCall = await contract.populate('increase_allowance', [
          formattedSpender,
          additionalAllowance,
        ]);
        const approveCall = await contract.populate('approve', [formattedSpender, amountInToken]);

        const tx = await sendTransaction([increaseAllowanceCall, approveCall]);
        console.log('Transaction completed:', tx);
        // Optionally, check tx.status (or other flags) before proceeding.
        
          await investCallback(investmentId, amountInToken);
        
      } catch (error) {
        console.error('Error in approveAndInvest:', error);
        throw error;
      }
    },
    [contract, formattedOwner, formattedSpender, sendTransaction]
  );

  return {
    ...tokenData,
    approveAndInvest,
    transactionStatus: { status, isError, isIdle, isPending, isSuccess },
  };
};

// export const useToken =  async (tokenAddress) => {
//   // Initialize provider (for example, on testnet)


//   const { address: owner } = useAccount();
//   const spender = starhomesContract;

//   // Ensure addresses are properly formatted with 0x prefix
//   const formattedTokenAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
//   // const formattedSpender = spender.startsWith('0x') ? spender : `0x${spender}`;
//   // const formattedOwner = owner ? (owner.startsWith('0x') ? owner : `0x${owner}`) : '0x0';
// const formattedOwner =owner;
// const formattedSpender=spender;
//   // Read token metadata using universal ERC20 ABI
//   // const { data: name } = useReadContract({
//   //   functionName: "name",
//   //   address: formattedTokenAddress as `0x${string}`,
//   //   abi: universalErc20Abi,
//   // });

//   // const { data: symbol } = useReadContract({
//   //   functionName: "symbol",
//   //   address: formattedTokenAddress as `0x${string}`,
//   //   abi: universalErc20Abi,
//   // });

//   // const { data: decimals } = useReadContract({
//   //   functionName: "decimals",
//   //   address: formattedTokenAddress as `0x${string}`,
//   //   abi: universalErc20Abi,
//   // });

//   // Check balance
//   // const { data: balance } = useReadContract({
//   //   functionName: "balance_of",
//   //   address: formattedTokenAddress as `0x${string}`,
//   //   abi: universalErc20Abi,
//   //   args: [formattedOwner as `0x${string}`],
//   // });

//   // Check allowance
//   // const { data: contractAllowance, error: allowanceError } = useReadContract({
//   //   functionName: "allowance",
//   //   address: formattedTokenAddress as `0x${string}`,
//   //   abi: universalErc20Abi,
//   //   args: [formattedOwner, formattedSpender],
//   // });

//   // Contract interactions

  
//   const { contract } = useContract({
//     abi: universalErc20Abi,
//     address: formattedTokenAddress,
//   });
// const name=  await contract.name();
//    const symbol=  await contract.symbol();
//   const   decimals= await contract.decimals();
//    const  balance = await contract.balance_of(formattedOwner);
//    const  allowance = await contract.allowance(formattedOwner, formattedSpender)
//     // allowanceError,
//   const { sendAsync: sendTransaction,status,isError,isIdle,isPending,isSuccess } = useSendTransaction({});

//   const approveAndInvest = async (amount: number, investmentId: string, investCallback: (id: string, amount: number) => Promise<any>) => {
//     if (!contract || !owner) {
//       throw new Error("Contract or owner not initialized");
//     }

//     try {

//       const tokenDecimals =Number( await contract.decimals());
//       const contractAllowance = Number(await contract.allowance(formattedOwner, formattedSpender))/ Math.pow(10, tokenDecimals);
//  const  currentBalance = Number( await contract.balance_of(formattedOwner))/ Math.pow(10, tokenDecimals);
    
//       // Convert amount to token units based on decimals
      
      
//       // decimals ? Number(decimals.toString()) : 18; // Default to 18 if not available
//       const amountInToken = amount * Math.pow(10, tokenDecimals);
//       //  Math.floor(Number(amount) * Math.pow(10, tokenDecimals));
      
//       console.log("Amount before BigInt conversion:", {
//         amount,
//         amountInTokenUnits: amountInToken,
//         tokenDecimals,
//         allowance:Number(contractAllowance),
//         userbalance: currentBalance

//       });


//       // Convert to BigInt after ensuring we have an integer
//       // const amountBigInt = num.toBigInt(amountInTokenUnits.toString());
      
//       console.log("Investment amount details:", {
//         originalAmount: amount,
//         tokenDecimals,
//         amountInTokenUnits: amountInToken.toString(),
//         amountBigInt: amountInToken.toString()

//       });

//       // const currentAllowance = contractAllowance ? Number(contractAllowance)/ Math.pow(10, Number(decimals)) : Number(0);
//       // const currentBalance = balance ? Number(balance)/ Math.pow(10, Number(decimals)) : BigInt(0);

//       console.log("Investment check:", {
//         amount:amount,
//         allowance: contractAllowance.toString(),
//         balance: currentBalance.toString()
//       });

//       if (currentBalance < amount) {
//         throw new Error("Insufficient balance");
//       }

//       // Check if current allowance is sufficient
//       if (contractAllowance >= amount) {
//         console.log("Sufficient allowance exists:", {
//           currentAllowance: contractAllowance.toString(),
//           requiredAmount: amountInToken.toString()
//         });
//         // If allowance is sufficient, proceed directly with investment
//         await investCallback(investmentId, amountInToken);
//         return;
//       }

//       // If allowance is insufficient, increase allowance first
//       console.log("Insufficient allowance, requesting increase:", {
//         currentAllowance: contractAllowance.toString(),
//         requestingApprovalFor: amountInToken.toString()
//       });

//       // Calculate the additional allowance needed
//       const additionalAllowance = amountInToken - contractAllowance;
//       console.log("Increasing allowance by:", additionalAllowance.toString());

//       // Use increase_allowance instead of approve
//       const increaseAllowanceCall = contract.populate("increase_allowance", [formattedSpender, additionalAllowance]);
//       const approveCall =contract.populate('approve',[formattedSpender,amountInToken]);

//       const tx = await sendTransaction([increaseAllowanceCall,approveCall]);
//       console.log("Allowance increase transaction completed:", tx);
//        console.log("Allowance increase transaction completed:", tx.transaction_hash);
//       console.log("Investment approve tx status", {
//         isSuccess: isSuccess,
//         status: status,
//         isError:isError,
//         isIdle:isIdle,
//         isPending:isPending,
//       });
     
//       if (status === "success"){
//               await investCallback(investmentId, amountInToken);
//       }

//       // After increasing allowance, proceed with investment


//     } catch (error) {
//       console.error("Error in approveAndInvest:", error);
//       throw error;
//     }
//   };

//   // const allowance =Number(contractAllowance)/  Math.pow(10, Number(decimals));

//   return {
//     name,
//     symbol,
//     decimals,
//     balance,
//     allowance,
//     // allowanceError,
//     approveAndInvest,
//   };
// };



