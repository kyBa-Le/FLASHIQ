import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { signupSchema } from "@/schema/signup.schema";
import { register } from "@/services/auth.service";

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
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);

    try {
      await register(data);
      navigate("/login");
    } catch (error) {
      if (!(error instanceof Error)) {
        setServerError("Registration failed");
        return;
      }
      if (error.message.toLowerCase().includes("email")) {
        form.setError("email", {
          type: "server",
          message: error.message,
        });
        return;
      }

      if (error.message.toLowerCase().includes("username")) {
        form.setError("username", {
          type: "server",
          message: error.message,
        });
        return;
      }

      setServerError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="relative hidden w-1/2 lg:block">
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
            noValidate
          >
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-2 rounded-full bg-input"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-4 w-4"
              />
              Continue with Google
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
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label>Username</Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your username"
                      className="rounded-full"
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
                <FormItem>
                  <Label>Password</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {serverError && (
              <p className="text-red-500 text-sm text-center">{serverError}</p>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing up..." : "Sign up"}
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full h-11 rounded-full bg-input text-gray-500 hover:text-gray-700"
            >
              <NavLink to="/login">
                Already have an account?{" "}
                <span className="font-medium">Login</span>
              </NavLink>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
