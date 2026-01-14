import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = "viewer" | "editor";

type Props = {
  loading: boolean;
  error: string | null;
  onInvite: (email: string, role: Role, reset: () => void) => void;
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function InviteInput({ loading, error, onInvite }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [localError, setLocalError] = useState<string | null>(null);
  const submit = () => {
    const value = email.trim().toLowerCase();
    if (!value) {
      setLocalError("Please enter an email");
      return;
    }
    if (!isValidEmail(value)) {
      setLocalError("Invalid email format");
      return;
    }
    onInvite(value, role, () => {
      setEmail("");
      setRole("viewer");
    });
  };
  return (
    <>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Add people"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLocalError(null);
          }}
        />
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={submit} disabled={loading}>
          Send
        </Button>
      </div>
      {(localError || error) && (
        <span className="text-xs text-destructive">{localError || error}</span>
      )}
    </>
  );
}
