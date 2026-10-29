
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Login from "../pages/Login";
import Register from "../pages/Register";

import MainLayout from "../components/layout/MainLayout";

function AppRouter() {
  return (
    <Routes>
      {/* Shared header and footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Route>

      {/* Authentication pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Unknown routes */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="mt-3 text-gray-600">Page not found.</p>
            <a
              href="/"
              className="mt-5 rounded-lg bg-orange-500 px-5 py-3 text-white hover:bg-orange-600"
            >
              Back to Home
            </a>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRouter;
