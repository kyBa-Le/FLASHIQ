import type { ReactNode } from "react";
import bgLogin from "/assets/bg-login.png";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex w-1/2 h-full">
        <img
          src={bgLogin}
          alt="FlashIQ style"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-full lg:w-1/2 flex">{children}</div>
    </div>
  );
}
