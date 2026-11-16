
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
      <section className="min-h-screen bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B] px-6 py-20 text-center text-[#14284D]">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-extrabold">
            Your cart is empty
          </h1>

          <p className="mt-3 text-[#64748B]">
            Add some exciting toys before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            Explore Toys
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B] px-6 py-12 text-[#14284D]">
      <div className="mx-auto max-w-5xl">
        
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-500">
            Almost there!
          </p>

          <h1 className="text-3xl font-extrabold md:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-[#64748B]">
            Complete your delivery details and place your order.
          </p>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-8 md:grid-cols-2"
        >
          
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-900/5">
            <h2 className="mb-6 text-xl font-extrabold">
              Delivery Details
            </h2>

            <label className="mb-2 block font-semibold">
              Shipping Address
            </label>

            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete delivery address"
              rows={4}
              required
              className="w-full rounded-xl border border-orange-200 bg-orange-50/30 p-3 text-[#14284D] outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            <h2 className="mb-4 mt-8 text-xl font-extrabold">
              Payment Method
            </h2>

            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
              paymentMethod === "CASH_ON_DELIVERY"
                ? "border-orange-400 bg-orange-50"
                : "border-orange-100 hover:bg-orange-50/50"
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="CASH_ON_DELIVERY"
                checked={paymentMethod === "CASH_ON_DELIVERY"}
                onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                className="accent-orange-500"
              />

              <span className="font-semibold">
                Cash on Delivery
              </span>
            </label>

            <label className={`mt-3 flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
              paymentMethod === "CARD"
                ? "border-orange-400 bg-orange-50"
                : "border-orange-100 hover:bg-orange-50/50"
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={() => setPaymentMethod("CARD")}
                className="accent-orange-500"
              />

              <span className="font-semibold">
                Card
              </span>
            </label>

            <p className="mt-3 text-sm text-slate-500">
              Card payment requires a payment gateway integration.
            </p>
          </div>

          
          <div className="h-fit rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-900/5">
            <h2 className="text-xl font-extrabold">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between gap-4"
                >
                  <span className="text-slate-600">
                    {item.product.name} × {item.quantity}
                  </span>

                  <span className="whitespace-nowrap font-semibold text-[#14284D]">
                    Rs.{" "}
                    {(item.product.price * item.quantity).toLocaleString("en-LK")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-orange-100 pt-5">
              <div className="flex justify-between text-lg font-extrabold">
                <span>Total</span>

                <span className="text-orange-600">
                  Rs. {subtotal.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="mt-4 block text-center text-sm font-semibold text-[#64748B] transition hover:text-orange-600"
            >
              ← Back to Cart
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
