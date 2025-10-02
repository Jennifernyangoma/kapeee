import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Page Components
import Home from './pages/Home';
import Shop from './pages/Shop';
import MensFashion from './pages/MensFashion';
import WomensFashion from './pages/WomensFashion';
import Deals from './pages/Deals';
import Support from './pages/Support';
import Account from './pages/Account';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import Checkout from './pages/Checkout';

// Layout and UI Components
import Layout from './components/Layout';
import BlogPage from './components/blog';

// Context Providers
import { AuthProvider } from './context/AuthProvider';

/**
 * Main App Component
 * 
 * This is the root component that sets up:
 * - React Router for client-side routing
 * - Authentication context for user management
 * - All application routes (public and admin)
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Pages - All wrapped in Layout component */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="mens-fashion" element={<MensFashion />} />
            <Route path="womens-fashion" element={<WomensFashion />} />
            <Route path="deals" element={<Deals />} />
            <Route path="support" element={<Support />} />
            <Route path="account" element={<Account />} />
            <Route path="cart" element={<Cart />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="payment" element={<Checkout />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="blog" element={<BlogPage />} />
          </Route>

          {/* Admin Dashboard - Separate route without Layout */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
