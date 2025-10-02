import { useState, useEffect } from 'react';
import Hero from "../components/Hero";
import CategoryStrip from "../components/CategoryStrip";
import Features from "../components/Features";
import { FiShoppingCart } from "react-icons/fi";
import { getFeaturedProducts } from '../utils/api';
import { io } from 'socket.io-client';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();

    // Set up real-time updates for products
    const socket = io('http://localhost:5000');

    socket.on('product:created', (product) => {
      setFeaturedProducts(prev => [product, ...prev]);
    });

    socket.on('product:updated', (product) => {
      setFeaturedProducts(prev => prev.map(p => p._id === product._id ? product : p));
    });

    socket.on('product:deleted', ({ id }) => {
      setFeaturedProducts(prev => prev.filter(p => p._id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const products = await getFeaturedProducts();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching data:', error);
      // No fallback - only show backend products
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
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
    <>
      <Hero />
      <CategoryStrip />
      <Features />

      {/* Featured Products Section */}
      <section className="container-max mt-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800">FEATURED PRODUCTS</h2>
            <div className="h-1 w-16 bg-brand"></div>
          </div>
          <button className="bg-brand hover:bg-brand-dark text-white px-6 py-3 font-semibold rounded-lg transition-colors">
            VIEW ALL
          </button>
        </div>

        {/* Featured Products Grid */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        FEATURED
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">Stock: {product.stock || 0}</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart className="text-sm" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>

        {/* Bottom Category Tags */}
        <div className="mt-16 bg-gray-100 py-8 px-6 rounded-lg">
          <div className="flex items-center gap-8 overflow-x-auto">
            <div className="flex items-center gap-4">
              {[
                { letter: 'B', label: 'BLOG', tagline: 'BLOG TAGLINE' },
                { letter: 'D', label: 'DESIGN', tagline: 'DESIGN TAGLINE' },
                { letter: 'D', label: 'DRESS', tagline: 'DRESS TAGLINE' },
                { letter: 'F', label: 'FASHION', tagline: 'FASHION TAGLINE' },
                { letter: 'J', label: 'JACKET', tagline: 'JACKET TAGLINE' },
                { letter: 'S', label: 'SHOES', tagline: 'SHOES TAGLINE' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 min-w-[100px]">
                  <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-white font-bold text-lg">
                    {item.letter}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
}