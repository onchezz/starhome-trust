
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { Property, PropertyConverter } from '@/types/property';
import { UserConverter } from '@/types/starknet_types/user_agent';
import { useEffect, useState } from 'react';


export const usePropertyRead = () => {
  const { data: propertiesData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  console.log("Sale properties:", propertiesData);


  const properties = Array.isArray(propertiesData) ? propertiesData : [];
 
  return {
    properties,
    isLoading,
    error,
  };
};
export const usePropertyReadById = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  
  const { data: propertyData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: [id],
  });

  useEffect(() => {
    if (propertyData && !isLoading) {
      const convertedProperty = PropertyConverter.fromStarknetProperty(propertyData);
      setProperty(convertedProperty);
    }
  }, [propertyData, isLoading]);

  return { 
    property, 
    isLoading, 
    error 
  };
};



// export const useUserReadByAddress = (address: string) => {
//   const { data, isLoading, error } = useStarHomeReadContract({
//     functionName: "get_user_by_address",
//     args: [address],
//   });
//   const agentData = data ? UserConverter.fromStarknetUser(data) : null;
//   console.log("agent data is :", agentData);

//   return {
//     agent: agentData,
//     isLoading,
//     error,
//   };
// };