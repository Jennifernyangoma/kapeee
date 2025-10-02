// components/SearchBar.tsx
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getProducts } from "../utils/api";
import { Link } from "react-router-dom";

/**
 * SearchBar Component
 * 
 * Provides product search functionality with:
 * - Real-time search as user types
 * - Category filtering dropdown
 * - Search results dropdown with product previews
 * - Links to individual product pages
 */

interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    );
  }, [query, products]);

  return (
    <div className="relative w-full max-w-2xl">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex overflow-hidden rounded-lg bg-white"
        aria-label="site search"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 outline-none text-gray-700"
          placeholder="Search for products, categories, brands, sku..."
          aria-label="Search products"
        />
        <div className="flex items-center border-l border-gray-200">
          <select className="px-4 py-3 bg-transparent text-gray-600 outline-none cursor-pointer">
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Garden</option>
            <option>Sports</option>
          </select>
          <FiChevronDown className="text-gray-400 mr-2" />
        </div>
        <button 
          className="bg-brand hover:bg-brand-dark text-white px-6 py-3 transition-colors" 
          aria-label="search"
        >
          <FiSearch className="text-xl" />
        </button>
      </form>

      {/* Search dropdown results */}
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-lg bg-white shadow-lg z-40 border">
          {results.map((p) => (
            <li key={p._id} className="border-b last:border-none">
              <Link
                to={`/product/${p._id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50"
              >
                <img
                  src={p.images[0] || 'https://via.placeholder.com/48x48?text=No+Image'}
                  alt={p.title}
                  className="h-12 w-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{p.title}</p>
                  <p className="text-sm text-gray-500">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
