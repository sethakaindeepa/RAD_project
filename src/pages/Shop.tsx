
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Grid2X2,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Minus,
  
  ArrowUp,
  PackageOpen,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  
  Loader2,
} from "lucide-react";

import { getProducts, type Product } from "../services/products";
import { useCart } from "../hooks/useCart";

const CATEGORIES = [
  { name: "Soft Toys", emoji: "🧸" },
  { name: "Cars & Vehicles", emoji: "🚗" },
  { name: "Building Blocks", emoji: "🧱" },
  { name: "Puzzles & Games", emoji: "🧩" },
  { name: "Educational Toys", emoji: "🤖" },
  { name: "Dolls & Figures", emoji: "👸" },
];

const AGE_GROUPS = [
  { id: "0-2", label: "0–2 yrs", emoji: "🍼" },
  { id: "3-5", label: "3–5 yrs", emoji: "🧸" },
  { id: "6-8", label: "6–8 yrs", emoji: "🧩" },
  { id: "9-12", label: "9–12 yrs", emoji: "🔬" },
  { id: "13+", label: "13+ yrs", emoji: "🎮" },
];

const CATEGORY_EMOJIS: Record<string, string> = {
  "Soft Toys": "🧸",
  "Cars & Vehicles": "🚗",
  "Building Blocks": "🧱",
  "Puzzles & Games": "🧩",
  "Educational Toys": "🤖",
  "Dolls & Figures": "👸",
};

const CATEGORY_BACKGROUNDS: Record<string, string> = {
  "Soft Toys": "from-[#fff1e3] to-[#ffd9b8]",
  "Cars & Vehicles": "from-[#e8f3ff] to-[#c9e2ff]",
  "Building Blocks": "from-[#e5f9ec] to-[#c4f0d3]",
  "Puzzles & Games": "from-[#f2ecff] to-[#ddd0ff]",
  "Educational Toys": "from-[#e0fbf8] to-[#bdf2ec]",
  "Dolls & Figures": "from-[#ffeaf2] to-[#ffcfe0]",
};


const MAX_PRICE = 10000;
const PAGE_SIZE = 9;

const formatPrice = (price: number) =>
  `Rs. ${price.toLocaleString("en-LK")}`;

type ShopProduct = Product & {
  _id?: string;
  id: string;
  category: string;
  stock?: number;
  isActive?: boolean;
  rating?: number;
  reviews?: number;
  oldPrice?: number;
  badge?: string;
  ages?: string[];
};

type FiltersState = {
  categories: string[];
  ages: string[];
  maxPrice: number;
  minRating: number;
  inStock: boolean;
  sale: boolean;
};

const initialFilters = (): FiltersState => ({
  categories: [],
  ages: [],
  maxPrice: MAX_PRICE,
  minRating: 0,
  inStock: false,
  sale: false,
});

function Stars({ rating = 0 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          className={
            star <= Math.round(rating)
              ? "fill-[#ffb400] text-[#ffb400]"
              : "fill-slate-200 text-slate-200"
          }
        />
      ))}
    </div>
  );
}

function getProductEmoji(category: string) {
  return CATEGORY_EMOJIS[category] || "🧸";
}

function getProductBackground(category: string) {
  return (
    CATEGORY_BACKGROUNDS[category] ||
    "from-[#fff1e3] to-[#ffd9b8]"
  );
}

function getDiscount(product: ShopProduct) {
  if (!product.oldPrice || product.oldPrice <= product.price) {
    return 0;
  }

  return Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-[#ecdfd0] py-5 first:pt-0 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mb-3 flex w-full items-center justify-between text-left text-[15px] font-black"
      >
        {title}

        <Plus
          size={17}
          className={`text-orange-500 transition ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>

      {open && (
        <div className="animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function CheckItem({
  checked,
  onChange,
  children,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-[#fff8f0]">
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 text-xs font-black text-white transition ${
          checked
            ? "border-orange-500 bg-orange-500"
            : "border-[#ecdfd0] bg-white group-hover:border-orange-500"
        }`}
      >
        {checked && "✓"}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <span className="flex-1 text-sm font-semibold">
        {children}
      </span>

      {count !== undefined && (
        <span className="rounded-full bg-[#fff8f0] px-2 py-0.5 text-xs font-bold text-slate-500">
          {count}
        </span>
      )}
    </label>
  );
}

