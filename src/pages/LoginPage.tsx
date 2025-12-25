import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/schema/login.schema";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes("email")) {
          form.setError("email", { type: "server", message: error.message });
          return;
        }
        if (message.includes("password")) {
          form.setError("password", { type: "server", message: error.message });
          return;
        }
        setServerError(error.message);
      } else {
        setServerError("Login failed");
      }
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex w-1/2 h-full">
        <img
          src="/assets/bg-login.png"
          alt="FlashIQ style"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-6"
          >
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-2 rounded-full bg-input"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="h-4 w-4"
              />
              Login with Google
            </Button>

            <div className="relative flex items-center">
              <Separator className="flex-1" />
              <span className="px-3 text-xs text-muted-foreground">
                or with email
              </span>
              <Separator className="flex-1" />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label>Email</Label>
                  <FormControl>
                    <Input
                      placeholder="Enter your email address"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label>Password</Label>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <div className="text-right">
              <NavLink
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </NavLink>
            </div>

            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Log in"}
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full h-11 gap-2 rounded-full bg-input text-gray-500 hover:text-gray-700"
            >
              <NavLink to="/signup">
                New to FlashIQ?{" "}
                <span className="font-medium">Create an account</span>
              </NavLink>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
