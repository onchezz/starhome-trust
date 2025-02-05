import { useEffect, useState } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { User, UserConverter } from "@/types/user";

export const useUserReadByAddress = (address: string) => {
  const [user, setUser] = useState<User | null>(null);
  
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_user_by_address",
    args: [address],
  });

  useEffect(() => {
    if (data && !isLoading) {
      const convertedUser = UserConverter.fromStarknetUser(data);
      setUser(convertedUser);
      console.log("agent data is:", convertedUser);
    }
  }, [data, isLoading]);

  return {
    user,
    isLoading,
    error
  };
};