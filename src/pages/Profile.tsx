import { useAccount } from "@starknet-react/core";
import { User } from "@/types/user";
import { UserProfile } from "@/components/profile/UserProfile";
import { UserInvestments } from "@/components/profile/UserInvestments";
import { useUserReadByAddress } from "@/hooks/contract_interactions/useUserRead";

const Profile = () => {
  const { address } = useAccount();
  const { user, isLoading } = useUserReadByAddress(address || "");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-24">
      <UserProfile user={user} />
      <UserInvestments />
    </div>
  );
};

export default Profile;
