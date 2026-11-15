
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";

import heroImage from "../assets/hero-toys.png";
import softToysImg from "../assets/soft-toys.jpg";
import carsImg from "../assets/cars.jpg";
import buildingBlocksImg from "../assets/building-blocks.jpg";
import puzzlesImg from "../assets/puzzles.jpg";
import robotsImg from "../assets/robots.jpg";
import dollsImg from "../assets/dolls.jpg";

import { useCart } from "../hooks/useCart";
import { getProducts, type Product } from "../services/products";



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



const ICONS = {
  truck: [
    "M2 6h11v10H2z",
    "M13 9h4l3 3v4h-7",
    "M6 19h.01",
    "M17 19h.01",
  ],

  shield: [
    "M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z",
    "m9 12 2 2 4-4",
  ],

  headset: [
    "M4 14v-2a8 8 0 0 1 16 0v2",
    "M4 14h3v5H5a1 1 0 0 1-1-1z",
    "M20 14h-3v5h2a1 1 0 0 0 1-1z",
  ],

  gift: [
    "M3 9h18v4H3z",
    "M5 13v8h14v-8",
    "M12 9v12",
    "M12 9c-2 0-4-1-4-3s2-2 4 1c2-3 4-3 4-1s-2 3-4 3z",
  ],

  heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z",

  cart: [
    "M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6",
    "M10 21h.01",
    "M18 21h.01",
  ],
};



type FeatureItem = [
  string[],
  string,
  string,
  string
];

const items: FeatureItem[] = [
  [
    ICONS.truck,
    "Free Shipping",
    "Orders over Rs. 5,000",
    "bg-[#ffe3c7] text-orange-600",
  ],
  [
    ICONS.shield,
    "Secure Payment",
    "Safe and secure checkout",
    "bg-[#d6f5ee] text-[#0e9d8a]",
  ],
  [
    ICONS.headset,
    "24/7 Support",
    "We're here to help",
    "bg-[#e2e0ff] text-[#6a4cff]",
  ],
  [
    ICONS.gift,
    "Gift Wrapping",
    "Free on every order",
    "bg-[#ffe0ec] text-[#ff3d6e]",
  ],
];



const BADGE: Record<string, string> = {
  New: "bg-[#00c566]",
  Popular: "bg-[#ff8a00]",
  Sale: "bg-[#ef4444]",
};



function Icon({
  d,
  className = "",
}: {
  d: string | string[];
  className?: string;
}) {
  const paths = Array.isArray(d) ? d : [d];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}



