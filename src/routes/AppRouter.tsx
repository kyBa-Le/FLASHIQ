import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "../routes/ProtectedRoute";
import { HomePage, LoginPage } from "../routes/lazyPages";
import NotFound from "@/pages/NotFound";
import SignupPage from "@/pages/SignupPage";
import VerifyEmailNoticePage from "@/pages/VerifyEmailNoticePage";
import VerifyEmailFailPage from "@/pages/VerifyEmailFailPage";
import VerifyEmailSuccessPage from "@/pages/VerifyEmailSuccessPage";
import VerifyEmailHandlerPage from "@/pages/VerifyEmailHandlerPage";

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailNoticePage />} />
        <Route path="/verify-email/handle" element={<VerifyEmailHandlerPage />} />
        <Route path="/verification-success" element={<VerifyEmailSuccessPage />} />
        <Route path="/verification-failed" element={<VerifyEmailFailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
