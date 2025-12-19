import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "../routes/ProtectedRoute";
import { HomePage, LoginPage } from "../routes/lazyPages";

function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
