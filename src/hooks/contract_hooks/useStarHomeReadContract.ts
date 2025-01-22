import { Abi, useContract } from "@starknet-react/core";
import { useQuery } from "@tanstack/react-query";
import { starhomesContract } from "@/utils/constants";

type AbiInterface = Extract<
  typeof starhomesContract[number],
  { type: "interface"; name: "starhomes::interface::IStarhomesContract" }
>;

type AbiFunctions = AbiInterface extends { items: Array<infer Item> }
  ? Item extends { name: string }
    ? Item["name"]
    : string
  : string;

export const useStarHomeReadContract = ({ 
  functionName, 
  args = [] 
}: { 
  functionName: AbiFunctions;
  args?: any[] 
}) => {
  const { contract } = useContract({
    abi: starhomesContract as unknown as Abi,
    address: starhomesContract,
  });

  return useQuery({
    queryKey: [functionName, args],
    queryFn: async () => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      console.log(`Calling ${functionName} with args:`, args);
      const result = await contract.call(functionName, args);
      console.log(`${functionName} result:`, result);
      return result;
    },
    enabled: !!contract,
  });
};