import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { verifyEmail } from "@/services/auth.service";

export default function VerifyEmailHandlerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token) {
      navigate("/verification-failed?status=invalid");
      return;
    }

    verifyEmail(token)
      .then(() => {
        navigate("/verification-success");
      })
      .catch((error: unknown) => {
        let status = "invalid";

        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;

          if (message === "Token has expired") {
            status = "expired";
          }
          if (message === "Email already verified") {
            status = "already_verified";
          }
        }

        const query = email
          ? `/verification-failed?status=${status}&email=${encodeURIComponent(
              email
            )}`
          : `/verification-failed?status=${status}`;

        navigate(query);
      });
  }, [token, email, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Verifying your email, please wait...
    </div>
  );
}
