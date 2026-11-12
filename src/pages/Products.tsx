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

  

  async function loadProducts() {
    
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      console.log("Products from API:", data);

      setProducts(data);
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
        result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    searchTerm,
    selectedCategory,
    sortOption,
  ]);

  

  function handleAddToCart(product: Product) {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }



  function openAddForm() {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowForm(true);
  }

  

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

  

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (editingProduct) {
        // UPDATE
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
        // CREATE
        const newProduct = await createProduct(formData);

        setProducts((previous) => [
          newProduct,
          ...previous,
        ]);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData(emptyForm);
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

  

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

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

  

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading toys...
        </p>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gray-50">

      
      <section className="bg-orange-50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="font-semibold uppercase tracking-widest text-orange-600">
                Explore ToyLand
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-5xl">
                Find Your Next Favourite Toy
              </h1>

              <p className="mt-4 max-w-2xl text-gray-600">
                Discover toys that inspire imagination,
                creativity, and hours of fun.
              </p>
            </div>

            
            <Button
              type="button"
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 md:w-auto"
            >
              <Plus size={18} />
              Add Product
            </Button>

          </div>
        </div>
      </section>

      
      {error && (
        <div className="mx-auto mt-6 max-w-7xl px-4">
          <div className="rounded-xl bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        </div>
      )}

      
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:max-w-md">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search toys by name..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <SlidersHorizontal
              size={20}
              className="text-gray-500"
            />

            <label
              htmlFor="sortProducts"
              className="text-sm font-medium text-gray-600"
            >
              Sort by:
            </label>

            <select
              id="sortProducts"
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value as SortOption
                )
              }
              className="rounded-xl border border-gray-200 bg-white px-3 py-3 outline-none focus:border-orange-500"
            >
              <option value="featured">
                Featured
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="name">
                Name: A to Z
              </option>
            </select>
          </div>
        </div>

        
        <div className="mt-7 flex gap-3 overflow-x-auto pb-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
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

        
        <div className="mb-6 mt-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Our Toys
          </h2>

          <p className="text-sm text-gray-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "product"
              : "products"}
          </p>
        </div>

       
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map((product) => (
              <article
                key={product._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

               
                <div className="relative flex h-60 items-center justify-center overflow-hidden bg-gray-100">

                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                  />

                </div>

                
                <div className="p-5">

                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                    {product.category}
                  </p>

                  <h3 className="mt-2 min-h-12 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  
                  {product.rating !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <Star
                        size={16}
                        fill="currentColor"
                        className="text-amber-400"
                      />

                      <span className="text-sm font-semibold text-gray-700">
                        {product.rating}
                      </span>

                      {product.reviews !== undefined && (
                        <span className="text-sm text-gray-400">
                          ({product.reviews} reviews)
                        </span>
                      )}
                    </div>
                  )}

                 
                  <div className="mt-4">
                    <span className="text-xl font-extrabold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  
                  <p
                    className={`mt-2 text-sm font-medium ${
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </p>

                  
                  <Button
                    type="button"
                    disabled={product.stock === 0}
                    className="mt-4 flex w-full items-center justify-center gap-2"
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </Button>

                  
                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(product)
                      }
                      className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingId === product._id
                      }
                      onClick={() =>
                        handleDelete(product._id)
                      }
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
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

          </div>
        )}

      </section>

      
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingProduct
                    ? "Update the toy details."
                    : "Add a new toy to ToyLand."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Toy Name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder="Enter toy name"
                />
              </div>

              
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  placeholder="Enter toy description"
                />
              </div>

              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Price (Rs.)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

              </div>

              
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                >
                  {categories
                    .filter(
                      (category) =>
                        category !== "All Categories"
                    )
                    .map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
                  placeholder="/assets/teddy-bear.jpg"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Example: /assets/teddy-bear.jpg
                </p>
              </div>

              
              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50"
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