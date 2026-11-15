
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  PackageOpen,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "../hooks/useCart";
import Button from "../components/common/Button";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type CreateProductData,
} from "../services/products";

type SortOption = "featured" | "price-low" | "price-high" | "name";

const categories = [
  "All Categories",
  "Soft Toys",
  "Cars & Vehicles",
  "Building Blocks",
  "Puzzles & Games",
  "Educational Toys",
  "Dolls & Figures",
];

function formatPrice(price: number) {
  return `Rs. ${price.toLocaleString("en-LK")}`;
}

const emptyForm: CreateProductData = {
  name: "",
  description: "",
  price: 0,
  category: "Soft Toys",
  image: "",
  stock: 0,
};

const inputClass =
  "w-full rounded-xl border border-orange-100 bg-white/90 px-4 py-3 text-[#14284D] outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

export default function Products() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [sortOption, setSortOption] =
    useState<SortOption>("featured");

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [formData, setFormData] =
    useState<CreateProductData>(emptyForm);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // LOAD PRODUCTS

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      console.log("Products from API:", data);

      setProducts(data.filter((product) => product.isActive !== false));
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // FILTER AND SORT PRODUCTS

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
  }, [products, searchTerm, selectedCategory, sortOption]);

  // ADD TO CART

  function handleAddToCart(product: Product) {
    if ((product.stock ?? 0) <= 0) return;

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }

  // OPEN ADD FORM

  function openAddForm() {
    setEditingProduct(null);
    setFormData({ ...emptyForm });
    setShowForm(true);
  }

  // OPEN EDIT FORM

  function openEditForm(product: Product) {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
    });

    setShowForm(true);
  }

  // HANDLE FORM INPUTS

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  }

  // CREATE OR UPDATE PRODUCT

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingProduct) {
        const updatedProduct = await updateProduct(
          editingProduct._id,
          formData
        );

        setProducts((previous) =>
          previous.map((product) =>
            product._id === editingProduct._id
              ? updatedProduct
              : product
          )
        );
      } else {
        const newProduct = await createProduct(formData);

        setProducts((previous) => [
          newProduct,
          ...previous,
        ]);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({ ...emptyForm });
    } catch (err) {
      console.error(err);

      setError(
        editingProduct
          ? "Failed to update product."
          : "Failed to create product."
      );
    } finally {
      setSaving(false);
    }
  }

  // DELETE PRODUCT

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteProduct(id);

      setProducts((previous) =>
        previous.filter((product) => product._id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  // LOADING SCREEN

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="mt-4 font-semibold text-[#14284D]">
            Loading toys...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-[#FFF1D9] via-[#FFF8EA] to-[#FFD19B] text-[#14284D]">

      {/* HERO SECTION */}

      <section className="relative overflow-hidden border-b border-orange-200/50 bg-transparent px-4 py-12 sm:py-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="font-extrabold uppercase tracking-[0.2em] text-orange-600">
                Explore ToyLand
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-[#14284D] sm:text-5xl">
                Find Your Next Favourite Toy
              </h1>

              <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
                Discover toys that inspire imagination,
                creativity, and hours of fun.
              </p>
            </div>

            <Button
              type="button"
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 md:w-auto"
            >
              <Plus size={18} />
              Add Product
            </Button>

          </div>
        </div>
      </section>

      {/* ERROR MESSAGE */}

      {error && (
        <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        </div>
      )}

      {/* PRODUCTS SECTION */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* SEARCH AND SORT */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search toys by name..."
              className={`${inputClass} pl-12 shadow-sm`}
            />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal
              size={20}
              className="text-orange-600"
            />

            <label
              htmlFor="sortProducts"
              className="text-sm font-bold text-[#14284D]"
            >
              Sort by:
            </label>

            <select
              id="sortProducts"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
              className="rounded-xl border border-orange-100 bg-white px-3 py-3 text-[#14284D] outline-none shadow-sm focus:border-orange-400"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

        </div>

        {/* CATEGORY FILTERS */}

        <div className="mt-7 flex gap-3 overflow-x-auto pb-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                selectedCategory === category
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "border border-orange-200 bg-white/80 text-[#14284D] hover:border-orange-400 hover:bg-white hover:text-orange-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* PRODUCT COUNT */}

        <div className="mb-6 mt-5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#14284D]">
            Our Toys
          </h2>

          <p className="text-sm font-semibold text-slate-600">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* PRODUCT GRID */}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map((product) => (
              <article
                key={product._id}
                className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-md shadow-slate-900/5 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-300/40"
              >

                {/* PRODUCT IMAGE */}

                <div className="relative flex h-60 items-center justify-center overflow-hidden bg-linear-to-br from-orange-50 to-yellow-50">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-8xl">🧸</span>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-600 shadow-sm">
                    {product.category}
                  </span>
                </div>

                {/* PRODUCT DETAILS */}

                <div className="p-5">

                  <h3 className="min-h-12 text-lg font-extrabold text-[#14284D]">
                    {product.name}
                  </h3>

                  {/* RATING */}

                  {product.rating !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <Star
                        size={16}
                        fill="currentColor"
                        className="text-amber-400"
                      />

                      <span className="text-sm font-bold text-slate-700">
                        {product.rating}
                      </span>

                      {product.reviews !== undefined && (
                        <span className="text-sm text-slate-400">
                          ({product.reviews} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {/* PRICE */}

                  <div className="mt-4">
                    <span className="text-xl font-black text-orange-500">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* STOCK */}

                  <p
                    className={`mt-2 text-sm font-semibold ${
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>

                  {/* ADD TO CART */}

                  <Button
                    type="button"
                    disabled={product.stock <= 0}
                    className="mt-4 flex w-full items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </Button>

                  {/* EDIT AND DELETE */}

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={() => openEditForm(product)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === product._id}
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingId === product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>
              </article>
            ))}

          </div>
        ) : (

          /* EMPTY STATE */

          <div className="rounded-3xl border border-dashed border-orange-300 bg-white/70 px-4 py-16 text-center shadow-sm">
            <PackageOpen
              size={48}
              className="mx-auto text-orange-400"
            />

            <h3 className="mt-4 text-xl font-black text-[#14284D]">
              No toys found
            </h3>

            <p className="mt-2 text-slate-500">
              Try another search term or category.
            </p>

          </div>
        )}

      </section>

      {/* ADD / EDIT PRODUCT MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14284D]/60 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-orange-100 bg-[#FFFDF8] p-6 shadow-2xl sm:p-8">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-black text-[#14284D]">
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingProduct
                    ? "Update the toy details."
                    : "Add a new toy to ToyLand."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-orange-100 hover:text-orange-600"
              >
                <X size={22} />
              </button>

            </div>

            {/* PRODUCT FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#14284D]">
                  Toy Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="Enter toy name"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#14284D]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={inputClass}
                  placeholder="Enter toy description"
                />
              </div>

              {/* PRICE AND STOCK */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#14284D]">
                    Price (Rs.)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#14284D]">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className={inputClass}
                  />
                </div>

              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#14284D]">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                >
                  {categories
                    .filter((category) => category !== "All Categories")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              {/* IMAGE URL */}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#14284D]">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                  placeholder="/assets/teddy-bear.jpg"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Example: /assets/teddy-bear.jpg
                </p>
              </div>

              {/* FORM BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-orange-100 pt-5">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-orange-200 bg-white px-5 py-3 font-bold text-[#14284D] transition hover:bg-orange-50"
                >
                  Cancel
                </button>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </Button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
