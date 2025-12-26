import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AcceptTick from "/assets/accept-tick.svg";

export default function VerifyEmailSuccess() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center mb-4">
          <img src={AcceptTick} alt="Success" className="h-16 w-16" />
        </div>

        <h2 className="text-xl font-bold text-green-600">
          Email verified successfully
        </h2>

        <p className="text-sm text-muted-foreground">
          Your email has been verified.
          <br />
          Your account has been activated.
        </p>

        <Button asChild className="w-full h-11 rounded-full">
          <NavLink to="/login">Back to Login</NavLink>
        </Button>
      </div>
    </div>
  );
}
