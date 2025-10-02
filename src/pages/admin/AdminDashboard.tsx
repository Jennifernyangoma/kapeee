import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiShoppingBag, FiBarChart, FiUsers, FiHome, FiSettings } from 'react-icons/fi';
import { getProducts, getHeroContent, login } from '../../utils/api';
import { io } from 'socket.io-client';

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

interface HeroContent {
  _id: string;
  title: string;
  subtitle?: string;
  image?: string;
  active?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface Icon {
  _id: string;
  title: string;
  description: string;
  icon: string;
  iconType: "lucide" | "image";
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Socket connection for real-time updates
  useEffect(() => {
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
    
    socket.on('hero:updated', (hero) => {
      setHeroContent(prev => prev.map(h => h._id === hero._id ? hero : h));
    });

    socket.on('order:created', (order: Order) => {
      setOrders(prev => [order, ...prev]);
    });
    
    socket.on('order:updated', (order: Order) => {
      setOrders(prev => prev.map(o => o._id === order._id ? order : o));
    });
    
    socket.on('order:deleted', ({ id }: { id: string }) => {
      setOrders(prev => prev.filter(o => o._id !== id));
    });

    socket.on('icon:created', (icon: Icon) => {
      setIcons(prev => [icon, ...prev]);
    });
    
    socket.on('icon:updated', (icon: Icon) => {
      setIcons(prev => prev.map(i => i._id === icon._id ? icon : i));
    });
    
    socket.on('icon:deleted', ({ id }: { id: string }) => {
      setIcons(prev => prev.filter(i => i._id !== id));
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const [productsData, heroData, ordersResponse, iconsResponse, usersResponse] = await Promise.all([
        getProducts(),
        getHeroContent(),
        fetch('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).catch(() => []),
        fetch('http://localhost:5000/api/icons', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).catch(() => []),
        fetch('http://localhost:5000/api/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).catch(() => [])
      ]);
      setProducts(productsData);
      setHeroContent(heroData);
      setOrders(ordersResponse || []);
      setIcons(iconsResponse || []);
      setUsers(usersResponse || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(loginData.email, loginData.password);
      if (response.user.role === 'admin') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        setError('Admin access required');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setShowLogin(true);
    // Redirect to homepage after logout
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart },
    { id: 'products', label: 'Products', icon: FiShoppingBag },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'hero', label: 'Hero Content', icon: FiHome },
    { id: 'icons', label: 'Icons/Features', icon: FiSettings },
    { id: 'users', label: 'Users', icon: FiUsers },
  ];

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>Admin: mbonimana12@gmail.com / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">E-commerce Dashboard</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                Welcome, {JSON.parse(localStorage.getItem('user') || '{}').name}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden bg-white border-b px-4 py-2">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="text-lg" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="dashboard-content">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                          <FiShoppingBag className="text-blue-600 text-lg sm:text-xl" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-orange-100">
                          <FiShoppingBag className="text-orange-600 text-lg sm:text-xl" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{orders.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-green-100">
                          <FiHome className="text-green-600 text-lg sm:text-xl" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600">Hero Sections</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{heroContent.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                          <FiUsers className="text-purple-600 text-lg sm:text-xl" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-center">
                        <div className="p-2 sm:p-3 rounded-full bg-yellow-100">
                          <FiSettings className="text-yellow-600 text-lg sm:text-xl" />
                        </div>
                        <div className="ml-3 sm:ml-4">
                          <p className="text-xs sm:text-sm font-medium text-gray-600">Active Features</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {icons.filter(i => i.active).length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <ProductsTab products={products} setProducts={setProducts} />
              )}

              {activeTab === 'orders' && (
                <OrdersTab orders={orders} setOrders={setOrders} />
              )}

              {activeTab === 'hero' && (
                <HeroTab heroContent={heroContent} setHeroContent={setHeroContent} />
              )}

              {activeTab === 'icons' && (
                <IconsTab icons={icons} setIcons={setIcons} />
              )}

              {activeTab === 'users' && (
                <UsersTab users={users} setUsers={setUsers} />
              )}

              {activeTab === 'settings' && (
                <SettingsTab />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Products Management Component
function ProductsTab({ products, setProducts }: { products: Product[], setProducts: (products: Product[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    featured: false
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('featured', formData.featured.toString());
      
      // Add image files if any
      if (imageFiles) {
        Array.from(imageFiles).forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';
        
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const newProduct = await response.json();
        if (editingProduct) {
          setProducts(products.map(p => p._id === editingProduct._id ? newProduct : p));
          alert('Product updated successfully!');
        } else {
          setProducts([newProduct, ...products]);
          alert('Product created successfully!');
        }
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ title: '', description: '', price: '', category: '', stock: '', featured: false });
        setImageFiles(null);
        setPreviewImages([]);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      stock: product.stock?.toString() || '0',
      featured: product.featured || false
    });
    setPreviewImages(product.images || []);
    setImageFiles(null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImageFiles(files);
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);
          if (newPreviews.length === files.length) {
            // Append new previews to existing ones
            setPreviewImages(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteImage = async (productId: string, imageIndex: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/products/${productId}/images/${imageIndex}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // The socket will handle the real-time update
          alert('Image deleted successfully!');
        } else {
          const error = await response.json();
          alert(`Error: ${error.message || 'Failed to delete image'}`);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Error deleting image. Please try again.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p._id !== id));
          alert('Product deleted successfully!');
        } else {
          const error = await response.json();
          alert(`Error: ${error.message || 'Failed to delete product'}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Product
                </label>
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">You can select multiple images (max 5)</p>
              </div>
              
              {/* Image Previews */}
              {previewImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Previews</label>
                  <div className="grid grid-cols-2 gap-2">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editingProduct) {
                              // Delete existing image
                              handleDeleteImage(editingProduct._id, index);
                            } else {
                              // Remove from preview
                              const newPreviews = previewImages.filter((_, i) => i !== index);
                              setPreviewImages(newPreviews);
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFormData({ title: '', description: '', price: '', category: '', stock: '', featured: false });
                    setImageFiles(null);
                    setPreviewImages([]);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {product.images.length > 0 ? (
                  <div className="flex gap-1">
                    {product.images.slice(0, 3).map((image, index) => (
                      <div key={index} className="relative">
                        <img className="h-16 w-16 rounded-lg object-cover" src={image} alt={product.title} />
                        <button
                          onClick={() => handleDeleteImage(product._id, index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {product.images.length > 3 && (
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        +{product.images.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FiShoppingBag className="text-gray-400 text-xl" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.featured ? 'Featured' : 'Regular'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">Stock: {product.stock || 0}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {product.images.length > 0 ? (
                          <div className="flex gap-1">
                            {product.images.slice(0, 2).map((image, index) => (
                              <div key={index} className="relative">
                                <img className="h-10 w-10 rounded-lg object-cover" src={image} alt={product.title} />
                                <button
                                  onClick={() => handleDeleteImage(product._id, index)}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {product.images.length > 2 && (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                +{product.images.length - 2}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FiShoppingBag className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Orders Management Component
function OrdersTab({ orders, setOrders }: { orders: Order[], setOrders: (orders: Order[]) => void }) {
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update order");
      alert('Order status updated successfully!');
    } catch (error) {
      console.error("Error updating status:", error);
      alert('Failed to update order status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete order");
      alert('Order deleted successfully!');
    } catch (error) {
      console.error("Error deleting order:", error);
      alert('Failed to delete order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "processing":
        return "bg-blue-200 text-blue-800";
      case "shipped":
        return "bg-purple-200 text-purple-800";
      case "delivered":
        return "bg-green-200 text-green-800";
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <div className="text-sm text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{order.orderNumber}</td>
                  <td className="p-3">
                    <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                    <div className="text-xs text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="p-3 text-center">{order.items.length}</td>
                  <td className="p-3 font-semibold text-green-700">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border p-1 rounded text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => setViewOrder(order)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold mb-2">Order Details</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-semibold">Order #:</span> <span className="font-mono">{viewOrder.orderNumber}</span></div>
                <div><span className="font-semibold">Status:</span> <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewOrder.status)}`}>{viewOrder.status.toUpperCase()}</span></div>
                <div><span className="font-semibold">Customer:</span> {viewOrder.user.name}</div>
                <div><span className="font-semibold">Email:</span> {viewOrder.user.email}</div>
                <div><span className="font-semibold">Phone:</span> {viewOrder.user.phone}</div>
                <div><span className="font-semibold">Payment:</span> {viewOrder.paymentMethod}</div>
              </div>
              <div className="mt-2">
                <span className="font-semibold text-sm">Shipping Address:</span>
                <p className="text-sm text-gray-600">
                  {viewOrder.shippingAddress.street}, {viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.state} {viewOrder.shippingAddress.zipCode}, {viewOrder.shippingAddress.country}
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-3">Order Items</h3>
            <div className="space-y-3">
              {viewOrder.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b pb-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <button
                onClick={() => setViewOrder(null)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Close
              </button>
              <p className="text-xl font-bold">Total: ${viewOrder.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hero Content Management Component
function HeroTab({ heroContent, setHeroContent }: { heroContent: HeroContent[], setHeroContent: (content: HeroContent[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    order: 0,
    active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const heroData = {
        ...formData,
        order: parseInt(formData.order.toString())
      };

      const url = editingHero 
        ? `http://localhost:5000/api/hero/${editingHero._id}`
        : 'http://localhost:5000/api/hero';
        
      const response = await fetch(url, {
        method: editingHero ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(heroData)
      });

      if (response.ok) {
        const updatedHero = await response.json();
        if (editingHero) {
          setHeroContent(heroContent.map(h => h._id === editingHero._id ? updatedHero : h));
          alert('Hero content updated successfully!');
        } else {
          setHeroContent([...heroContent, updatedHero]);
          alert('Hero content created successfully!');
        }
        setShowForm(false);
        setEditingHero(null);
        setFormData({ title: '', subtitle: '', image: '', order: 0, active: true });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save hero content'}`);
      }
    } catch (error) {
      console.error('Error saving hero content:', error);
      alert('Error saving hero content. Please try again.');
    }
  };

  const handleEdit = (hero: HeroContent) => {
    setEditingHero(hero);
    setFormData({
      title: hero.title,
      subtitle: hero.subtitle || '',
      image: hero.image || '',
      order: hero.order || 0,
      active: hero.active !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hero content?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/hero/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setHeroContent(heroContent.filter(h => h._id !== id));
          alert('Hero content deleted successfully!');
        } else {
          const error = await response.json();
          alert(`Error: ${error.message || 'Failed to delete hero content'}`);
        }
      } catch (error) {
        console.error('Error deleting hero content:', error);
        alert('Error deleting hero content. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hero Content Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus />
          Add Hero Section
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {editingHero ? 'Edit Hero Section' : 'Add New Hero Section'}
          </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingHero ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingHero(null);
                    setFormData({ title: '', subtitle: '', image: '', order: 0, active: true });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {heroContent.map((hero) => (
          <div key={hero._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {hero.image && (
              <img src={hero.image} alt={hero.title} className="w-full h-32 sm:h-40 lg:h-48 object-cover" />
            )}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{hero.title}</h3>
              {hero.subtitle && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{hero.subtitle}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  hero.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {hero.active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Order: {hero.order}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(hero)}
                  className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <FiEdit className="text-xs" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hero._id)}
                  className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                >
                  <FiTrash2 className="text-xs" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Icons/Features Management Component  
function IconsTab({ icons, setIcons }: { icons: Icon[], setIcons: (icons: Icon[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingIcon, setEditingIcon] = useState<Icon | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    iconType: 'lucide' as 'lucide' | 'image',
    order: 0,
    active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('icon', formData.icon);
      formDataToSend.append('iconType', formData.iconType);
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('active', formData.active.toString());
      
      if (formData.iconType === 'image' && imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const url = editingIcon 
        ? `http://localhost:5000/api/icons/${editingIcon._id}`
        : 'http://localhost:5000/api/icons';
        
      const response = await fetch(url, {
        method: editingIcon ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert(editingIcon ? 'Icon updated successfully!' : 'Icon created successfully!');
        setShowForm(false);
        setEditingIcon(null);
        setFormData({ title: '', description: '', icon: '', iconType: 'lucide', order: 0, active: true });
        setImageFile(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save icon'}`);
      }
    } catch (error) {
      console.error('Error saving icon:', error);
    }
  };

  const handleEdit = (icon: Icon) => {
    setEditingIcon(icon);
    setFormData({
      title: icon.title,
      description: icon.description,
      icon: icon.icon,
      iconType: icon.iconType,
      order: icon.order,
      active: icon.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this icon?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/icons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        alert('Icon deleted successfully!');
      } else {
        alert('Failed to delete icon');
      }
    } catch (error) {
      console.error('Error deleting icon:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Icons/Features Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus />
          Add Icon/Feature
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingIcon ? 'Edit Icon/Feature' : 'Add New Icon/Feature'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Type</label>
                <select
                  value={formData.iconType}
                  onChange={(e) => setFormData({ ...formData, iconType: e.target.value as 'lucide' | 'image' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lucide">Lucide Icon (Name)</option>
                  <option value="image">Image Upload</option>
                </select>
              </div>
              {formData.iconType === 'lucide' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Truck, Shield, CreditCard"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Use Lucide React icon names</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Icon Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="iconActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="iconActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingIcon ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingIcon(null);
                    setFormData({ title: '', description: '', icon: '', iconType: 'lucide', order: 0, active: true });
                    setImageFile(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {icons.map((icon) => (
          <div key={icon._id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              {icon.iconType === 'image' ? (
                <img src={icon.icon} alt={icon.title} className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-mono">{icon.icon}</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{icon.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{icon.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    icon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {icon.active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">Order: {icon.order}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(icon)}
                className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(icon._id)}
                className="flex-1 bg-red-600 text-white py-1 px-3 rounded text-xs hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Users Management Component
function UsersTab({ users, setUsers }: { users: User[], setUsers: (users: User[]) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Registered Users</h2>
        <div className="text-sm text-gray-600">
          Total Users: {users.length}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{user.name}</td>
                  <td className="p-3 text-gray-600">{user.email}</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date((user as any).createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Settings Component
function SettingsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-600">Settings functionality will be implemented here.</p>
      </div>
    </div>
  );
}
