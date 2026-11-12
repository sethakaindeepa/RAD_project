
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../services/orders";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH_ON_DELIVERY" | "CARD"
  >("CASH_ON_DELIVERY");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Please enter your shipping address.");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        paymentMethod,
        shippingAddress: shippingAddress.trim(),
      };

      const response = await createOrder(orderData);

      clearCart();

      navigate("/order-success", {
        state: {
          order: response.order,
        },
      });
    } catch (err: any) {
      console.error("Place order error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link
          to="/products"
          className="mt-5 inline-block rounded-xl bg-orange-600 px-6 py-3 font-bold text-white"
        >
          Explore Toys
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">
        Checkout
      </h1>

      <form
        onSubmit={handlePlaceOrder}
        className="mt-8 grid gap-8 md:grid-cols-2"
      >
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="mb-5 text-xl font-bold">Delivery Details</h2>

          <label className="mb-2 block font-semibold">
            Shipping Address
          </label>

          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Enter your complete delivery address"
            rows={4}
            required
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-orange-500"
          />

          <h2 className="mb-4 mt-7 text-xl font-bold">
            Payment Method
          </h2>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4">
            <input
              type="radio"
              name="paymentMethod"
              value="CASH_ON_DELIVERY"
              checked={paymentMethod === "CASH_ON_DELIVERY"}
              onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
            />
            <span>Cash on Delivery</span>
          </label>

          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border p-4">
            <input
              type="radio"
              name="paymentMethod"
              value="CARD"
              checked={paymentMethod === "CARD"}
              onChange={() => setPaymentMethod("CARD")}
            />
            <span>Card</span>
          </label>

          <p className="mt-3 text-sm text-slate-500">
            Card payment requires a payment gateway integration.
          </p>
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between gap-4"
              >
                <span className="text-slate-600">
                  {item.product.name} × {item.quantity}
                </span>

                <span className="font-semibold">
                  Rs.{" "}
                  {(item.product.price * item.quantity).toLocaleString("en-LK")}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between text-lg font-extrabold">
              <span>Total</span>
              <span>
                Rs. {subtotal.toLocaleString("en-LK")}
              </span>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </section>
  );
}
