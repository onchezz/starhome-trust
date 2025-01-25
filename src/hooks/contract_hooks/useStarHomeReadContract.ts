/* eslint-disable @typescript-eslint/no-explicit-any */
import { Abi, useContract } from "@starknet-react/core";
import { useQuery } from "@tanstack/react-query";
import { starhomes_abi } from "@/data/starhomes_abi";
import { starhomesContract } from "@/utils/constants";

export const useStarHomeReadContract = ({ 
  functionName, 
 formatResponse,
 
  args = [] 
}: { 
  functionName: string;
formatResponse?: any;

  args?: any[] 
}) => {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
  });

  return useQuery({
    queryKey: [functionName, args],
    queryFn: async () => {
      if (!contract) {
        throw new Error("Contract not initialized");
      }
      console.log(`Calling ${functionName} with args:`, args);
      
      const result = await contract.call(functionName, args, {
  parseRequest: true,
  parseResponse: true,
  formatResponse: formatResponse,
});
//       const result = await contract.functionName( args, {
//   parseRequest: true,
//   parseResponse: true,
//   // formatResponse: typeInterface,
// });
      console.log(`${functionName} result:`, result);
      return result;
    },
    enabled: !!contract,
  });
};