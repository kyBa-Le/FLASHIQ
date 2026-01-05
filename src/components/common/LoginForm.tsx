import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/schema/login.schema";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => void;
  serverError: string | null;
}

export default function LoginForm({
  form,
  onSubmit,
  serverError,
}: LoginFormProps) {
  return (
    <div className="flex w-full h-full items-center justify-center px-6 py-8 overflow-y-auto">
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
                    {...field}
                    className={
                      form.formState.errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "rounded-full"
                    }
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
            className="w-full h-11 gap-2 rounded-full"
          >
            <NavLink to="/signup">
              New to FlashIQ?{" "}
              <span className="font-medium">Create an account</span>
            </NavLink>
          </Button>
        </form>
      </Form>
    </div>
  );
}
