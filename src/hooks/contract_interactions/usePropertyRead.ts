import { StarknetProperty } from '@/types/starknet_types/propertyStartknet';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { Abi, useContract } from '@starknet-react/core';
import { starhomes_abi } from '@/data/starhomes_abi';
import { starhomesContract } from '@/utils/constants';

// export const usePropertyRead = (args?: never,) => {
//   const { contract } = useContract({
//     abi: starhomes_abi as Abi,
//     address: starhomesContract,
    
//   });

//       const result = contract.call("get_sale_properties", args, {
//   parseRequest: true,
//   parseResponse: true,
//   // formatResponse: formatResponse,
// });
  // const { data: saleProperties, isLoading, error } = useStarHomeReadContract({
  //   functionName: "get_sale_properties",
    
  //   // args: [],
  // });

  // const { data: investmentProperties, isLoading: isLoadingInvestments } = useStarHomeReadContract({
  //   functionName: "get_investment_properties",
  // });


  // return {
  //   result
    // saleProperties,
    // investmentProperties,
    // isLoading: isLoading ,
//     // error,
// import { useStarHomeReadContract } from "@/hooks/contract_hooks/useStarHomeReadContract";
// import { Property } from '@/types/property';

export const usePropertyRead = () => {
  const { data: propertiesData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  console.log("Sale properties:", propertiesData);

  // Ensure we always return an array for properties
  const properties = Array.isArray(propertiesData) ? propertiesData : [];

  return {
    properties,
    isLoading,
    error,
  };
};


