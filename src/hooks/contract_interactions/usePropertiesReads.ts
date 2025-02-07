import { useMemo } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { PropertyConverter } from "@/types/property";
import { openDB } from "@/utils/indexedDb";

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
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
    args: [],
    options: {
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  });

  const saleProperties = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      console.log("[Contract] No property data available or invalid format");
      return [];
    }
    
    console.log("[Contract] Received raw properties:", data);
    const properties = data.map((property: any) => 
      PropertyConverter.fromStarknetProperty(property)
    );
    
    console.log("[Contract] Formatted properties:", properties);
    savePropertiesToDB(properties).catch(console.error);
    
    return properties;
  }, [data]);

  // Load from IndexedDB if contract data is not available
  useMemo(async () => {
    if (isLoading && !saleProperties.length) {
      try {
        console.log("[Cache] Loading properties from IndexedDB");
        const cachedProperties = await getPropertiesFromDB();
        if (cachedProperties?.length) {
          console.log("[Cache] Found cached properties:", cachedProperties.length);
          return cachedProperties;
        }
      } catch (error) {
        console.error("[Cache] Error loading from IndexedDB:", error);
      }
    }
  }, [isLoading, saleProperties.length]);

  return { saleProperties, isLoading, error };
};

export const usePropertyReadById = (propertyId: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: propertyId ? [propertyId] : [],
  });

  const property = useMemo(() => {
    if (!data) return null;
    return PropertyConverter.fromStarknetProperty(data);
  }, [data]);

  return { property, isLoading, error };
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
