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
    } catch (err) {
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes("email")) {
          form.setError("email", { type: "server", message: err.message });
          return;
        }
        if (msg.includes("password")) {
          form.setError("password", { type: "server", message: err.message });
          return;
        }
        setServerError(err.message);
      }
    }
  };

  return (
    <AuthLayout>
      <LoginForm form={form} onSubmit={onSubmit} serverError={serverError} />
    </AuthLayout>
  );
}
