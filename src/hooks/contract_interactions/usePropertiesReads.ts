import { useMemo } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { PropertyConverter } from "@/types/property";
import { openDB } from "@/utils/indexedDb";

const PROPERTIES_CACHE_KEY = 'properties';

const savePropertiesToDB = async (properties: any[]) => {
  const db = await openDB();
  const tx = db.transaction(PROPERTIES_CACHE_KEY, 'readwrite');
  const store = tx.objectStore(PROPERTIES_CACHE_KEY);
  await store.clear(); // Clear old data
  await Promise.all(properties.map(property => store.put(property)));
};

const getPropertiesFromDB = async () => {
  const db = await openDB();
  const tx = db.transaction(PROPERTIES_CACHE_KEY, 'readonly');
  const store = tx.objectStore(PROPERTIES_CACHE_KEY);
  return store.getAll();
};

export const usePropertyRead = () => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
    args: [],
    options: {
      staleTime: 30000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    }
  });

  const saleProperties = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    const properties = data.map((property: any) => 
      PropertyConverter.fromStarknetProperty(property)
    );
    
    // Save to IndexedDB
    savePropertiesToDB(properties).catch(console.error);
    
    return properties;
  }, [data]);

  // Load from IndexedDB if contract data is not available
  useMemo(async () => {
    if (isLoading && !saleProperties.length) {
      try {
        const cachedProperties = await getPropertiesFromDB();
        if (cachedProperties?.length) {
          return cachedProperties;
        }
      } catch (error) {
        console.error("Error loading from IndexedDB:", error);
      }
    }
  }, [isLoading, saleProperties.length]);

  return { saleProperties, isLoading, error };
};

export const usePropertyReadById = (propertyId: string) => {
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property_by_id",
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
