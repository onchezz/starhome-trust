import { useEffect, useState } from "react";
import { useStarHomeReadContract } from "../contract_hooks/useStarHomeReadContract";
import { User, UserConverter } from "@/types/user";
import { openDB } from "@/utils/indexedDb";

export const useUserReadByAddress = (address: string) => {
  const [user, setUser] = useState<User | null>(null);
  
  const { data, isLoading, error } = useStarHomeReadContract({
    functionName: "get_user_by_address",
    args: [address],
  });

  useEffect(() => {
    const fetchAndCacheUser = async () => {
      if (!address) return;

      try {
        // Try to get user from IndexedDB first
        const db = await openDB();
        const cachedUser = await db.get('users', address);
        console.log("[useUserReadByAddress] Cached user:", cachedUser);

        if (data && !isLoading) {
          const convertedUser = UserConverter.fromStarknetUser(data);
          console.log("[useUserReadByAddress] Contract user data:", convertedUser);

          // Only update if the user data has changed
          if (!cachedUser || JSON.stringify(cachedUser) !== JSON.stringify(convertedUser)) {
            console.log("[useUserReadByAddress] Updating user cache");
            await db.put('users', convertedUser, address);
            setUser(convertedUser);
          } else {
            console.log("[useUserReadByAddress] Using cached user data");
            setUser(cachedUser);
          }
        } else if (cachedUser) {
          console.log("[useUserReadByAddress] Using cached user while loading");
          setUser(cachedUser);
        }
      } catch (error) {
        console.error("[useUserReadByAddress] Error handling user data:", error);
        // If there's an error with IndexedDB, still try to use the contract data
        if (data && !isLoading) {
          const convertedUser = UserConverter.fromStarknetUser(data);
          setUser(convertedUser);
        }
      }
    };

    fetchAndCacheUser();
  }, [data, isLoading, address]);

  return {
    user,
    isLoading: isLoading && !user, // Only show loading if we don't have cached data
    error
  };
};