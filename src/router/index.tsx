
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../components/layout/MainLayout";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout><Home /></MainLayout>}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="mt-3 text-gray-600">Page not found.</p>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRouter;
