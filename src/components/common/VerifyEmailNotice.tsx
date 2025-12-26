import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Gmail from "/assets/gmail-logo.svg";

interface VerifyEmailNoticeProps {
  email: string;
}
export default function VerifyEmailNotice({ email }: VerifyEmailNoticeProps) {
  return (
    <div className="flex w-full h-full items-center justify-center px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center mb-4">
          <img src={Gmail} alt="Gmail" className="h-14 w-14" />
        </div>
        <h2 className="text-xl font-bold">Verify Your Email</h2>
        <p className="text-sm text-muted-foreground">
          A verification link has been sent to <strong>{email}</strong>. Please
          check your inbox and click on the link to verify your email address.
        </p>
        <Button
          asChild
          variant="outline"
          className="w-full h-11 rounded-full bg-input text-gray-500 hover:text-gray-700"
        >
          <NavLink to="/login">Back to Login</NavLink>
        </Button>
      </div>
    </div>
  );
}
