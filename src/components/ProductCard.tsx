import { useState } from "react";
import { FiHeart, FiEye, FiShoppingCart, FiX } from "react-icons/fi";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

/**
 * ProductCard Component
 * 
 * Displays product information in a card format with:
 * - Product image, title, price, and description
 * - Quick view modal for detailed product information
 * - Add to cart functionality
 * - Wishlist button (UI only)
 */

interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
  featured?: boolean;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!user) {
      // Show login modal
      setShowAuthModal(true);
      return;
    }

    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || 'https://via.placeholder.com/300x300?text=No+Image',
      quantity: 1
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
            FEATURED
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <FiHeart className="text-gray-600 hover:text-red-500" />
      </button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs uppercase text-gray-500 font-medium mb-1">{product.category || 'Uncategorized'}</p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
        
        {product.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">Stock: {product.stock || 0}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <FiEye className="text-sm" />
            Quick View
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <FiShoppingCart className="text-sm" />
            {user ? 'Add to Cart' : 'Login to Add'}
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Product Details</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/500x500?text=No+Image'}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={image}
                            alt={`${product.title} ${index + 2}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{product.category || 'Uncategorized'}</p>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.title}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock || 0}</span>
                    </div>
                    {product.description && (
                      <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart />
                      {user ? 'Add to Cart' : 'Login to Add'}
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <FiHeart />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
}