function ProductCard({
  product,
  view,
  liked,
  onLike,
  onAdd,
  onView,
}: {
  product: ShopProduct;
  view: "grid" | "list";
  liked: boolean;
  onLike: (id: string) => void;
  onAdd: (product: ShopProduct) => void;
  onView: (product: ShopProduct) => void;
}) {
  const discount = getDiscount(product);
  const emoji = getProductEmoji(product.category);

  const isInStock =
    product.stock === undefined || product.stock > 0;

  return (
    <article
      className={`group overflow-hidden rounded-3xl bg-white shadow-md shadow-[#14284b]/5 ring-1 ring-black/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-200/60 ${
        view === "list" ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      
      <div
        className={`relative grid place-items-center overflow-hidden bg-linear-to-br ${getProductBackground(
          product.category
        )} ${
          view === "list"
            ? "h-56 sm:h-auto sm:w-64 sm:shrink-0"
            : "h-60"
        }`}
      >
        <span className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/40" />

        <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/30" />

       
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
          {discount > 0 && (
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
              -{discount}%
            </span>
          )}

          {!isInStock && (
            <span className="rounded-full bg-slate-600 px-3 py-1 text-xs font-extrabold text-white">
              Sold out
            </span>
          )}
        </div>

        
        <button
          type="button"
          onClick={() => onLike(product.id)}
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-md transition hover:scale-110"
        >
          <Heart
            size={20}
            className={
              liked
                ? "fill-[#ff3d6e] text-[#ff3d6e]"
                : "text-slate-500"
            }
          />
        </button>

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`relative h-40 w-40 object-contain drop-shadow-xl transition duration-500 group-hover:scale-110 ${
              !isInStock ? "grayscale opacity-60" : ""
            }`}
          />
        ) : (
          <span
            className={`relative text-8xl drop-shadow-xl transition duration-500 group-hover:rotate-6 group-hover:scale-110 ${
              !isInStock ? "grayscale opacity-60" : ""
            }`}
          >
            {emoji}
          </span>
        )}

        
        {view === "grid" && (
          <div className="absolute inset-x-4 bottom-4 flex translate-y-16 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onView(product)}
              className="flex-1 rounded-full bg-white py-2.5 text-sm font-bold shadow-lg transition hover:text-orange-500"
            >
              Quick view
            </button>

            <button
              type="button"
              disabled={!isInStock}
              onClick={() => onAdd(product)}
              className="flex-1 rounded-full bg-[#14284b] py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-orange-500 disabled:opacity-50"
            >
              Add +
            </button>
          </div>
        )}
      </div>

      
      <div
        className={`flex flex-col p-5 ${
          view === "list" ? "flex-1 justify-center" : ""
        }`}
      >
        <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-orange-500">
          {product.category}
        </p>

        <h3 className="truncate text-lg font-extrabold text-[#14284b]">
          {product.name}
        </h3>

        {product.rating !== undefined && (
          <div className="mt-1.5 flex items-center gap-2">
            <Stars rating={product.rating} />

            <span className="text-xs font-semibold text-slate-400">
              {product.rating.toFixed(1)}
              {product.reviews !== undefined &&
                ` (${product.reviews})`}
            </span>
          </div>
        )}

        {view === "list" && (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>
        )}

        <div
          className={`mt-3 flex items-center justify-between ${
            view === "list"
              ? "sm:justify-start sm:gap-8"
              : ""
          }`}
        >
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-xl font-black text-orange-500">
              {formatPrice(product.price)}
            </span>

            {product.oldPrice !== undefined &&
              product.oldPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
          </div>

          {view === "grid" ? (
            <button
              type="button"
              disabled={!isInStock}
              onClick={() => onAdd(product)}
              aria-label={`Add ${product.name} to cart`}
              className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-[#ff8a33] to-[#ff6a00] text-white shadow-lg shadow-orange-500/30 transition hover:scale-110 active:scale-95 disabled:opacity-40"
            >
              <ShoppingCart size={19} />
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onView(product)}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold ring-1 ring-[#ecdfd0] transition hover:text-orange-500 hover:ring-orange-500"
              >
                Quick view
              </button>

              <button
                type="button"
                disabled={!isInStock}
                onClick={() => onAdd(product)}
                className="rounded-full bg-linear-to-br from-[#ff8a33] to-[#ff6a00] px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-orange-500/30 transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                {isInStock ? "Add to cart" : "Sold out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function QuickView({
  product,
  onClose,
  onAdd,
  liked,
  onLike,
}: {
  product: ShopProduct | null;
  onClose: () => void;
  onAdd: (product: ShopProduct, quantity: number) => void;
  liked: boolean;
  onLike: (id: string) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const isInStock =
    product.stock === undefined || product.stock > 0;

  return (
    <div className="fixed inset-0 z-60 grid place-items-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#14284b]/60 backdrop-blur-sm"
      />

      <div className="relative grid max-h-[92vh] w-full max-w-4xl animate-in zoom-in-95 overflow-y-auto rounded-[4x] bg-white shadow-2xl md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow-lg hover:text-orange-500"
        >
          <X size={20} />
        </button>

        <div
          className={`relative grid min-h-70 place-items-center bg-linear-to-br ${getProductBackground(
            product.category
          )}`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-52 w-52 object-contain drop-shadow-xl"
            />
          ) : (
            <span className="text-[150px] leading-none drop-shadow-2xl">
              {getProductEmoji(product.category)}
            </span>
          )}
        </div>

        <div className="p-7 sm:p-9">
          <p className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
            {product.category}
          </p>

          <h2 className="mt-1 text-3xl font-black tracking-tight text-[#14284b]">
            {product.name}
          </h2>

          {product.rating !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <Stars rating={product.rating} />

              <span className="text-sm font-semibold text-slate-500">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

          <div className="mt-4 text-3xl font-black text-orange-500">
            {formatPrice(product.price)}
          </div>

          <p className="mt-4 leading-relaxed text-slate-600">
            {product.description}
          </p>

          <div className="mt-5">
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                isInStock
                  ? "bg-[#d6f5ee] text-[#0e9d8a]"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isInStock ? "✓ In stock" : "Sold out"}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-[#fff8f0] ring-1 ring-[#ecdfd0]">
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                className="h-12 w-12 rounded-full text-xl font-bold hover:text-orange-500"
              >
                <Minus size={16} className="mx-auto" />
              </button>

              <span className="w-8 text-center font-extrabold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((q) =>
                    product.stock !== undefined
                      ? Math.min(product.stock, q + 1)
                      : q + 1
                  )
                }
                disabled={
                  product.stock !== undefined &&
                  quantity >= product.stock
                }
                className="h-12 w-12 rounded-full text-xl font-bold hover:text-orange-500 disabled:opacity-40"
              >
                <Plus size={16} className="mx-auto" />
              </button>
            </div>

            <button
              type="button"
              disabled={!isInStock}
              onClick={() => {
                onAdd(product, quantity);
                onClose();
              }}
              className="flex-1 rounded-full bg-linear-to-br from-[#ff8a33] to-[#ff6a00] px-6 py-3.5 font-extrabold text-white shadow-xl shadow-orange-500/30 transition hover:-translate-y-0.5 disabled:opacity-40"
            >
              Add to cart · {formatPrice(product.price * quantity)}
            </button>

            <button
              type="button"
              onClick={() => onLike(product.id)}
              aria-label="Wishlist"
              className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-[#ecdfd0] transition hover:ring-[#ff3d6e]"
            >
              <Heart
                size={20}
                className={
                  liked
                    ? "fill-[#ff3d6e] text-[#ff3d6e]"
                    : "text-slate-500"
                }
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  pages,
  setPage,
}: {
  page: number;
  pages: number;
  setPage: (page: number) => void;
}) {
  if (pages <= 1) return null;

  const go = (number: number) => {
    setPage(number);

    document
      .getElementById("shop-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => go(page - 1)}
        aria-label="Previous page"
        className="grid h-11 min-w-11 place-items-center rounded-full bg-white px-3 ring-1 ring-[#ecdfd0] transition hover:text-orange-500 hover:ring-orange-500 disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: pages }, (_, i) => i + 1).map((number) => (
        <button
          type="button"
          key={number}
          onClick={() => go(number)}
          className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-extrabold transition ${
            number === page
              ? "bg-linear-to-br from-[#ff8a33] to-[#ff6a00] text-white shadow-lg shadow-orange-500/30"
              : "bg-white ring-1 ring-[#ecdfd0] hover:text-orange-500 hover:ring-orange-500"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        disabled={page === pages}
        onClick={() => go(page + 1)}
        aria-label="Next page"
        className="grid h-11 min-w-11 place-items-center rounded-full bg-white px-3 ring-1 ring-[#ecdfd0] transition hover:text-orange-500 hover:ring-orange-500 disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

export default function Shop() {
  const { addToCart, cartCount } = useCart();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState<ShopProduct | null>(null);

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState("");

 
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        const activeProducts = (response as ShopProduct[]).filter(
          (product) => product.isActive !== false
        );

        setProducts(activeProducts);
      } catch (err) {
        console.error("Shop products error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 2200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  
  const handleAddToCart = (
    product: ShopProduct,
    quantity = 1
  ) => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }

    setToast(`${product.name} added to cart`);
  };

  
  const toggleWishlist = (id: string) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  
  const toggleCategory = (category: string) => {
    setFilters((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
  };

  
  const toggleAge = (age: string) => {
    setFilters((current) => ({
      ...current,
      ages: current.ages.includes(age)
        ? current.ages.filter((item) => item !== age)
        : [...current.ages, age],
    }));
  };

  
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query.trim().toLowerCase()) ||
        product.category.toLowerCase().includes(query.trim().toLowerCase());

      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      const matchesPrice = product.price <= filters.maxPrice;

      const matchesAge =
        filters.ages.length === 0 ||
        (product.ages?.some((age) => filters.ages.includes(age)) ?? false);

      const matchesRating =
        filters.minRating === 0 ||
        (product.rating !== undefined &&
          product.rating >= filters.minRating);

      const matchesStock =
        !filters.inStock ||
        (product.stock !== undefined && product.stock > 0);

      const matchesSale =
        !filters.sale ||
        (product.oldPrice !== undefined &&
          product.oldPrice > product.price);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesAge &&
        matchesRating &&
        matchesStock &&
        matchesSale
      );
    });

    const sortFunctions: Record<
      string,
      (a: ShopProduct, b: ShopProduct) => number
    > = {
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      rate: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
      new: (a, b) => String(b.id).localeCompare(String(a.id)),
    };

    if (sort === "pop") {
      result = [...result].sort(
        (a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)
      );
    } else if (sortFunctions[sort]) {
      result = [...result].sort(sortFunctions[sort]);
    }

    return result;
  }, [products, filters, query, sort]);

  
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    CATEGORIES.forEach((category) => {
      counts[category.name] = products.filter(
        (product) =>
          product.category === category.name &&
          product.name.toLowerCase().includes(query.trim().toLowerCase())
      ).length;
    });

    return counts;
  }, [products, query]);

  
  useEffect(() => {
    setPage(1);
  }, [filters, query, sort]);

  const pages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const visibleProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  
  const activeCount =
    filters.categories.length +
    filters.ages.length +
    (filters.maxPrice < MAX_PRICE ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.sale ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const resetFilters = () => {
    setFilters(initialFilters());
    setQuery("");
  };

  const singleCategory =
    filters.categories.length === 1
      ? filters.categories[0]
      : null;

  const categoryEmoji = singleCategory
    ? getProductEmoji(singleCategory)
    : "🧸";

  const filterSidebar = (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-black">
          <SlidersHorizontal
            size={20}
            className="text-orange-500"
          />
          Filters
        </h2>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-bold text-orange-500 hover:underline"
          >
            Reset all
          </button>
        )}
      </div>

      <FilterGroup title="Category">
        {CATEGORIES.map((category) => (
          <CheckItem
            key={category.name}
            checked={filters.categories.includes(category.name)}
            onChange={() => toggleCategory(category.name)}
            count={categoryCounts[category.name]}
          >
            {category.emoji} {category.name}
          </CheckItem>
        ))}
      </FilterGroup>

      <FilterGroup title="Max price">
        <div className="px-1">
          <input
            type="range"
            min="500"
            max={MAX_PRICE}
            step="100"
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                maxPrice: Number(event.target.value),
              }))
            }
            className="w-full accent-orange-500"
            aria-label="Maximum price"
          />

          <div className="mt-3 flex items-center justify-between text-sm font-bold">
            <span className="rounded-full bg-[#fff8f0] px-3 py-1">
              Rs. 500
            </span>

            <span className="rounded-full bg-orange-500 px-3 py-1 text-white">
              {formatPrice(filters.maxPrice)}
            </span>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Age group">
        <div className="grid grid-cols-2 gap-2">
          {AGE_GROUPS.map((age) => (
            <button
              type="button"
              key={age.id}
              onClick={() => toggleAge(age.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold ring-1 transition ${
                filters.ages.includes(age.id)
                  ? "bg-orange-500 text-white ring-orange-500 shadow-md shadow-orange-500/30"
                  : "bg-white ring-[#ecdfd0] hover:ring-orange-500"
              }`}
            >
              <span>{age.emoji}</span>
              {age.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        {[4.5, 4, 3].map((rating) => (
          <button
            type="button"
            key={rating}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                minRating:
                  current.minRating === rating ? 0 : rating,
              }))
            }
            className={`mb-1.5 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold transition hover:bg-[#fff8f0] ${
              filters.minRating === rating
                ? "bg-[#fff1e3] ring-1 ring-orange-500"
                : ""
            }`}
          >
            <Stars rating={rating} />
            <span>{rating}+ & up</span>
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <CheckItem
          checked={filters.sale}
          onChange={() =>
            setFilters((current) => ({
              ...current,
              sale: !current.sale,
            }))
          }
        >
          🔥 On sale
        </CheckItem>

        <CheckItem
          checked={filters.inStock}
          onChange={() =>
            setFilters((current) => ({
              ...current,
              inStock: !current.inStock,
            }))
          }
        >
          ✅ In stock only
        </CheckItem>
      </FilterGroup>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fff8f0] text-[#14284b]">
      
      <section className="relative overflow-hidden bg-linear-to-br from-[#fff3e4] via-[#ffe6cb] to-[#ffd2a3]">
        <span className="absolute -left-20 -top-16 h-64 w-64 rounded-full bg-white/50 blur-2xl" />

        <span className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-[#ffc933]/30 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-10 sm:py-14">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#14284b]/60">
              <Link to="/" className="hover:text-orange-500">
                Home
              </Link>

              <span>/</span>

              <span className="text-[#14284b]">
                Shop
              </span>

              {singleCategory && (
                <>
                  <span>/</span>
                  <span className="text-[#14284b]">
                    {singleCategory}
                  </span>
                </>
              )}
            </nav>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              {singleCategory ? (
                <>
                  {categoryEmoji} {singleCategory}
                </>
              ) : (
                <>
                  Shop <span className="text-orange-500">All Toys</span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-lg text-[#14284b]/70">
              Find the perfect toy for every age and every adventure.
              Filter, compare and add your favourites to the cart.
            </p>

            <Link
              to="/cart"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#14284b] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-500"
            >
              <ShoppingCart size={17} />
              View Cart ({cartCount})
            </Link>
          </div>

          
        </div>
      </section>

      
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl bg-white p-6 shadow-lg shadow-[#14284b]/5 ring-1 ring-black/5">
              {filterSidebar}
            </div>

            
            <div className="mt-6 overflow-hidden rounded-3xl bg-linear-to-br from-[#ff8a33] to-[#ff3d6e] p-6 text-white shadow-xl shadow-orange-400/30">
              <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                Club offer
              </p>

              <p className="mt-1 text-xl font-black leading-tight">
                Get 10% off your first order
              </p>

              <p className="mt-1 text-sm text-white/85">
                Use code{" "}
                <b className="rounded bg-white/20 px-1.5 py-0.5">
                  PLAY10
                </b>
              </p>

              <div className="mt-2 text-5xl">🎁</div>
            </div>
          </aside>

          
          <section
            id="shop-results"
            className="min-w-0 scroll-mt-24"
          >
            
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-3xl bg-white p-3 pl-5 shadow-lg shadow-[#14284b]/5 ring-1 ring-black/5">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 rounded-full bg-[#14284b] px-4 py-2.5 text-sm font-extrabold text-white lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters

                {activeCount > 0 && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[11px]">
                    {activeCount}
                  </span>
                )}
              </button>

              <p className="text-sm font-semibold text-slate-500">
                <b className="text-[#14284b]">
                  {filteredProducts.length}
                </b>{" "}
                toys found
              </p>

              <div className="ml-auto flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort products"
                  className="max-w-47.5 rounded-full border-[1.5px] border-[#ecdfd0] bg-white px-4 py-2.5 text-sm font-bold outline-none focus:border-orange-500"
                >
                  <option value="featured">Featured</option>
                  <option value="pop">Most popular</option>
                  <option value="new">Newest</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="rate">Top rated</option>
                </select>

                <div className="hidden rounded-full bg-[#fff8f0] p-1 ring-1 ring-[#ecdfd0] sm:flex">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`grid h-9 w-10 place-items-center rounded-full transition ${
                      view === "grid"
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-slate-500 hover:text-orange-500"
                    }`}
                  >
                    <Grid2X2 size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`grid h-9 w-10 place-items-center rounded-full transition ${
                      view === "list"
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-slate-500 hover:text-orange-500"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            
            <div className="mb-5 relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
              />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for toys, games and more..."
                className="w-full rounded-full border border-[#ecdfd0] bg-white py-3 pl-12 pr-5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>

          
            {loading && (
              <div className="flex min-h-87.5 flex-col items-center justify-center rounded-3xl bg-white">
                <Loader2
                  size={40}
                  className="animate-spin text-orange-500"
                />

                <p className="mt-4 font-semibold text-slate-500">
                  Loading toys...
                </p>
              </div>
            )}

            
            {!loading && error && (
              <div className="rounded-3xl bg-white py-20 text-center shadow-md">
                <PackageOpen
                  size={48}
                  className="mx-auto text-orange-500"
                />

                <h3 className="mt-4 text-xl font-black">
                  Something went wrong
                </h3>

                <p className="mt-2 text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-full bg-orange-500 px-7 py-3 font-bold text-white hover:bg-orange-600"
                >
                  Try Again
                </button>
              </div>
            )}

            
            {!loading && !error && (
              <>
                {visibleProducts.length > 0 ? (
                  <>
                    <div
                      className={
                        view === "grid"
                          ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                          : "grid gap-5"
                      }
                    >
                      {visibleProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          view={view}
                          liked={wishlist.includes(product.id)}
                          onLike={toggleWishlist}
                          onAdd={handleAddToCart}
                          onView={setQuickView}
                        />
                      ))}
                    </div>

                    <Pagination
                      page={page}
                      pages={pages}
                      setPage={setPage}
                    />
                  </>
                ) : (
                  <div className="rounded-3xl bg-white py-24 text-center shadow-md ring-1 ring-black/5">
                    <div className="mb-3 text-7xl">🔍</div>

                    <h3 className="text-2xl font-black">
                      No toys match your filters
                    </h3>

                    <p className="mt-1 text-slate-500">
                      Try removing a filter or searching for something else.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-6 rounded-full bg-linear-to-br from-[#ff8a33] to-[#ff6a00] px-7 py-3 font-extrabold text-white shadow-lg shadow-orange-500/30"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-4 rounded-3xl bg-white p-6 shadow-lg shadow-[#14284b]/5 ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Truck size={23} />,
              title: "Free Shipping",
              text: "Orders over Rs. 5,000",
              bg: "bg-[#ffe3c7]",
            },
            {
              icon: <ShieldCheck size={23} />,
              title: "Secure Payment",
              text: "Safe and secure",
              bg: "bg-[#d6f5ee]",
            },
            {
              icon: <RotateCcw size={23} />,
              title: "Easy Returns",
              text: "14-day return policy",
              bg: "bg-[#e2e0ff]",
            },
            {
              icon: <Headset size={23} />,
              title: "Customer Support",
              text: "We're here to help",
              bg: "bg-[#ffe0ec]",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3.5"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl ${item.bg}`}
              >
                {item.icon}
              </span>

              <div>
                <div className="font-extrabold">
                  {item.title}
                </div>

                <div className="text-sm text-slate-500">
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <div
        onClick={() => setFiltersOpen(false)}
        className={`fixed inset-0 z-50 bg-[#14284b]/50 backdrop-blur-sm transition-opacity lg:hidden ${
          filtersOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-55 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          filtersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#ecdfd0] px-6 py-4">
          <span className="text-lg font-black">
            Filter Toys
          </span>

          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#fff8f0]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {filterSidebar}
        </div>

        <div className="border-t border-[#ecdfd0] p-5">
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="w-full rounded-full bg-linear-to-br from-[#ff8a33] to-[#ff6a00] py-3.5 font-extrabold text-white shadow-lg shadow-orange-500/30"
          >
            Show {filteredProducts.length} toys
          </button>
        </div>
      </aside>

      
      {quickView && (
        <QuickView
          product={quickView}
          onClose={() => setQuickView(null)}
          onAdd={handleAddToCart}
          liked={wishlist.includes(quickView.id)}
          onLike={toggleWishlist}
        />
      )}

      
      <div
        className={`fixed bottom-6 left-1/2 z-70 -translate-x-1/2 rounded-full bg-[#14284b] px-6 py-3.5 text-sm font-bold text-white shadow-2xl transition duration-300 ${
          toast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-20 opacity-0"
        }`}
      >
        {toast}
      </div>

      
      <button
        type="button"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-white shadow-xl shadow-orange-500/30 transition hover:scale-110"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
