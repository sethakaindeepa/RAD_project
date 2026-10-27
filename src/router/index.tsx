
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRouter() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<Home />} />

      {/* Authentication pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 404 - Page Not Found */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              404
            </h1>

            <p className="mt-3 text-lg text-gray-600">
              Oops! This ToyLand page could not be found.
            </p>

            <a
              href="/"
              className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
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
