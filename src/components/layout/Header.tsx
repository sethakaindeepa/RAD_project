
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  UserRound,
} from "lucide-react";

import { useCart } from "../../hooks/useCart";

const links = [
  { label: "Home", path: "/homepage" },
  { label: "Shop Toys", path: "/shop" },
  { label: "Products", path: "/products"},
  { label: "Cart", path: "/cart"}
];

export default function Header() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { cartCount } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // Search products
  const handleSearch = () => {
    if (!query.trim()) return;

    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  // Search on Enter
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Close mobile menu when navigating
  const handleNavigation = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-white/90 shadow-sm backdrop-blur-lg">

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3.5">

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          onClick={handleNavigation}
          className="flex shrink-0 items-center gap-2.5 text-[28px] font-black tracking-tight text-[#14284D]"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#ffe6c8] text-2xl shadow-md shadow-orange-300/40">
            🧸
          </span>

          <span>
            Toy
            <span className="text-orange-500">Land</span>
          </span>
        </Link>

        {/* ================= DESKTOP SEARCH ================= */}

        <div className="group relative mx-4 hidden max-w-xl flex-1 lg:block">

          <Search
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for toys, games and more..."
            className="w-full rounded-full border-[1.5px] border-transparent bg-[#fff1e3] py-3 pl-12 pr-4 text-[15px] font-medium text-[#14284D] outline-none transition placeholder:text-slate-500/70 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />

        </div>

        {/* ================= DESKTOP NAVIGATION ================= */}

        <nav className="ml-auto hidden items-center gap-7 xl:flex">

          {links.map((link) => (

            <Link
              key={link.label}
              to={link.path}
              className="relative text-[15px] font-bold text-[#14284D] transition hover:text-orange-500 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-orange-500 after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>

          ))}

        </nav>

        {/* ================= HEADER ACTIONS ================= */}

        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-2">

          {/* LOGIN / REGISTER */}

          <Link
            to="/"
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-[#14284D] transition hover:bg-[#fff1e3] hover:text-orange-500 md:flex"
          >
            <UserRound size={19} />
            Login / Register
          </Link>

          {/* WISHLIST */}

          <button
            type="button"
            onClick={() => navigate("/wishlist")}
            className="relative grid h-11 w-11 place-items-center rounded-full text-[#14284D] transition hover:bg-[#fff1e3] hover:text-orange-500"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={21} />
          </button>

          {/* SHOPPING CART */}

          <Link
            to="/cart"
            className="relative grid h-11 w-11 place-items-center rounded-full bg-[#14284D] text-white transition hover:bg-orange-500"
            aria-label="Open cart"
            title="Shopping cart"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (

              <span
                key={cartCount}
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[11px] font-extrabold text-white ring-2 ring-white"
              >
                {cartCount}
              </span>

            )}

          </Link>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            className="grid h-11 w-11 place-items-center rounded-full text-[#14284D] transition hover:bg-[#fff1e3] xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>

        </div>

      </div>

      {/* ================= MOBILE MENU ================= */}

      {open && (

        <div className="border-t border-orange-100 bg-white px-6 pb-5 pt-4 shadow-lg xl:hidden">

          {/* MOBILE SEARCH */}

          <div className="relative mb-4">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search toys..."
              className="w-full rounded-full bg-[#fff1e3] py-3 pl-11 pr-4 text-sm font-medium text-[#14284D] outline-none focus:ring-4 focus:ring-orange-100"
            />

          </div>

          {/* MOBILE NAVIGATION */}

          <nav className="space-y-1">

            {links.map((link) => (

              <Link
                key={link.label}
                to={link.path}
                onClick={handleNavigation}
                className={`block rounded-xl px-4 py-3 font-bold transition hover:bg-[#fff1e3] hover:text-orange-500 ${
                  location.pathname === link.path
                    ? "bg-[#fff1e3] text-orange-500"
                    : "text-[#14284D]"
                }`}
              >
                {link.label}
              </Link>

            ))}

          </nav>

          {/* MOBILE LOGIN */}

          <Link
            to="/login"
            onClick={handleNavigation}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 font-extrabold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
          >
            <UserRound size={19} />
            Login / Register
          </Link>

        </div>

      )}

    </header>
  );
}
