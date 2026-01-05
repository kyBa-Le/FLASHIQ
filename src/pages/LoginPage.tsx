import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/schema/login.schema";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "../components/common/LoginForm";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      await login(data);
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorResponse = err.response?.data;
      const backendErrors = errorResponse?.errors;

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        backendErrors.forEach((msg: string) => {
          const lowerMsg = msg.toLowerCase();

          if (lowerMsg.includes("email")) {
            form.setError("email", { type: "server", message: msg });
          } else if (
            lowerMsg.includes("password") ||
            lowerMsg.includes("password")
          ) {
            form.setError("password", { type: "server", message: msg });
          } else {
            setServerError(msg);
          }
        });
      } else {
        setServerError(
          errorResponse?.message || "An unexpected error occurred. Please try again."
        );
      }
    }
  };

  return (
    <AuthLayout>
      <LoginForm form={form} onSubmit={onSubmit} serverError={serverError} />
    </AuthLayout>
  );
}
