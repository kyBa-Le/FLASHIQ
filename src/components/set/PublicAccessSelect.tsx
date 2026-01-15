import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LockKeyhole, Globe } from "lucide-react";

type Role = "viewer" | "editor";
type PublicAccess = "RESTRICTED" | "ANYONE";

export default function PublicAccessSelect({
  defaultRole,
}: {
  defaultRole: Role;
}) {
  const [publicAccess, setPublicAccess] = useState<PublicAccess>("RESTRICTED");
  const [publicRole, setPublicRole] = useState<Role>(defaultRole);

  return (
    <div className="flex items-center justify-between">
      <Select
        value={publicAccess}
        onValueChange={(v) => setPublicAccess(v as PublicAccess)}
      >
        <SelectTrigger className="w-[400px] border-none shadow-none p-0 h-auto hover:bg-muted/40 rounded-lg text-left">
          <SelectValue>
            {publicAccess === "ANYONE" ? (
              <div className="flex gap-3 p-3">
                <Globe className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Anyone with the link</p>
                  <p className="text-xs text-muted-foreground">
                    Anyone on the internet with the link
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 p-3">
                <LockKeyhole className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Restricted</p>
                  <p className="text-xs text-muted-foreground">
                    Only people with access
                  </p>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="RESTRICTED">Restricted</SelectItem>
          <SelectItem value="ANYONE">Anyone with the link</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={publicRole}
        onValueChange={(v) => setPublicRole(v as Role)}
        disabled={publicAccess === "RESTRICTED"}
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
        </SelectContent>
      </Select>
    </div>
  );
}
