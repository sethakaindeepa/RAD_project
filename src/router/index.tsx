
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import MainLayout from "../components/layout/MainLayout";
import Shop from "../pages/Shop";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";

function AppRouter() {
  return (
    <Routes>
      
      <Route element={<MainLayout />}>
        <Route path="/homepage" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Route>

      
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      
    </Routes>
  );
}

export default AppRouter;
