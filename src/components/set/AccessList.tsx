import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import UserInfo from "../user/UserInfo";
import type { AccessUser } from "@/services/access.service";

type Props = {
  accessList?: AccessUser[];
  onRemove: (id: string) => void;
};

export default function AccessList({ accessList = [], onRemove }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">
        People with access
      </p>
      <div className="flex items-center justify-between py-2">
        <UserInfo />
        <span className="text-sm text-muted-foreground">Owner</span>
      </div>
      {accessList.map((item) => {
        const initial = item.user?.username
          ? item.user.username.charAt(0).toUpperCase()
          : "U";
        return (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {initial}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {item.user?.username ?? "Unknown user"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.user?.email ?? ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {item.permission === "EDIT" ? "Editor" : "Viewer"}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onRemove(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
