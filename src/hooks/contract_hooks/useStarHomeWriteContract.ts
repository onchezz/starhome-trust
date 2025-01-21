import { useContract, useSendTransaction } from "@starknet-react/core";
import { ABI } from "@/data/starhomes_abi";

const CONTRACT_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

export const useStarHomeWriteContract = ({ functionName }: { functionName: string }) => {
  const { contract } = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  });

  const { sendTransaction, isLoading: isPending } = useSendTransaction();

  const sendAsync = async ({ args }: { args: any[] }) => {
    if (!contract) {
      throw new Error("Contract not initialized");
    }

    console.log(`Calling ${functionName} with args:`, args);
    const call = contract.populate(functionName, args);
    const result = await sendTransaction({ calls: [call] });
    console.log(`${functionName} result:`, result);
    return result;
  };

  return {
    sendAsync,
    isPending,
  };
};