import { User } from "@/types/user";

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        {user.profile_image && (
          <img
            src={user.profile_image}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>
        </div>
      </div>
    </div>
  );
};