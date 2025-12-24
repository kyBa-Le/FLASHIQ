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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Globe } from "lucide-react";
import { useState } from "react";

type Role = "viewer" | "editor";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultRole: Role;
  onSave: (role: Role) => void;
};

export function ModalPublicSet({ open, onClose, defaultRole, onSave }: Props) {
  const [publicRole, setPublicRole] = useState<Role>(defaultRole);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("viewer");

  const handleSave = () => {
    onSave(publicRole);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Access management</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          className="border bg-white rounded-md px-3 py-2 text-sm w-full"/>

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

          <Button
            onClick={() => {
              console.log("Invite:", inviteEmail, inviteRole);
              setInviteEmail("");
            }}
          >
            Send
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            People with access
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>X</AvatarFallback>
              </Avatar>

              <div className="text-sm">
                <p className="font-medium">Xa be (Owner)</p>
                <p className="text-xs text-muted-foreground">
                  bsa30012@gmail.com
                </p>
              </div>
            </div>

            <span className="text-sm text-muted-foreground">Owner</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 mt-1 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">Anyone with the link</p>
              <p className="text-sm text-muted-foreground">
                Anyone on the internet with the link can access this set
              </p>
            </div>
          </div>

          <Select
            value={publicRole}
            onValueChange={(v) => setPublicRole(v as Role)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="rounded-full"
          >
            Copy link
          </Button>

          <Button type="button" onClick={handleSave} className="rounded-full">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
