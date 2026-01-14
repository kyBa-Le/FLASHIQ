import { NavLink } from "react-router-dom";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
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
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  form: UseFormReturn<SignupFormValues>;
  onSubmit: (data: SignupFormValues) => void;
  serverError: string | null;
  onGoogleLoginSuccess: (credentialResponse: CredentialResponse) => void;
  onGoogleLoginError: () => void;
}

export default function SignupForm({
  form,
  onSubmit,
  serverError,
  onGoogleLoginSuccess,
  onGoogleLoginError,
}: SignupFormProps) {
  return (
    <div className="flex w-full h-full items-center justify-center px-6 py-8 overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-6"
          noValidate
        >
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={onGoogleLoginSuccess}
              onError={onGoogleLoginError}
              useOneTap
              shape="pill"
              theme="outline"
              width="340"
              logo_alignment="center"
              size="large"
              text="continue_with"
            />
          </div>
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
  );
}
