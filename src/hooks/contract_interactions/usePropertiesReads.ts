import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { Property, PropertyConverter } from "@/types/property";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { saveProperties, getProperties } from "@/utils/indexedDb";

export const usePropertyRead = () => {
  const { data: rawProperties, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties",
  });

  const [saleProperties, setSaleProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchAndSaveProperties = async () => {
      if (rawProperties) {
        const propertiesArray = Array.isArray(rawProperties) ? rawProperties : Object.values(rawProperties);
        const converted = propertiesArray.map(prop => 
          PropertyConverter.fromStarknetProperty(prop)
        );
        
        // Save to IndexedDB
        await saveProperties(converted);
        setSaleProperties(converted);
      } else {
        // Try to get from IndexedDB if no network data
        try {
          const cachedProperties = await getProperties();
          if (cachedProperties.length > 0) {
            setSaleProperties(cachedProperties);
          }
        } catch (error) {
          console.error("Error fetching from IndexedDB:", error);
        }
      }
    };

    fetchAndSaveProperties();
  }, [rawProperties]);

  return {
    saleProperties,
    isLoading,
    error
  };
};

export const usePropertyReadById = (id: string) => {
  const { data: rawProperty, isLoading, error } = useStarHomeReadContract({
    functionName: "get_property",
    args: [id],
  });

  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (rawProperty) {
        const converted = PropertyConverter.fromStarknetProperty(rawProperty);
        setProperty(converted);
      } else {
        // Try to get from IndexedDB if no network data
        try {
          const cachedProperties = await getProperties();
          const cachedProperty = cachedProperties.find(prop => prop.id === id);
          if (cachedProperty) {
            setProperty(cachedProperty);
          }
        } catch (error) {
          console.error("Error fetching from IndexedDB:", error);
        }
      }
    };

    fetchProperty();
  }, [rawProperty, id]);

  return {
    property,
    isLoading,
    error
  };
};

export const useAgentProperties = (address: string) => {
  const { data: rawProperties, isLoading, error } = useStarHomeReadContract({
    functionName: "get_sale_properties_by_agent",
    args: [address],
  });

  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchAndSaveProperties = async () => {
      if (rawProperties) {
        const propertiesArray = Array.isArray(rawProperties) ? rawProperties : Object.values(rawProperties);
        const converted = propertiesArray.map(prop => 
          PropertyConverter.fromStarknetProperty(prop)
        );
        
        // Save to IndexedDB
        await saveProperties(converted);
        setProperties(converted);
      } else {
        // Try to get from IndexedDB if no network data
        try {
          const cachedProperties = await getProperties();
          const agentProperties = cachedProperties.filter(prop => prop.agent?.address === address);
          if (agentProperties.length > 0) {
            setProperties(agentProperties);
          }
        } catch (error) {
          console.error("Error fetching from IndexedDB:", error);
        }
      }
    };

    fetchAndSaveProperties();
  }, [rawProperties, address]);

  return {
    properties,
    isLoading,
    error
  };
};