function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-[#fbbf24]">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {index < Math.round(rating) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}



function ProductCard({
  product,
  liked,
  onLike,
  onAdd,
}: {
  product: Product;
  liked: boolean;
  onLike: (id: string) => void;
  onAdd: (product: Product) => void;
}) {
  const rating = product.rating ?? 0;
  const reviews = product.reviews ?? 0;
  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;

  const oldPrice = product.oldPrice;
  const discount =
    oldPrice && oldPrice > product.price
      ? Math.round((1 - product.price / oldPrice) * 100)
      : 0;

 
  const tones = [
    "from-orange-100 to-yellow-50",
    "from-sky-100 to-cyan-50",
    "from-pink-100 to-purple-50",
    "from-green-100 to-emerald-50",
    "from-yellow-100 to-orange-50",
    "from-purple-100 to-pink-50",
  ];

  const tone =
    tones[
      product.name
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        tones.length
    ];

  let badge: "New" | "Popular" | "Sale" | undefined;

  if (discount > 0) {
    badge = "Sale";
  } else if (rating >= 4.7) {
    badge = "Popular";
  } else if (product._id) {
    badge = "New";
  }

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-md shadow-slate-900/5 ring-1 ring-black/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-300/40">

      

      <div
        className={`relative grid h-64 place-items-center overflow-hidden bg-linear-to-br ${tone}`}
      >
        

        <span className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/40" />

        <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/30" />

        

        {badge && (
          <span
            className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-extrabold text-white shadow-md ${
              BADGE[badge]
            }`}
          >
            {badge === "Sale" ? `-${discount}%` : badge}
          </span>
        )}

        

        <button
          type="button"
          onClick={() => onLike(product._id)}
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110"
        >
          <Heart
            size={20}
            className={`transition ${
              liked
                ? "fill-[#ff3d6e] text-[#ff3d6e]"
                : "text-slate-500"
            }`}
          />
        </button>

       

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="relative h-44 w-44 object-contain drop-shadow-xl transition duration-500 group-hover:-rotate-3 group-hover:scale-110"
          />
        ) : (
          <span className="relative text-8xl drop-shadow-xl transition duration-500 group-hover:-rotate-6 group-hover:scale-110">
            🧸
          </span>
        )}

        

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => onAdd(product)}
          className="absolute inset-x-4 bottom-4 translate-y-16 rounded-full bg-[#14284D] py-2.5 text-sm font-bold text-white opacity-0 shadow-lg transition duration-300 hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-gray-400 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {outOfStock ? "Out of Stock" : "Quick add +"}
        </button>
      </div>

      

      <div className="p-5">

       

        <div className="flex items-center gap-2">
          <Stars rating={rating} />

          <span className="text-xs font-semibold text-slate-400">
            {rating.toFixed(1)} ({reviews})
          </span>
        </div>

        

        <h3 className="mt-2 truncate text-lg font-extrabold text-slate-900">
          {product.name}
        </h3>

       

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-orange-500">
              Rs. {product.price.toLocaleString()}
            </span>

            {oldPrice && (
              <span className="text-sm text-slate-400 line-through">
                Rs. {oldPrice.toLocaleString()}
              </span>
            )}
          </div>

         

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to cart`}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/40 transition hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon d={ICONS.cart} className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}


const REVIEWS = [
  {
    name: "Nimali Perera",
    role: "Happy parent",
    avatar: "👩🏻",
    text: "The toys are lovely and the quality is excellent. My little one absolutely loves the teddy bear!",
  },
  {
    name: "Kasun Silva",
    role: "Happy parent",
    avatar: "👨🏻",
    text: "Great selection, reasonable prices and a smooth shopping experience. I will definitely order again.",
  },
  {
    name: "Tharushi Fernando",
    role: "Happy parent",
    avatar: "👩🏽",
    text: "I found a lovely educational toy for my child. The website made it easy to find exactly what I needed.",
  },
];



function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="mb-9">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
          Happy families
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          What parents <span className="text-orange-500">say</span>
        </h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          See why families love shopping at ToyLand.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map((review) => (
          <figure
            key={review.name}
            className="relative rounded-3xl bg-white p-7 shadow-lg shadow-slate-900/5 ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-200/50"
          >
            <span className="absolute right-6 top-3 font-serif text-7xl leading-none text-orange-200">“</span>
            <Stars rating={5} />
            <blockquote className="relative mt-4 leading-relaxed text-slate-600">
              {review.text}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#ffe6c8] text-2xl">
                {review.avatar}
              </span>
              <div>
                <div className="font-extrabold text-[#14284D]">{review.name}</div>
                <div className="text-sm text-slate-500">{review.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}



function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setDone(true);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 sm:pb-20">
      <div className="relative overflow-hidden rounded-[36px] bg-linear-to-br from-orange-400 via-orange-500 to-[#f45b76] px-6 py-14 text-center text-white shadow-2xl shadow-orange-500/30 sm:px-12">
        <span className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/15" />
        <span className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-yellow-300/30" />
        <span className="absolute left-[8%] top-10 hidden animate-bounce text-5xl sm:block">🎈</span>
        <span className="absolute bottom-10 right-[8%] hidden animate-bounce text-5xl sm:block">🎁</span>

        <div className="relative">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Join the ToyLand club 🎉
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-white/90 sm:text-lg">
            Get 10% off your first order, plus early access to new toys and special offers.
          </p>

          {done ? (
            <p className="mx-auto mt-8 inline-block rounded-full bg-white px-7 py-3.5 font-extrabold text-orange-600 shadow-lg">
              ✓ Thanks for your interest! Newsletter signup is coming soon.
            </p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="Enter your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-full px-6 py-4 font-medium text-[#14284D] outline-none ring-4 ring-transparent transition placeholder:text-slate-400 focus:ring-white/40"
              />
              <button
                type="submit"
                className="rounded-full bg-[#14284D] px-8 py-4 font-extrabold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#0d1c38]"
              >
                Subscribe
              </button>
            </form>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm font-bold text-white">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}



export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [wishlist, setWishlist] = useState<string[]>([]);

  const { addToCart } = useCart();

  

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(
        data.filter((product) => product.isActive !== false)
      );
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ================= WISHLIST =================

  const handleLike = (productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  

  const handleAddToCart = (product: Product) => {
    if ((product.stock ?? 0) <= 0) return;

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  

  return (
    <div className="min-h-screen bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B] text-[#14284D]">

      

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />

        <div className="mx-auto grid min-h-90 max-w-330 items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-10">

          

          <div className="relative z-10">

            <p className="text-sm font-extrabold uppercase tracking-wide text-orange-600">
              Welcome to ToyLand!
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Make Every Moment
              <span className="block text-orange-500">
                Playful!
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              Discover amazing toys, educational games and unforgettable
              gifts for every little adventurer.
            </p>

            <a
              href="#products"
              className="mt-5 inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Shop Now
              <ArrowRight size={18} />
            </a>

          </div>

         

          <div className="relative flex min-h-70 items-center justify-center md:min-h-85">

            <div className="absolute right-3 top-4 z-10 rotate-6 text-center text-orange-600">

              <p className="text-xl font-black italic sm:text-2xl">
                Small toys
              </p>

              <p className="text-xl font-black italic sm:text-2xl">
                Big dreams ♡
              </p>

            </div>

            <div className="w-full overflow-hidden rounded-3xl shadow-xl">

              <img
                src={heroImage}
                alt="Teddy bear surrounded by colorful toys"
                className="h-75 w-full object-cover md:h-90"
              />

            </div>

          </div>

        </div>

        

        <div className="relative z-10 mx-auto -mb-8 max-w-7xl px-6">

          <div className="grid gap-4 rounded-3xl border border-orange-100 bg-white/95 p-5 shadow-2xl shadow-orange-900/10 sm:grid-cols-2 lg:grid-cols-4">

            {items.map(([ic, title, subtitle, color]) => (

              <div
                key={title}
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-md shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/15"
              >

                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${color}`}
                >
                  <Icon
                    d={ic}
                    className="h-6 w-6"
                  />
                </span>

                <div>
                  <div className="font-extrabold">
                    {title}
                  </div>

                  <div className="text-sm text-slate-500">
                    {subtitle}
                  </div>
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      

      <section
        id="categories"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-6 pt-20"
      >

        <div className="mb-8 flex items-end justify-between gap-4">

          <div>
    <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-500">
      Browse by category
    </p>

    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
      Shop by <span className="text-orange-500">Category</span>
    </h2>
  </div>
          <Link
            to="/shop"
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-gray-700 shadow-md transition hover:text-orange-500"
          >
            View All →
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

          {categories.map((cat) => (

            <Link
              key={cat.name}
              to={cat.path}
              className={`
                group relative overflow-hidden rounded-3xl
                ${cat.color}
                p-5 text-center
                ring-2 ring-transparent
                transition duration-300
                hover:-translate-y-1.5
                hover:shadow-xl
              `}
            >

              <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/40 transition group-hover:scale-125" />

              <div className="relative mx-auto mb-3 grid h-24 w-24 place-items-center rounded-2xl bg-white/80 shadow-inner transition duration-300 group-hover:-rotate-3 group-hover:scale-110">

                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-20 w-20 object-contain"
                />

              </div>

              <h3 className="relative text-[15px] font-extrabold text-gray-800">
                {cat.name}
              </h3>

              <p className="relative mt-0.5 text-xs font-semibold text-gray-500">
                Explore toys
              </p>

            </Link>

          ))}

        </div>

      </section>

     

      <section
        id="products"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-12"
      >

       

        <div className="mb-8">
     <p className="text-sm font-extrabold tracking-wide text-orange-600">
       FEATURED TOYS
    </p>

     <h2 className="mt-1 text-3xl font-black text-gray-800 sm:text-4xl">
    Best Sellers
    </h2>

    <p className="mt-2 text-sm text-slate-500">
    Discover the toys everyone is loving right now.
    </p>
   </div>

        

        {loading && (

          <div className="py-16 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading toys...
            </p>

          </div>

        )}

        

        {!loading && error && (

          <div className="rounded-3xl bg-white/80 p-8 text-center shadow-sm">

            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-4 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Try Again
            </button>

          </div>

        )}

       

        {!loading && !error && (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
                liked={wishlist.includes(product._id)}
                onLike={handleLike}
                onAdd={handleAddToCart}
              />

            ))}

           

            {products.length === 0 && (
              <p className="col-span-full rounded-3xl bg-white/70 py-12 text-center font-medium text-slate-600">
                No toys available yet.
              </p>
            )}

          </div>

        )}

      </section>

      

      <Reviews />

      

      <Newsletter />

      

      

    </div>
  );
}
