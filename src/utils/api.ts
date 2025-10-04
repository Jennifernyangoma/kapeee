const API_BASE_URL = 'http://localhost:5000/api';

export interface Product {
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

export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  image?: {
    url: string;
    alt?: string;
  };
  icon?: string;
  parent?: {
    _id: string;
    name: string;
    slug: string;
  };
  children: Array<{
    _id: string;
    name: string;
    slug: string;
    image?: {
      url: string;
      alt?: string;
    };
  }>;
  level: number;
  path: string[];
  isActive: boolean;
  sortOrder: number;
  featured: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface HeroContent {
  _id: string;
  title: string;
  subtitle?: string;
  image?: string;
  active?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  _id: string;
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  footerText: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    image: string;
  };
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
  total: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  items: Array<{
    product: {
      _id: string;
      title: string;
      images: Array<{ url: string; alt?: string }>;
      price: number;
    };
    quantity: number;
    price: number;
    variant?: {
      name: string;
      value: string;
    };
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress: {
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phone?: string;
    sameAsShipping: boolean;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  payment: {
    method: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
    transactionId?: string;
    paidAt?: string;
    refundedAt?: string;
    refundAmount?: number;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  tracking?: {
    number?: string;
    carrier?: string;
    url?: string;
    estimatedDelivery?: string;
    deliveredAt?: string;
  };
  notes: {
    customer?: string;
    admin?: string;
  };
  timeline: Array<{
    status: string;
    message: string;
    timestamp: string;
    user?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Generic API call function
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Product API functions
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const products = await response.json();
  return products.filter((product: Product) => product.featured);
};

// Category API functions - simplified for now
export const getCategories = async (): Promise<Category[]> => {
  // Return mock categories for now since we don't have categories endpoint yet
  return [
    { _id: '1', name: "Men's Fashion", slug: 'mens-fashion', level: 0, path: [], isActive: true, sortOrder: 1, featured: true, productCount: 0, createdAt: '', updatedAt: '', children: [] },
    { _id: '2', name: "Women's Fashion", slug: 'womens-fashion', level: 0, path: [], isActive: true, sortOrder: 2, featured: true, productCount: 0, createdAt: '', updatedAt: '', children: [] },
    { _id: '3', name: 'Shoes', slug: 'shoes', level: 0, path: [], isActive: true, sortOrder: 3, featured: true, productCount: 0, createdAt: '', updatedAt: '', children: [] },
    { _id: '4', name: 'Accessories', slug: 'accessories', level: 0, path: [], isActive: true, sortOrder: 4, featured: true, productCount: 0, createdAt: '', updatedAt: '', children: [] }
  ];
};

export const getFeaturedCategories = async (): Promise<Category[]> => {
  return getCategories();
};

// Hero Content API functions
export const getHeroContent = async (): Promise<HeroContent[]> => {
  const response = await fetch(`${API_BASE_URL}/hero`);
  if (!response.ok) {
    throw new Error('Failed to fetch hero content');
  }
  return response.json();
};

// Site Settings API functions
export const getSiteSettings = async (): Promise<SiteSettings> => {
  const response = await apiCall<{ siteSettings: SiteSettings }>('/site-settings');
  return response.data!.siteSettings;
};

// Authentication API functions
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return response.json();
};

export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ user: User; token: string }> => {
  const response = await apiCall<{ data: { user: User; token: string } }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return response.data!;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiCall<{ data: { user: User } }>('/auth/me');
  return response.data!.user;
};

// Forgot Password API functions
export const forgotPassword = async (email: string): Promise<{ message: string; email: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send OTP');
  }
  
  return response.json();
};

export const verifyOTP = async (email: string, otp: string): Promise<{ message: string; email: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'OTP verification failed');
  }
  
  return response.json();
};

export const resetPassword = async (email: string, newPassword: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, newPassword }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Password reset failed');
  }
  
  return response.json();
};

// Cart API functions
export const getCart = async (): Promise<{ items: CartItem[]; total: number; itemCount: number }> => {
  const response = await apiCall<{ data: { cart: { items: CartItem[]; total: number; itemCount: number } } }>('/cart');
  return response.data!.cart;
};

export const addToCart = async (productId: string, quantity: number, variant?: { name: string; value: string }): Promise<void> => {
  await apiCall('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, variant }),
  });
};

export const getCartCount = async (): Promise<number> => {
  const response = await apiCall<{ data: { count: number } }>('/cart/count');
  return response.data!.count;
};

// Newsletter API functions
export const subscribeNewsletter = async (email: string, preferences?: {
  productUpdates?: boolean;
  promotions?: boolean;
  news?: boolean;
}): Promise<void> => {
  await apiCall('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, preferences }),
  });
};

// Dashboard API functions (Admin only)
export const getDashboardStats = async (): Promise<any> => {
  const response = await apiCall<any>('/dashboard/stats');
  return response.data!;
};

export const getDashboardProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'featured';
}): Promise<{ products: Product[]; pagination: PaginationInfo }> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/dashboard/products?${queryString}` : '/dashboard/products';
  
  const response = await apiCall<{ products: Product[]; pagination: PaginationInfo }>(endpoint);
  return response.data!;
};

export const getDashboardOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{ orders: Order[]; pagination: PaginationInfo }> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/dashboard/orders?${queryString}` : '/dashboard/orders';
  
  const response = await apiCall<{ orders: Order[]; pagination: PaginationInfo }>(endpoint);
  return response.data!;
};

export const getDashboardUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
}): Promise<{ users: User[]; pagination: PaginationInfo }> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/dashboard/users?${queryString}` : '/dashboard/users';
  
  const response = await apiCall<{ users: User[]; pagination: PaginationInfo }>(endpoint);
  return response.data!;
};
