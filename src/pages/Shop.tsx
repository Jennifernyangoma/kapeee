import { useState, useEffect } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { getProducts } from '../utils/api';
import { io } from 'socket.io-client';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

const categories = [
  'All',
  'Men\'s Fashion',
  'Women\'s Fashion',
  'Shoes',
  'Accessories',
  'Watches',
  'Jewellery',
  'Beauty & Care',
  'Bags & Backpacks'
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();

    // Set up real-time updates for products
    const socket = io('http://localhost:5000');

    socket.on('product:created', (product) => {
      setProducts(prev => [product, ...prev]);
    });

    socket.on('product:updated', (product) => {
      setProducts(prev => prev.map(p => p._id === product._id ? product : p));
    });

    socket.on('product:deleted', ({ id }) => {
      setProducts(prev => prev.filter(p => p._id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
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

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="container-max my-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-card">
            <h2 className="text-xl font-bold text-brand mb-6">Categories</h2>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-brand text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Promotional Element */}
            <div className="mt-8 flex items-center gap-4">
              
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </h1>
            <div className="text-sm text-gray-600">
              {filteredProducts.length} products found
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
}