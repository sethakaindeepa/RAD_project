
import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B] px-6 py-16 text-center text-[#14284D]">

      
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-200 bg-green-100 text-5xl font-bold text-green-600 shadow-lg shadow-green-900/10">
        ✓
      </div>

     
      <h1 className="mt-7 text-3xl font-extrabold md:text-4xl">
        Order Placed Successfully!
      </h1>

      <p className="mt-3 max-w-md text-[#64748B]">
        Thank you for shopping with ToyLand. Your order has been placed successfully.
        We appreciate your trust in us!
      </p>

      
      {order && (
        <div className="mt-8 w-full max-w-md rounded-2xl border border-orange-100 bg-white p-6 text-left shadow-lg shadow-orange-900/5">

          <h2 className="mb-5 text-xl font-extrabold text-[#14284D]">
            Order Details
          </h2>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="text-slate-500">Order ID</span>
              <strong className="break-all text-[#14284D]">
                {order._id}
              </strong>
            </div>

            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Total Amount</span>
              <strong className="text-orange-600">
                Rs. {order.totalAmount?.toLocaleString("en-LK")}
              </strong>
            </div>

            <div className="flex justify-between gap-2">
              <span className="text-slate-500">Order Status</span>
              <strong className="rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-600">
                {order.status}
              </strong>
            </div>
          </div>

          <div className="mt-6 border-t border-orange-100 pt-4 text-center text-sm text-slate-500">
            Thank you for choosing ToyLand!
          </div>
        </div>
      )}

      
      <Link
        to="/products"
        className="mt-8 rounded-xl bg-orange-500 px-8 py-3.5 font-bold text-white shadow-md shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
      >
        Continue Shopping
      </Link>

      <p className="mt-5 text-sm text-[#64748B]">
        Happy shopping with ToyLand!
      </p>
    </section>
  );
}
