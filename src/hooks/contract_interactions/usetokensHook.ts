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

export const useToken =  (tokenAddress) => {
  const { address: owner } = useAccount();
  const spender = starhomesContract;

  // Ensure addresses are properly formatted with 0x prefix
  const formattedTokenAddress = tokenAddress.startsWith('0x') ? tokenAddress : `0x${tokenAddress}`;
  // const formattedSpender = spender.startsWith('0x') ? spender : `0x${spender}`;
  // const formattedOwner = owner ? (owner.startsWith('0x') ? owner : `0x${owner}`) : '0x0';
const formattedOwner =owner;
const formattedSpender=spender;
  // Read token metadata using universal ERC20 ABI
  // const { data: name } = useReadContract({
  //   functionName: "name",
  //   address: formattedTokenAddress as `0x${string}`,
  //   abi: universalErc20Abi,
  // });

  // const { data: symbol } = useReadContract({
  //   functionName: "symbol",
  //   address: formattedTokenAddress as `0x${string}`,
  //   abi: universalErc20Abi,
  // });

  // const { data: decimals } = useReadContract({
  //   functionName: "decimals",
  //   address: formattedTokenAddress as `0x${string}`,
  //   abi: universalErc20Abi,
  // });

  // Check balance
  // const { data: balance } = useReadContract({
  //   functionName: "balance_of",
  //   address: formattedTokenAddress as `0x${string}`,
  //   abi: universalErc20Abi,
  //   args: [formattedOwner as `0x${string}`],
  // });

  // Check allowance
  // const { data: contractAllowance, error: allowanceError } = useReadContract({
  //   functionName: "allowance",
  //   address: formattedTokenAddress as `0x${string}`,
  //   abi: universalErc20Abi,
  //   args: [formattedOwner, formattedSpender],
  // });

  // Contract interactions
  const { contract } = useContract({
    abi: universalErc20Abi,
    address: formattedTokenAddress,
  });
const name=  contract.name();
   const symbol=  contract.symbol();
  const   decimals= contract.decimals();
   const  balance = contract.balance_of(formattedOwner);
   const  allowance = contract.allowance(formattedOwner, formattedSpender)
    // allowanceError,
  const { sendAsync: sendTransaction,status,isError,isIdle,isPending,isSuccess } = useSendTransaction({});

  const approveAndInvest = async (amount: number, investmentId: string, investCallback: (id: string, amount: number) => Promise<any>) => {
    if (!contract || !owner) {
      throw new Error("Contract or owner not initialized");
    }

    try {

      const tokenDecimals =Number( await contract.decimals());
      const contractAllowance = Number(await contract.allowance(formattedOwner, formattedSpender))/ Math.pow(10, tokenDecimals);
 const  currentBalance = Number( await contract.balance_of(formattedOwner))/ Math.pow(10, tokenDecimals);
    
      // Convert amount to token units based on decimals
      
      
      // decimals ? Number(decimals.toString()) : 18; // Default to 18 if not available
      const amountInToken = amount * Math.pow(10, tokenDecimals);
      //  Math.floor(Number(amount) * Math.pow(10, tokenDecimals));
      
      console.log("Amount before BigInt conversion:", {
        amount,
        amountInTokenUnits: amountInToken,
        tokenDecimals,
        allowance:Number(contractAllowance),
        userbalance: currentBalance

      });


      // Convert to BigInt after ensuring we have an integer
      // const amountBigInt = num.toBigInt(amountInTokenUnits.toString());
      
      console.log("Investment amount details:", {
        originalAmount: amount,
        tokenDecimals,
        amountInTokenUnits: amountInToken.toString(),
        amountBigInt: amountInToken.toString()

      });

      // const currentAllowance = contractAllowance ? Number(contractAllowance)/ Math.pow(10, Number(decimals)) : Number(0);
      // const currentBalance = balance ? Number(balance)/ Math.pow(10, Number(decimals)) : BigInt(0);

      console.log("Investment check:", {
        amount:amount,
        allowance: contractAllowance.toString(),
        balance: currentBalance.toString()
      });

      if (currentBalance < amount) {
        throw new Error("Insufficient balance");
      }

      // Check if current allowance is sufficient
      if (contractAllowance >= amount) {
        console.log("Sufficient allowance exists:", {
          currentAllowance: contractAllowance.toString(),
          requiredAmount: amountInToken.toString()
        });
        // If allowance is sufficient, proceed directly with investment
        await investCallback(investmentId, amountInToken);
        return;
      }

      // If allowance is insufficient, increase allowance first
      console.log("Insufficient allowance, requesting increase:", {
        currentAllowance: contractAllowance.toString(),
        requestingApprovalFor: amountInToken.toString()
      });

      // Calculate the additional allowance needed
      const additionalAllowance = amountInToken - contractAllowance;
      console.log("Increasing allowance by:", additionalAllowance.toString());

      // Use increase_allowance instead of approve
      const increaseAllowanceCall = contract.populate("increase_allowance", [formattedSpender, additionalAllowance]);
      const approveCall =contract.populate('approve',[formattedSpender,amountInToken]);

      const tx = await sendTransaction([increaseAllowanceCall,approveCall]);
      console.log("Allowance increase transaction completed:", tx);
      console.log("Investment approve tx status", {
        isSuccess: isSuccess,
        status: status,
        isError:isError,
        isIdle:isIdle,
        isPending:isPending,
      });
      if (status === "success"){
              await investCallback(investmentId, amountInToken);
      }

      // After increasing allowance, proceed with investment


    } catch (error) {
      console.error("Error in approveAndInvest:", error);
      throw error;
    }
  };

  // const allowance =Number(contractAllowance)/  Math.pow(10, Number(decimals));

  return {
    name,
    symbol,
    decimals,
    balance,
    allowance,
    // allowanceError,
    approveAndInvest,
  };
};

function BigNumberish(contractAllowance: number | bigint | import("starknet").Uint256) {
  throw new Error("Function not implemented.");
}
