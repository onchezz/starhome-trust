
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { Property, PropertyConverter } from '@/types/property';
import { UserConverter } from '@/types/user';
import { useEffect, useState } from 'react';


export const usePropertyRead = () => {
  const { data: propertiesData, isLoading: salePropertiesLoading, error:salePropertiesError } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });
  const { data: investmentPropertiesData, isLoading:investmentPropertiesLoading, error:investmentPropertiesError} = useStarHomeReadContract({
    functionName: "get_investment_properties",
  });


  console.log("Sale properties:", propertiesData);


  const saleProperties = Array.isArray(propertiesData) ? propertiesData : [];
  const investmentProperties = Array.isArray(investmentPropertiesData) ? investmentPropertiesData : [];
 
  return {
    saleProperties,
    salePropertiesLoading,
    salePropertiesError,
    investmentProperties,
    investmentPropertiesLoading,
    investmentPropertiesError
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


