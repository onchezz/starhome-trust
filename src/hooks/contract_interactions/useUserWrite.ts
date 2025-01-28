import { useAccount } from '@starknet-react/core';
import { toast } from 'sonner';
import { useStarHomeWriteContract } from '../contract_hooks/useStarHomeWriteContract';
import { User } from '@/types/user';

export const useUserWrite = () => {
  const { address } = useAccount();
  const { execute, status: contractStatus } = useStarHomeWriteContract();

  const handleRegisterUser = async (user: Partial<User>) => {
    try {
      const defaultUser: User = {
        id: address || "",
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        profile_image: user.profile_image || "",
        is_verified: false,
        is_authorized: false,
        is_agent: user.is_agent || false,
        is_investor: user.is_investor || false,
        timestamp: Math.floor(Date.now() / 1000)
      };

      console.log("Registering user with data:", defaultUser);

      const tx = await execute("register_user", [defaultUser]);
      
      toast.success("User registered successfully!");
      return {
        transaction_hash: tx.response.transaction_hash,
        status: 'success' as const
      };
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register user");
      throw error;
    }
  };

  const handleEditUser = async (user: Partial<User>) => {
    try {
      if (!address) throw new Error("No wallet connected");

      const updatedUser: User = {
        id: address,
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        profile_image: user.profile_image || "",
        is_verified: user.is_verified || false,
        is_authorized: user.is_authorized || false,
        is_agent: user.is_agent || false,
        is_investor: user.is_investor || false,
        timestamp: Math.floor(Date.now() / 1000)
      };

      console.log("Updating user with data:", updatedUser);

      const tx = await execute("edit_user", [address, updatedUser]);
      
      toast.success("Profile updated successfully!");
      return {
        transaction_hash: tx.response.transaction_hash,
        status: 'success' as const
      };
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const handleSignAsAgent = async () => {
    try {
      console.log("signing as agent");
      const tx = await execute("register_as_agent", [address]);
      
      toast.success("Registered as agent successfully!");
      return {
        transaction_hash: tx.response.transaction_hash,
        status: 'success' as const
      };
    } catch (error) {
      console.error("Error registering as agent:", error);
      toast.error("Failed to register as agent");
      throw error;
    }
  };

  return {
    handleRegisterUser,
    handleEditUser,
    handleSignAsAgent,
    contractStatus
  };
};