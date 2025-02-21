import { useEffect, useMemo, useState } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { Property, PropertyConverter } from "@/types/property";
import { openDB } from "@/utils/indexedDb";
import { Abi, useCall } from "@starknet-react/core";
import { starhomes_abi } from "@/data/starhomes_abi";
import { starhomesContract } from "@/utils/constants";
import { VisitRequestConverter } from "@/types/visit_request";

const PROPERTIES_CACHE_KEY = 'properties';

const savePropertiesToDB = async (properties: any[]) => {
  console.log("[IndexedDB] Saving properties to DB:", properties);
  const db = await openDB();
  const tx = db.transaction(PROPERTIES_CACHE_KEY, 'readwrite');
  const store = tx.objectStore(PROPERTIES_CACHE_KEY);
  await store.clear(); // Clear old data
  await Promise.all(properties.map(property => store.put(property)));
};

const getPropertiesFromDB = async () => {
  console.log("[IndexedDB] Fetching properties from DB");
  const db = await openDB();
  const tx = db.transaction(PROPERTIES_CACHE_KEY, 'readonly');
  const store = tx.objectStore(PROPERTIES_CACHE_KEY);
  const properties = await store.getAll();
  console.log("[IndexedDB] Retrieved properties:", properties);
  return properties;
};


export const usePropertyRead = () => {
  const { data: propertiesData, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });
  console.log("Sale properties:", propertiesData);

 const saleProperties = Array.isArray(propertiesData) ? propertiesData.map((prop: any) => {
    console.log("[usePropertyRead] Converting property:", prop);
    try {
      return PropertyConverter.fromStarknetProperty(prop);
    } catch (error) {
      console.error("[usePropertyRead] Error converting property:", error, prop);
      return null;
    }
  }).filter(Boolean) : [];

 
  return {
    saleProperties,
     isLoading,
      error
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
export const useAgentProperties = (agentId?: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: agentId ? [agentId] : [],
  });

  const properties = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((property: any) => ({
      ...PropertyConverter.fromStarknetProperty(property),
      agentId: property.agentId,
    }));
  }, [data]);

  return { properties, isLoading, error };
};
export const usePropertiesVisitRequest = (propertyId?: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "read_visit_requests",
    args: propertyId ? [propertyId] : [],
  });

  const propertiesVisit = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((propertyVisitsRequests: any) => ({
      ...VisitRequestConverter.fromStarknetVisitRequest(propertyVisitsRequests),
      agentId: propertyVisitsRequests.agentId,
    }));
  }, [data]);

  return { propertiesVisit, isLoading, error };
};










// export const usePropertyRead = () => {
//   const { data, isLoading, error } = useStarHomeReadContract({
//     functionName: "get_sale_properties",
//     args: [],
//     options: {
//       staleTime: 30000,
//       cacheTime: 5 * 60 * 1000,
//       refetchOnWindowFocus: false,
//     }
//   });
//   const saleProperties = useMemo(() => {
//     if (!data || !Array.isArray(data)) {
//       console.log("[Contract] No property data available or invalid format");
//       return [];
//     }  
//     console.log("[Contract] Received raw properties:", data);
//     const properties = data.map((property: any) => 
//       PropertyConverter.fromStarknetProperty(property)
//     );
    
//     console.log("[Contract] Formatted properties:", properties);
//     savePropertiesToDB(properties).catch(console.error);
    
//     return properties;
//   }, [data]);

//   // Load from IndexedDB if contract data is not available
//   useMemo(async () => {
//     if (isLoading && !saleProperties.length) {
//       try {
//         console.log("[Cache] Loading properties from IndexedDB");
//         const cachedProperties = await getPropertiesFromDB();
//         if (cachedProperties?.length) {
//           console.log("[Cache] Found cached properties:", cachedProperties.length);
//           return cachedProperties;
//         }
//       } catch (error) {
//         console.error("[Cache] Error loading from IndexedDB:", error);
//       }
//     }
//   }, [isLoading, saleProperties.length]);

//   return { saleProperties, isLoading, error };
// };

// export const usePropertyReadById = (propertyId: string) => {
//   const { data, isLoading, error } = useStarHomeReadContract({
//     functionName: "get_property",
//     args: propertyId ? [propertyId] : [],
//   });

//   const property = useMemo(() => {
//     if (!data) return null;
//     return PropertyConverter.fromStarknetProperty(data);
//   }, [data]);

//   return { property, isLoading, error };
// };
//   const { data: propertiesData, isLoading, error } = useCall({
//   abi: starhomes_abi as Abi,
//   functionName: "get_sale_properties",
//  address: starhomesContract,
//   args: [],
// });