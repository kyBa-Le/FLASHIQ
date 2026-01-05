import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";

export default function UserInfo() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback className="text-md uppercase">
          {user.username.slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      <span className="font-semibold text-medium">{user.username}</span>
    </div>
  );
}
