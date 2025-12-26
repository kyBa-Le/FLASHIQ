import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schema/signup.schema";
import { register } from "@/services/auth.service";
import AuthLayout from "@/layouts/AuthLayout";
import SignupForm from "../components/common/SignupForm";

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);
    try {
      await register(data);
      navigate("/verify-email", { state: { email: data.email } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as
          | { message?: string; errors?: unknown }
          | undefined;

        if (data?.message) {
          const msg = data.message;
          if (msg.toLowerCase().includes("email")) {
            form.setError("email", { type: "server", message: msg });
            return;
          }
          if (msg.toLowerCase().includes("username")) {
            form.setError("username", { type: "server", message: msg });
            return;
          }
          setServerError(msg);
          return;
        }
      }

      if (err instanceof Error) {
        setServerError(err.message);
      }
    }
  };

  return (
    <AuthLayout>
      <SignupForm form={form} onSubmit={onSubmit} serverError={serverError} />
    </AuthLayout>
  );
}
