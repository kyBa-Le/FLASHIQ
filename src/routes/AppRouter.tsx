import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "../routes/ProtectedRoute";
import { HomePage, LoginPage } from "../routes/lazyPages";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
