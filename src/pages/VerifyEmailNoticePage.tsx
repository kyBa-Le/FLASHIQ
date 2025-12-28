import { useLocation } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import VerifyEmailNotice from "@/components/common/VerifyEmailNotice";

export default function VerifyEmailNoticePage() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <AuthLayout>
      <VerifyEmailNotice email={email} />
    </AuthLayout>
  );
}
