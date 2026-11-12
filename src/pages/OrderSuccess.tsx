
import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order;

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
        ✓
      </div>

      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
        Order Placed Successfully!
      </h1>

      <p className="mt-3 text-slate-500">
        Thank you for shopping with ToyLand.
      </p>

      {order && (
        <div className="mt-6 rounded-xl border border-slate-200 p-5">
          <p>
            Order ID: <strong>{order._id}</strong>
          </p>
          <p className="mt-2">
            Total:{" "}
            <strong>
              Rs. {order.totalAmount?.toLocaleString("en-LK")}
            </strong>
          </p>
          <p className="mt-2">
            Status: <strong>{order.status}</strong>
          </p>
        </div>
      )}

      <Link
        to="/products"
        className="mt-7 rounded-xl bg-orange-600 px-7 py-3 font-bold text-white hover:bg-orange-700"
      >
        Continue Shopping
      </Link>
    </section>
  );
}
