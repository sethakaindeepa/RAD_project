import { Link } from "react-router-dom";
import { ArrowLeft, Mail, LockKeyhole } from "lucide-react";

export default function Login() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-orange-100 bg-white p-7 shadow-xl shadow-orange-100/60 sm:p-9">
        <Link to="/" className="text-sm font-bold text-orange-600"><ArrowLeft className="mr-1 inline" size={15} /> Back to ToyLand</Link>
        <div className="mt-6 text-4xl">🧸</div><h1 className="mt-3 text-3xl font-black">Welcome back!</h1><p className="mt-2 text-sm text-slate-500">Sign in to continue your little adventures.</p>
        <form onSubmit={(e) => { e.preventDefault(); alert("Login is a frontend demo. Connect your backend authentication here."); }} className="mt-7 space-y-4">
          <label className="block text-sm font-bold">Email address<span className="relative mt-2 block"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-normal outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" /></span></label>
          <label className="block text-sm font-bold">Password<span className="relative mt-2 block"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input type="password" required minLength={6} placeholder="Enter your password" className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm font-normal outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100" /></span></label>
          <button className="w-full rounded-full bg-orange-500 py-3.5 text-sm font-black text-white hover:bg-orange-600">Sign in</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">New to ToyLand? <Link to="/register" className="font-black text-orange-600">Create an account</Link></p>
      </div>
    </div>
  );
}
