/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X, Link2 } from "lucide-react";
import UserInfo from "../user/UserInfo";
import { useSetAccess } from "@/hooks/useSetAccess";
import type { AccessUser } from "@/services/access.service";
import PublicAccessSelect from "./PublicAccessSelect";
import { toast } from "sonner";

type Role = "viewer" | "editor";
type Props = {
  open: boolean;
  onClose: (open: boolean) => void;
  setId?: string;
  defaultRole?: Role;
};
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export function ModalPublicSet({
  open,
  onClose,
  setId,
  defaultRole = "viewer",
}: Props) {
  const { accessList, invite, remove, loading } = useSetAccess(setId);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("viewer");
  const [error, setError] = useState<string | null>(null);
  const handleInvite = async () => {
    if (!setId || loading) return;
    const email = inviteEmail.trim().toLowerCase();
    if (!email) {
      setError("Please enter an email");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }
    setError(null);
    try {
      await invite(email, inviteRole === "editor" ? "EDIT" : "VIEW");
      setInviteEmail("");
      setInviteRole("viewer");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Email does not exist or cannot be invited"
      );
    }
  };
  const handleCopyLink = async () => {
    if (!setId) return;
    await navigator.clipboard.writeText(
      `${window.location.origin}/sets/${setId}/study`
    );
    toast.success("Link copied to clipboard");
  };
  const handleClose = () => {
    setInviteEmail("");
    setInviteRole("viewer");
    setError(null);
    onClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Access management</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Add people"
            value={inviteEmail}
            onChange={(e) => {
              setInviteEmail(e.target.value);
              setError(null);
            }}
          />
          <Select
            value={inviteRole}
            onValueChange={(v) => setInviteRole(v as Role)}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleInvite} disabled={loading || !setId}>
            Send
          </Button>
        </div>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        <Separator />
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            People with access
          </p>
          <div className="flex items-center justify-between py-2">
            <UserInfo />
            <span className="text-sm text-muted-foreground">Owner</span>
          </div>
          {accessList.map((item: AccessUser) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-md">
                  {item.user?.username?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {item.user?.username ?? "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.user?.email}
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
                  onClick={() => remove(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <PublicAccessSelect defaultRole={defaultRole} />
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCopyLink}>
            <Link2 />
            Copy link
          </Button>
          <Button onClick={handleClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
