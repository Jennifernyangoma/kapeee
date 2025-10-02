import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/api';

const womensCategories = [
  'Trousers & Capris',
  'Tops',
  'Shorts & Skirts', 
  'Lingerie & Nightwear',
  'Jeans',
  'Dresses'
];

export default function WomensFashion() {
  const [selectedCategory, setSelectedCategory] = useState('Tops');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container-max my-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-card">
            <h2 className="text-xl font-bold text-pink-500 mb-6">Women's Fashion</h2>
            <div className="h-1 w-16 bg-pink-500 mb-6"></div>
            <ul className="space-y-3">
              {womensCategories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-pink-500 text-white'
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
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                $35
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          {/* Hero Banner */}
          <div className="mb-8 relative overflow-hidden rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">NEW ARRIVAL</p>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">UP TO 70% Off</h1>
                <p className="text-gray-600">Discover our latest women's fashion collection</p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Women's Fashion"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {products.slice(0, 6).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
