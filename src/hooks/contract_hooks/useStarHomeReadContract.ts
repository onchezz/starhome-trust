/* eslint-disable @typescript-eslint/no-explicit-any */
import { Abi, useCall, useContract, useReadContract } from "@starknet-react/core";
import { useQuery } from "@tanstack/react-query";
import { starhomes_abi } from "@/data/starhomes_abi";
import { starhomesContract } from "@/utils/constants";
import { Property } from "@/types/property";

export const useStarHomeReadContract = ({ 
  functionName, 
  args = [] 
}: { 
  functionName: string;
  args?: any[] 
}) => {
  const { contract } = useContract({
    abi: starhomes_abi as Abi,
    address: starhomesContract,
  });
  // return  useCall({abi: starhomes_abi as Abi,address:starhomesContract, functionName:functionName, args:args });
const{data, isLoading,error}= useReadContract({ abi: starhomes_abi as Abi,address:starhomesContract, functionName:functionName, args:args});
// if (!isLoading){
//   const formatAnswer = (answer: any) => {
//         if (functionName === "get_sale_properties") {
//           return answer.map((property: Property) => ({
//             ...property,
//             price: BigInt(property.price),
//             owner: BigInt(property.agent_id),
//             // isForSale: property.isForSale,
//           }));
//         }
//         return answer;
//       }
//         const tdata = formatAnswer(data);
// console.log("Data:", tdata);
// }
 
//   return useQuery({
//     queryKey: [functionName, args],
//     queryFn: async () => {
//       if (!contract) {
//         throw new Error("Contract not initialized");


//       }
//       // console.log(`Calling ${functionName} with args:`, args);

     
      
// //       const result = await contract.call(functionName, args,
// //          {
// //   parseRequest: true,
// //   parseResponse: true,
// //   formatResponse: formatAnswer,
// // }
// // );

//       console.log(`${functionName} result:`, result);
//       return result;
//     },
//     enabled: !!contract,
//   });

return {data, isLoading, error};
};