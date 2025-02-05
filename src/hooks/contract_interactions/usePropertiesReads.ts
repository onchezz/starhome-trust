import { useQuery } from '@tanstack/react-query';
import { useStarHomeReadContract } from '../contract_hooks/useStarHomeReadContract';
import { 
  initDB,
  getAllProperties,
  saveProperty,
  getAllInvestments,
  saveInvestment
} from '@/utils/indexedDb';

export const usePropertiesReads = () => {
  const { data: properties, isLoading: loadingProperties } = useStarHomeReadContract({
    functionName: 'getAllProperties',
  });

  const { data: investments, isLoading: loadingInvestments } = useStarHomeReadContract({
    functionName: 'getAllInvestments',
  });

  const savePropertiesToDB = async () => {
    if (properties) {
      await Promise.all(properties.map(saveProperty));
    }
  };

  const saveInvestmentsToDB = async () => {
    if (investments) {
      await Promise.all(investments.map(saveInvestment));
    }
  };

  return {
    properties,
    investments,
    loadingProperties,
    loadingInvestments,
    savePropertiesToDB,
    saveInvestmentsToDB,
  };
};
