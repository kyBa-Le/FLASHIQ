import { useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cancel from "/assets/cancel.svg";
import { toast } from "sonner";
import { resendVerification } from "@/services/auth.service";

export default function VerifyEmailFail() {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const emailFromQuery = searchParams.get("email");

  const [email, setEmail] = useState(emailFromQuery || "");
  const [loading, setLoading] = useState(false);

  const messageMap: Record<string, string> = {
    expired: "Verification token has expired.",
    invalid: "Invalid verification token.",
    already_verified: "Your email has already been verified.",
  };

  const message = messageMap[status ?? ""] || "Verification failed.";

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await resendVerification(email);
      toast.success("Verification email has been resent!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to resend verification email"
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <img src={Cancel} alt="Cancel" className="h-16 w-16" />
        </div>
        <h2 className="text-xl font-bold text-red-500">
          Email verification failed
        </h2>
        <p className="text-sm text-muted-foreground">
          {message}
          <br />
          Your account has not been activated.
        </p>
        {!emailFromQuery && (
          <div className="space-y-2 text-left">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter again your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        <div className="space-y-3">
          <Button
            className="w-full h-11 rounded-full"
            onClick={handleResendEmail}
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend verification email"}
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-11 rounded-full bg-input text-gray-500 hover:text-gray-700"
          >
            <NavLink to="/login">Back to Login</NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
