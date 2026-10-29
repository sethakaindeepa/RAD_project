
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  
  ShoppingCart,
  
  Truck,
  ShieldCheck,
  Headset,
  ArrowRight,
  

  Star,
  Heart,
} from "lucide-react";

import heroImage from "../assets/hero-toys.png";
import softToysImg from "../assets/soft-toys.jpg";
import carsImg from "../assets/cars.jpg";
import buildingBlocksImg from "../assets/building-blocks.jpg";
import puzzlesImg from "../assets/puzzles.jpg";
import robotsImg from "../assets/robots.jpg";
import dollsImg from "../assets/dolls.jpg";
import teddyBearImg from "../assets/teady-bear.jpg";
import rcCarImg from "../assets/remote-control car.jpg";
import buildingBlockImg from "../assets/building-block.jpg";
import puzzle from "../assets/puzzle.jpg";
import educationalToy from "../assets/educational_toy.jpg";
import doll from "../assets/doll.jpg";

import { useCart } from "../hooks/useCart";

export const categories = [
  {
    name: "Soft Toys",
    image: softToysImg,
    color: "bg-orange-50",
    path: "/shop?category=soft-toys",
  },
  {
    name: "Cars & Vehicles",
    image: carsImg,
    color: "bg-sky-50",
    path: "/shop?category=cars",
  },
  {
    name: "Building Blocks",
    image: buildingBlocksImg,
    color: "bg-green-50",
    path: "/shop?category=blocks",
  },
  {
    name: "Puzzles & Games",
    image: puzzlesImg,
    color: "bg-purple-50",
    path: "/shop?category=puzzles",
  },
  {
    name: "Educational Toys",
    image: robotsImg,
    color: "bg-cyan-50",
    path: "/shop?category=educational",
  },
  {
    name: "Dolls & Figures",
    image: dollsImg,
    color: "bg-pink-50",
    path: "/shop?category=dolls",
  },
];

export const products = [
  {
    id: 1,
    name: "Teddy Bear",
    category: "Soft Toys",
    image: teddyBearImg,
    price: 2500,
    rating: 4.8,
    reviews: 24,
    badge: "New",
    color: "bg-orange-50",
  },
  {
    id: 2,
    name: "Remote Control Car",
    category: "Cars & Vehicles",
    image: rcCarImg,
    price: 4990,
    oldPrice: 5900,
    rating: 4.7,
    reviews: 18,
    badge: "-15%",
    color: "bg-red-50",
  },
  {
    id: 3,
    name: "Building Blocks Set",
    category: "Building Blocks",
    image: buildingBlockImg,
    price: 3200,
    rating: 4.9,
    reviews: 32,
    badge: "Popular",
    color: "bg-green-50",
  },
  {
    id: 4,
    name: "Animal Puzzle",
    category: "Puzzles & Games",
    image: puzzle,
    price: 2800,
    rating: 4.6,
    reviews: 17,
    badge: "New",
    color: "bg-purple-50",
  },
  {
    id: 5,
    name: "Science Microscope Kit",
    category: "Educational Toys",
    image: educationalToy,
    price: 5500,
    rating: 4.8,
    reviews: 11,
    badge: "Popular",
    color: "bg-cyan-50",
  },
  {
    id: 6,
    name: "Princess Doll",
    category: "Dolls & Figures",
    image: doll,
    price: 3900,
    rating: 4.7,
    reviews: 20,
    badge: "New",
    color: "bg-pink-50",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  
  const { addToCart} = useCart();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#14284D]">
      

      

      <section className="relative overflow-hidden bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />

        <div className="mx-auto grid min-h-90 max-w-330 items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-10">
          <div className="relative z-10">
            <p className="text-sm font-extrabold uppercase tracking-wide text-orange-600">
              Welcome to ToyLand!
            </p>
            <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Make Every Moment
              <span className="block text-orange-500">Playful!</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              Discover amazing toys, educational games and unforgettable gifts for every little adventurer.
            </p>
            <a
              href="#products"
              className="mt-5 inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Shop Now <ArrowRight size={18} />
            </a>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-4">
              <div className="flex items-center gap-2">
                <Truck size={22} />
                <div>
                  <p className="text-[11px] font-extrabold">Free Shipping</p>
                  <p className="text-[10px] text-slate-500">Orders over Rs. 5,000</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={22} />
                <div>
                  <p className="text-[11px] font-extrabold">Secure Payment</p>
                  <p className="text-[10px] text-slate-500">Safe and secure</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Headset size={22} />
                <div>
                  <p className="text-[11px] font-extrabold">24/7 Support</p>
                  <p className="text-[10px] text-slate-500">We're here to help</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-70 items-center justify-center md:min-h-85">
            <div className="absolute right-3 top-4 z-10 rotate-6 text-center text-orange-600">
              <p className="text-xl font-black italic sm:text-2xl">Small toys</p>
              <p className="text-xl font-black italic sm:text-2xl">Big dreams ♡</p>
            </div>
            <div className="w-full overflow-hidden rounded-3xl">
              <img
                src={heroImage}
                alt="Teddy bear surrounded by colorful toys"
                className="h-75 w-full object-cover md:h-90"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-wide text-orange-500">
              SHOP BY CATEGORY
            </p>
            <h2 className="mt-1 text-3xl font-bold text-gray-800">
              Explore Our Categories
            </h2>
          </div>
          <Link to="/shop" className="font-medium text-orange-500 hover:underline">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className={`${cat.color} group rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium tracking-wide text-orange-500">
              FEATURED TOYS
            </p>
            <h2 className="mt-1 text-3xl font-bold text-gray-800">Best Sellers</h2>
          </div>
        </div>
        
        <div className="mb-8 w-full max-w-md">
        <input
         type="text"
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         placeholder="Search toys..."
         className="w-full rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
         />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className={`${product.color} relative flex h-44 items-center justify-center p-4`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${
                  product.badge === "New"
                    ? "bg-green-500 text-white"
                    : product.badge === "Popular"
                    ? "bg-orange-500 text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {product.badge}
                </span>
                <button
                  type="button"
                  aria-label={`Add ${product.name} to favorites`}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Heart size={14} className="text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-gray-800">
                  {product.name}
                </h3>
                <div className="mb-3 flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-orange-600">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {"oldPrice" in product && product.oldPrice && (
                      <span className="ml-1 text-xs text-gray-400 line-through">
                        Rs. {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })}
                    aria-label={`Add ${product.name} to cart`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="col-span-full py-10 text-center text-slate-500">
              No toys match your search.
            </p>
          )}
        </div>
      </section>

      <footer id="about" className="bg-white">
        <div className="mx-auto flex max-w-330 flex-col justify-between gap-4 px-6 py-7 sm:flex-row sm:items-center">
          <Link to="/" className="text-xl font-black">
            Toy<span className="text-orange-500">Land</span> 🧸
          </Link>
          <p className="text-xs text-slate-500">
            Bringing smiles to little adventurers. © 2026 ToyLand.
          </p>
          <p className="text-xs font-semibold text-slate-500">
            Made with care in Sri Lanka 🇱🇰
          </p>
        </div>
      </footer>
    </div>
  );
}
