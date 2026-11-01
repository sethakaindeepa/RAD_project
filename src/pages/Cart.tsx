
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";

export default function Cart() {
  const {
    items,
    cartCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <ShoppingCart size={64} className="text-orange-500" />

        <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
          Your Cart Is Empty
        </h1>

        <p className="mt-3 text-slate-500">
          You haven't added any toys to your cart yet.
        </p>

        <Link
          to="/products"
          className="mt-6 rounded-full bg-orange-600 px-7 py-3 font-bold text-white hover:bg-orange-700"
        >
          Explore Toys
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900">
        Shopping Cart
      </h1>

      <p className="mt-2 text-slate-500">
        You have {cartCount} item(s) in your cart.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <article
              key={item.product.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
            >
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-28 w-28 rounded-xl bg-slate-50 object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-orange-50">
                  <ShoppingCart
                    size={32}
                    className="text-orange-500"
                  />
                </div>
              )}

              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">
                  {item.product.name}
                </h2>

                <p className="mt-1 font-semibold text-orange-600">
                  Rs. {item.product.price.toLocaleString("en-LK")}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity - 1
                      )
                    }
                    aria-label={`Decrease quantity of ${item.product.name}`}
                    className="rounded-lg border p-2 hover:bg-slate-100"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-6 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => addToCart(item.product)}
                    aria-label={`Increase quantity of ${item.product.name}`}
                    className="rounded-lg border p-2 hover:bg-slate-100"
                  >
                    <Plus size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="ml-auto flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={17} />
                    Remove
                  </button>
                </div>
              </div>

              <p className="font-bold text-slate-900 sm:text-right">
                Rs.{" "}
                {(item.product.price * item.quantity).toLocaleString(
                  "en-LK"
                )}
              </p>
            </article>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="h-fit rounded-2xl border border-slate-200 p-6">
          <h2 className="text-xl font-extrabold text-slate-900">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between gap-4 text-slate-600">
            <span>Total Items</span>
            <span>{cartCount}</span>
          </div>

          <div className="mt-4 flex justify-between gap-4 text-slate-600">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString("en-LK")}</span>
          </div>

          <div className="mt-4 flex justify-between gap-4 text-slate-600">
            <span>Delivery</span>
            <span>{subtotal >= 5000 ? "Free" : "At checkout"}</span>
          </div>

          <div className="mt-5 border-t pt-5">
            <div className="flex justify-between gap-4 text-lg font-extrabold">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString("en-LK")}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              alert("Checkout will be implemented in the next step.")
            }
            className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700"
          >
            Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="mt-4 block text-center font-semibold text-orange-600 hover:text-orange-700"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
