import { Search, UserRound, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-6 py-4">
        <Link to="/" className="shrink-0 text-3xl font-extrabold">
          <span>🧸 Toy</span>
          <span className="text-orange-600">Land</span>
        </Link>

        <div className="hidden flex-1 items-center gap-3 rounded-full bg-slate-100 px-5 py-4 md:flex">
          <Search className="text-orange-600" size={22} />
          <input
            type="text"
            placeholder="Search for toys, games and more..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-orange-500">
            Home
          </Link>

          <Link to="/products" className="hover:text-orange-500">
            Products
          </Link>

          <Link to="/login" className="hover:text-orange-500">
            Login/Register
          </Link>

          <Link to="/cart" className="hover:text-orange-500">
            Cart
          </Link>
          </nav>

        <Link to="/cart" className="relative shrink-0 p-2">
          <ShoppingCart size={27} />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-2 rounded-full bg-orange-600 px-2 py-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>

        <Link to="/login" className="lg:hidden">
          <UserRound size={24} />
        </Link>
      </div>
    </header>
  );
}