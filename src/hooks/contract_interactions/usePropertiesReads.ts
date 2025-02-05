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
  const { data: rawProperties, isLoading, error } = useStarHomeReadContract({
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
    if (rawProperty) {
      const converted = PropertyConverter.fromStarknetProperty(rawProperty);
      setProperty(converted);
    }
  }, [rawProperty]);

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
    if (rawProperties) {
      // Convert the raw data to an array if it isn't already
      const propertiesArray = Array.isArray(rawProperties) ? rawProperties : Object.values(rawProperties);
      const converted = propertiesArray.map(prop => 
        PropertyConverter.fromStarknetProperty(prop)
      );
      setProperties(converted);
    }
  }, [rawProperties]);

  return {
    properties,
    isLoading,
    error
  };
};

export const useInvestmentAssetsRead = () => {
  const { address } = useAccount();
  const { data: rawInvestmentProperties, isLoading: isLoadingProperties } = useStarHomeReadContract({
    functionName: "get_investment_properties",
  });

  const { data: rawUserInvestments, isLoading: isLoadingInvestments } = useStarHomeReadContract({
    functionName: "get_investment_properties_by_lister",
    args: [address || ""],
  });

  const [formattedProperties, setFormattedProperties] = useState<InvestmentAsset[]>([]);
  const [formattedInvestments, setFormattedInvestments] = useState<InvestmentAsset[]>([]);

  useEffect(() => {
    if (rawInvestmentProperties) {
      // Convert the raw data to an array if it isn't already
      const investmentsArray = Array.isArray(rawInvestmentProperties) 
        ? rawInvestmentProperties 
        : Object.values(rawInvestmentProperties);
      setFormattedProperties(investmentsArray.map(inv => InvestmentAssetConverter.fromStarknetProperty(inv)));
    }
  }, [rawInvestmentProperties]);

  useEffect(() => {
    if (rawUserInvestments) {
      // Convert the raw data to an array if it isn't already
      const investmentsArray = Array.isArray(rawUserInvestments) 
        ? rawUserInvestments 
        : Object.values(rawUserInvestments);
      setFormattedInvestments(investmentsArray.map(inv => InvestmentAssetConverter.fromStarknetProperty(inv)));
    }
  }, [rawUserInvestments]);

  return {
    investmentProperties: formattedProperties,
    userInvestments: formattedInvestments,
    isLoading: isLoadingProperties || isLoadingInvestments,
    error: null
  };
};

export const useInvestmentAssetReadById = (id: string) => {
  const { data: rawInvestment, isLoading, error } = useStarHomeReadContract({
    functionName: "get_investment",
    args: [id],
  });

  const [investment, setInvestment] = useState<InvestmentAsset | null>(null);

  useEffect(() => {
    if (rawInvestment) {
      setInvestment(InvestmentAssetConverter.fromStarknetProperty(rawInvestment));
    }
  }, [rawInvestment]);

  return {
    investment,
    isLoading,
    error
  };
};