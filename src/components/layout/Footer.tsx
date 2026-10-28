
import { Link } from "react-router-dom";
import {
  ShoppingBag,
 
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-extrabold text-white">
              Toy<span className="text-orange-500">Land</span>
            </span>
          </Link>

          <p className="mt-4 text-sm leading-6">
            Discover toys that inspire creativity, learning, and
            unforgettable childhood memories.
          </p>

          <div className="mt-5 flex gap-4">
            <a href="https://facebook.com" aria-label="Facebook"
              className="hover:text-orange-400">
              <FaFacebook size={20} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram"
              className="hover:text-orange-400">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-orange-400">Products</Link></li>
            <li><Link to="/login" className="hover:text-orange-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-orange-400">Register</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Customer Service</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/shipping" className="hover:text-orange-400">Shipping Information</Link></li>
            <li><Link to="/returns" className="hover:text-orange-400">Returns & Refunds</Link></li>
            <li><Link to="/privacy" className="hover:text-orange-400">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-orange-400">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 shrink-0 text-orange-400" />
              <span>Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-orange-400" />
              <a href="mailto:support@toyland.example"
                className="hover:text-orange-400">
                support@toyland.example
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-orange-400" />
              <span>Contact details coming soon</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 px-6 py-5 text-center text-sm">
        © {new Date().getFullYear()} ToyLand. All rights reserved.
      </div>
    </footer>
  );
}
