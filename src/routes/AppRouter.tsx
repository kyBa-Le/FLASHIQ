import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "../routes/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import {
  HomeUserPage,
  LoginPage,
  LibraryPage,
  CreateSetPage,
  EditSetPage,
} from "./lazyPages";
import NotFound from "@/pages/NotFound";
import SignupPage from "@/pages/Signup";
import EditorLayout from "@/layouts/EditorLayout";

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeUserPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Route>
        <Route element={<EditorLayout />}>
          <Route path="/sets/create" element={<CreateSetPage />} />
          <Route path="/sets/:id/edit" element={<EditSetPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          {/* <Route element={<MainLayout />}>
            <Route path="/" element={<HomeUserPage />} />
            <Route path="/library" element={<LibraryPage />} />
          </Route>
          <Route element={<EditorLayout />}>
            <Route path="/sets/create" element={<CreateSetPage />} />
            <Route path="/sets/:id/edit" element={<EditSetPage />} />
          </Route> */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
