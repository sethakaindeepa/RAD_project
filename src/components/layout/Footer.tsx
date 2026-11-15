
import { Link } from "react-router-dom";
import {
  
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[#263D65] bg-linear-to-r from-[#14284D] via-[#1E3A5F] to-[#243F68] text-white">

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}

          <div>
            <Link to="/" className="text-3xl font-black tracking-tight">
              Toy<span className="text-orange-400">Land</span> 🧸
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-blue-100">
              Bringing smiles to little adventurers. Discover amazing toys,
              educational games and unforgettable gifts for every child.
            </p>

            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 transition hover:bg-orange-500">
                <FaFacebook size={18} />
              </a>

              <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 transition hover:bg-orange-500">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}

          <div>
            <h3 className="mb-4 text-lg font-bold text-orange-400">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm text-blue-100">
              <li><Link to="/" className="transition hover:text-orange-400">Home</Link></li>
              <li><Link to="/shop" className="transition hover:text-orange-400">Shop Toys</Link></li>
              <li><Link to="/shop?category=soft-toys" className="transition hover:text-orange-400">Categories</Link></li>
              <li><Link to="/cart" className="transition hover:text-orange-400">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}

          <div>
            <h3 className="mb-4 text-lg font-bold text-orange-400">
              Customer Service
            </h3>

            <ul className="space-y-3 text-sm text-blue-100">
              <li><Link to="/login" className="transition hover:text-orange-400">My Account</Link></li>
              <li><Link to="/checkout" className="transition hover:text-orange-400">Checkout</Link></li>
              <li><a href="#" className="transition hover:text-orange-400">Shipping Information</a></li>
              <li><a href="#" className="transition hover:text-orange-400">Privacy Policy</a></li>
            </ul>
          </div>

          {/* CONTACT */}

          <div>
            <h3 className="mb-4 text-lg font-bold text-orange-400">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="shrink-0 text-orange-400" />
                Sri Lanka
              </li>

              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-orange-400" />
                Contact Support
              </li>

              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-orange-400" />
                Customer Support
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}

        <div className="mt-10 border-t border-white/15 pt-6 text-center">
          <p className="text-sm text-blue-200">
            © 2026 ToyLand. All rights reserved.
          </p>

          <p className="mt-2 text-xs font-medium text-blue-300">
            Made with care in Sri Lanka 🇱🇰
          </p>
        </div>

      </div>
    </footer>
  );
}
