
import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  PackageOpen,
} from "lucide-react";

import { useCart } from "../hooks/useCart";
import Button from "../components/common/Button";

import teddyBear from "../assets/teady-bear.jpg";
import remoteControlCar from "../assets/remote-control car.jpg";
import buildingBlocks from "../assets/building-block.jpg";
import animalPuzzle from "../assets/puzzle.jpg";
import microscopeKit from "../assets/educational_toy.jpg";
import princessDoll from "../assets/doll.jpg";

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Teddy Bear",
    price: 2500,
    category: "Soft Toys",
    image: teddyBear,
    rating: 4.8,
    reviews: 120,
    badge: "Popular",
  },
  {
    id: 2,
    name: "Remote Control Car",
    price: 4990,
    oldPrice: 5900,
    category: "Cars & Vehicles",
    image: remoteControlCar,
    rating: 4.7,
    reviews: 85,
    badge: "Sale",
  },
  {
    id: 3,
    name: "Building Blocks Set",
    price: 3200,
    category: "Building Blocks",
    image: buildingBlocks,
    rating: 4.6,
    reviews: 64,
  },
  {
    id: 4,
    name: "Animal Puzzle",
    price: 2800,
    category: "Puzzles & Games",
    image: animalPuzzle,
    rating: 4.5,
    reviews: 42,
  },
  {
    id: 5,
    name: "Science Microscope Kit",
    price: 5500,
    category: "Educational Toys",
    image: microscopeKit,
    rating: 4.9,
    reviews: 38,
    badge: "Educational",
  },
  {
    id: 6,
    name: "Princess Doll",
    price: 3900,
    category: "Dolls & Figures",
    image: princessDoll,
    rating: 4.7,
    reviews: 57,
  },
];

const categories = [
  "All Categories",
  "Soft Toys",
  "Cars & Vehicles",
  "Building Blocks",
  "Puzzles & Games",
  "Educational Toys",
  "Dolls & Figures",
];

type SortOption = "featured" | "price-low" | "price-high" | "name";

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-LK")}`;
}

export default function Products() {
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [sortOption, setSortOption] =
    useState<SortOption>("featured");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    result = [...result];

    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        break;
    }

    return result;
  }, [searchTerm, selectedCategory, sortOption]);

  function handleAddToCart(product: Product) {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page heading */}
      <section className="bg-orange-50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-600">
            Explore ToyLand
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Find Your Next Favourite Toy
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Discover toys that inspire imagination, creativity,
            and hours of fun.
          </p>
        </div>
      </section>

      {/* Products section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search and sort */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search toys by name..."
              aria-label="Search products"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal
              size={20}
              className="shrink-0 text-gray-500"
            />

            <label
              htmlFor="sortProducts"
              className="shrink-0 text-sm font-medium text-gray-600"
            >
              Sort by:
            </label>

            <select
              id="sortProducts"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 outline-none focus:border-orange-500 md:flex-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-7 flex gap-3 overflow-x-auto pb-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-orange-500 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="mb-6 mt-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Our Toys
          </h2>

          <p className="text-sm text-gray-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-60 items-center justify-center overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                  />

                  {product.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      {product.badge}
                    </span>
                  )}

                  {product.oldPrice && (
                    <span className="absolute right-3 top-3 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                      {Math.round(
                        (1 - product.price / product.oldPrice) * 100
                      )}
                      % OFF
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                    {product.category}
                  </p>

                  <h3 className="mt-2 min-h-12 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <Star
                      size={16}
                      fill="currentColor"
                      className="text-amber-400"
                    />

                    <span className="text-sm font-semibold text-gray-700">
                      {product.rating}
                    </span>

                    <span className="text-sm text-gray-400">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xl font-extrabold text-gray-900">
                      {formatPrice(product.price)}
                    </span>

                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    className="mt-5 flex w-full items-center justify-center gap-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-16 text-center">
            <PackageOpen
              size={48}
              className="mx-auto text-gray-400"
            />

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No toys found
            </h3>

            <p className="mt-2 text-gray-500">
              Try another search term or category.
            </p>

            <Button
              type="button"
              variant="secondary"
              className="mt-5"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
                setSortOption("featured");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
