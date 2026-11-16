
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

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

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B] text-[#14284D]">
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">

          <div className="grid h-24 w-24 place-items-center rounded-full bg-white shadow-lg shadow-orange-200/50">
            <ShoppingCart size={48} className="text-orange-500" />
          </div>

          <h1 className="mt-6 text-3xl font-black text-[#14284D]">
            Your Cart Is Empty
          </h1>

          <p className="mt-3 text-slate-600">
            You haven't added any toys to your cart yet.
          </p>

          <Link
            to="/products"
            className="mt-6 rounded-full bg-orange-500 px-7 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Explore Toys
          </Link>

        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B] text-[#14284D]">

      <section className="mx-auto max-w-6xl px-6 py-12">

       

        <div className="mb-8">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-600">
            ToyLand Shopping
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#14284D] sm:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-slate-600">
            You have {cartCount} item(s) in your cart.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

         

          <div className="space-y-4 lg:col-span-2">

            {items.map((item) => (
              <article
                key={item.product.id}
                className="flex flex-col gap-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-slate-900/5 transition hover:shadow-lg hover:shadow-orange-200/40 sm:flex-row sm:items-center"
              >

               

                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-28 w-28 rounded-2xl bg-orange-50 object-contain p-2"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-orange-50">
                    <ShoppingCart
                      size={32}
                      className="text-orange-500"
                    />
                  </div>
                )}

                

                <div className="flex-1">

                  <h2 className="text-lg font-extrabold text-[#14284D]">
                    {item.product.name}
                  </h2>

                  <p className="mt-1 font-bold text-orange-600">
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
                      className="rounded-xl border border-orange-200 bg-orange-50 p-2 text-[#14284D] transition hover:bg-orange-100"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-6 text-center font-bold text-[#14284D]">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => addToCart(item.product)}
                      aria-label={`Increase quantity of ${item.product.name}`}
                      className="rounded-xl border border-orange-200 bg-orange-50 p-2 text-[#14284D] transition hover:bg-orange-100"
                    >
                      <Plus size={16} />
                    </button>

                    

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto flex items-center gap-2 text-sm font-semibold text-red-500 transition hover:text-red-700"
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>

                  </div>
                </div>

                

                <p className="font-black text-[#14284D] sm:text-right">
                  Rs.{" "}
                  {(item.product.price * item.quantity).toLocaleString(
                    "en-LK"
                  )}
                </p>

              </article>
            ))}

          </div>

          

          <aside className="h-fit rounded-3xl border border-orange-100 bg-white p-6 shadow-lg shadow-slate-900/5">

            <h2 className="text-xl font-black text-[#14284D]">
              Order Summary
            </h2>

            <div className="mt-6 flex justify-between gap-4 text-slate-600">
              <span>Total Items</span>
              <span className="font-bold text-[#14284D]">
                {cartCount}
              </span>
            </div>

            <div className="mt-4 flex justify-between gap-4 text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-[#14284D]">
                Rs. {subtotal.toLocaleString("en-LK")}
              </span>
            </div>

            <div className="mt-4 flex justify-between gap-4 text-slate-600">
              <span>Delivery</span>
              <span className="font-bold text-green-600">
                {subtotal >= 5000 ? "Free" : "At checkout"}
              </span>
            </div>

            <div className="mt-5 border-t border-orange-100 pt-5">
              <div className="flex justify-between gap-4 text-lg font-black text-[#14284D]">
                <span>Subtotal</span>
                <span className="text-orange-600">
                  Rs. {subtotal.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 font-extrabold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Proceed to Checkout
            </button>

            

            <Link
              to="/products"
              className="mt-4 block text-center font-bold text-orange-600 transition hover:text-orange-700"
            >
              Continue Shopping
            </Link>

          </aside>

        </div>
      </section>
    </div>
  );
}
