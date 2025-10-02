import { Link, NavLink } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiHeart, FiChevronDown, FiMenu, FiLogOut } from 'react-icons/fi';
import TopBar from './TopBar';
import SearchBar from './SearchBar';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cart, openCartSidebar } = useCart();
  const { user, logout } = useAuth();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <header className="sticky top-0 z-40">
      <TopBar />
      
      {/* Main Header - Blue Background */}
      <div className="w-full bg-brand">
        <div className="container-max flex items-center gap-6 py-4">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-white">
            kapee.
          </Link>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl">
            <SearchBar />
          </div>
          
          {/* User Actions */}
          <nav className="flex items-center gap-6 text-white">
            {user ? (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/account"
                  className="flex items-center gap-2 hover:text-primary-300 transition-colors"
                >
                  <FiUser className="text-xl" />
                  <span className="hidden sm:inline">HELLO, {user.username.toUpperCase()}</span>
                </NavLink>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 hover:text-primary-300 transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="text-xl" />
                  <span className="hidden sm:inline">LOGOUT</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="flex items-center gap-2 hover:text-primary-300 transition-colors"
              >
                <FiUser className="text-xl" />
                <span className="hidden sm:inline">HELLO, SIGN IN</span>
              </NavLink>
            )}
            
            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className="relative flex items-center gap-2 hover:text-primary-300 transition-colors"
            >
              <FiHeart className="text-xl" />
              <span className="hidden sm:inline">WISHLIST</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </NavLink>
            
            {/* Cart */}
            <button
              onClick={openCartSidebar}
              className="relative flex items-center gap-2 hover:text-primary-300 transition-colors"
            >
              <FiShoppingCart className="text-xl" />
              <span className="hidden sm:inline">CART</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
              <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Navigation Bar - White Background */}
      <div className="w-full bg-white border-b">
        <div className="container-max flex items-center gap-6 py-4">
          <div className="flex items-center gap-2">
            <FiMenu className="text-xl" />
            <span className="font-medium">SHOP BY DEPARTMENT</span>
          </div>
          
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `flex items-center gap-1 hover:text-brand transition-colors ${
                  isActive ? 'font-semibold text-brand' : ''
                }`
              }
            >
              HOME
              <FiChevronDown className="text-xs" />
            </NavLink>
            <NavLink 
              to="/shop" 
              className="flex items-center gap-1 hover:text-brand transition-colors"
            >
              SHOP
              <FiChevronDown className="text-xs" />
            </NavLink>
            <NavLink 
              to="/pages" 
              className="flex items-center gap-1 hover:text-brand transition-colors"
            >
              PAGES
              <FiChevronDown className="text-xs" />
            </NavLink>
            <NavLink 
              to="/blog" 
              className="flex items-center gap-1 hover:text-brand transition-colors"
            >
              BLOG
              <FiChevronDown className="text-xs" />
            </NavLink>
            <NavLink 
              to="/elements" 
              className="flex items-center gap-1 hover:text-brand transition-colors"
            >
              ELEMENTS
              <FiChevronDown className="text-xs" />
            </NavLink>
            <NavLink 
              to="/buy-now" 
              className="flex items-center gap-1 hover:text-brand transition-colors"
            >
              BUY NOW
              <FiChevronDown className="text-xs" />
            </NavLink>
          </nav>
          
          <div className="md:hidden ml-auto w-full">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}
