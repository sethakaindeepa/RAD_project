
import { useState } from "react";
import { Search } from "lucide-react";

const categories = [
  { name: "All Toys", emoji: "🧸" },
  { name: "Soft Toys", emoji: "🐻" },
  { name: "Cars & Vehicles", emoji: "🚗" },
  { name: "Building Blocks", emoji: "🧱" },
  { name: "Puzzles & Games", emoji: "🧩" },
  { name: "Educational Toys", emoji: "🔬" },
  { name: "Dolls & Figures", emoji: "🎎" },
];

const products = [
  { id: 1, name: "Teddy Bear", price: 2500, category: "Soft Toys", image: "src/assets/teady-bear.jpg" },
  { id: 2, name: "Remote Control Car", price: 4990, category: "Cars & Vehicles", image: "src/assets/remote-control car.jpg" },
  { id: 3, name: "Building Blocks Set", price: 3200, category: "Building Blocks", image: "src/assets/building-block.jpg" },
  { id: 4, name: "Animal Puzzle", price: 2800, category: "Puzzles & Games", image: "src/assets/puzzle.jpg" },
  { id: 5, name: "Science Microscope Kit", price: 5500, category: "Educational Toys", image: "src/assets/educational_toy.jpg" },
  { id: 6, name: "Princess Doll", price: 3900, category: "Dolls & Figures", image: "src/assets/doll.jpg" },
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All Toys");
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Toys" ||
      product.category === selectedCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 font-semibold text-blue-600">
            DISCOVER THE FUN
          </p>
          <h1 className="text-3xl font-bold text-orange-500 sm:text-4xl">
            Shop All Toys
          </h1>
          <p className="mt-3 text-gray-600">
            Find something special for every little adventure.
          </p>
        </div>

        <div className="mb-8 flex max-w-xl items-center gap-3 rounded-xl border bg-white px-4 py-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for toys..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <h2 className="mb-4 text-xl font-bold">Categories</h2>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-xl border p-4 text-center transition ${
                selectedCategory === category.name
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <span className="mb-2 block text-3xl">
                {category.emoji}
              </span>
              <span className="text-sm font-medium">
                {category.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Our Products</h2>
          <span className="text-sm text-gray-500">
            {filteredProducts.length} products
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-gray-500">
            No toys found. Try another search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-56 items-center justify-center bg-white p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="p-5">
                  <p className="mb-2 text-xs font-medium text-blue-600">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-lg font-bold text-gray-900">
                    Rs. {product.price.toLocaleString("en-LK")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
