import { useState } from "react";
import { FiGrid } from "react-icons/fi";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Men’s Clothing",
    children: ["T-Shirts", "Shirts", "Suits & Blazers", "Jackets"],
  },
  {
    name: "Women’s Clothing",
    children: ["Tops", "Jeans & Jeggings", "Coats & Blazers", "Lingerie"],
  },
  {
    name: "Accessories",
    children: ["Smart Wearables", "Headphones", "Speakers", "Handbags"],
  },
  {
    name: "Shoes",
    children: ["Sports Shoes", "Casual Shoes", "Formal Shoes", "Boots"],
  },
  { name: "Watches", children: ["Digital", "Analog", "Smart Watches"] },
];

export default function CategoryMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button className="btn-outline flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-md">
        <FiGrid /> <span className="font-semibold">Shop By Categories</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 z-30 mt-2 w-[min(90vw,900px)] rounded-2xl bg-white p-4 shadow-lg transition">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat.name}>
                <h4 className="mb-2 font-semibold">{cat.name}</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {cat.children.map((s) => (
                    <li key={s}>
                      <Link
                        to="/shop"
                        className="hover:text-black transition-colors"
                      >
                        {s}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
