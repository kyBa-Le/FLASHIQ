import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "../routes/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import { HomeUserPage, LoginPage, LibraryPage } from "./lazyPages";
import SignupPage from "@/pages/SignupPage";
import VerifyEmailNoticePage from "@/pages/VerifyEmailNoticePage";
import VerifyEmailFailPage from "@/pages/VerifyEmailFailPage";
import VerifyEmailSuccessPage from "@/pages/VerifyEmailSuccessPage";
import VerifyEmailHandlerPage from "@/pages/VerifyEmailHandlerPage";
import UpcomingPage from "@/pages/UpcomingPage";
import ViewDetailSetPage from "@/pages/ViewDetailSet";
import CreateSetPage from "@/pages/CreateSetPage";
import EditSetPage from "@/pages/EditSetPage";
import MultipleChoicePage from "@/pages/MutipleChoicePage";

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailNoticePage />} />
        <Route
          path="/verify-email/handle"
          element={<VerifyEmailHandlerPage />}
        />
        <Route
          path="/verification-success"
          element={<VerifyEmailSuccessPage />}
        />
        <Route path="/verification-failed" element={<VerifyEmailFailPage />} />
        <Route path="/sets/:id/study" element={<MultipleChoicePage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomeUserPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/sets/create" element={<CreateSetPage />} />
            <Route path="/sets/:id/edit" element={<EditSetPage />} />
            <Route path="/sets/:id/view" element={<ViewDetailSetPage />} />
          </Route>
        </Route>

        <Route path="*" element={<UpcomingPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
