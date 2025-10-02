import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ChevronUp, Facebook, Twitter, Linkedin, Instagram, Youtube, Rss, CreditCard } from "lucide-react";
import { FaCcVisa, FaCcPaypal, FaCcDiscover, FaCcMastercard, FaCcAmex } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Subscribed successfully!");
        setEmail("");
      } else {
        setMessage(data.error || "❌ Subscription failed.");
      }
    } catch {
      setMessage("⚠️ Error connecting to server.");
    }

    setLoading(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-dark text-white">
      <div className="container-max grid gap-8 py-16 sm:grid-cols-2 md:grid-cols-5">
        {/* Company Info */}
        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold mb-4">kapee.</h3>
          <p className="text-sm text-gray-300 mb-6">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          </p>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <MapPin className="text-brand" size={18} />
              <span>Lorem Ipsum, 2046 Lorem Ipsum</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-brand" size={18} />
              <span>576-245-2478</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-brand" size={18} />
              <span>info@kapee.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-brand" size={18} />
              <span>Mon - Fri / 9:00 AM - 6:00 PM</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            
          </div>
        </div>

        {/* Information */}
        <div>
          <h4 className="mb-6 text-lg font-bold uppercase">INFORMATION</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Store Location</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Latest News</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Sitemap</a></li>
          </ul>
        </div>

        {/* Our Service */}
        <div>
          <h4 className="mb-6 text-lg font-bold uppercase">OUR SERVICE</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Sale</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Customer Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Delivery Information</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Payments</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Saved Cards</a></li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h4 className="mb-6 text-lg font-bold uppercase">MY ACCOUNT</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white transition-colors">My Account</a></li>
            <li><a href="#" className="hover:text-white transition-colors">My Shop</a></li>
            <li><a href="#" className="hover:text-white transition-colors">My Cart</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Checkout</a></li>
            <li><a href="#" className="hover:text-white transition-colors">My Wishlist</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Tracking Order</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-6 text-lg font-bold uppercase">NEWSLETTER</h4>
          <p className="text-sm text-gray-300 mb-4">
            Subscribe to our mailing list to get the new updates!
          </p>
          <form className="flex gap-2 mb-6" onSubmit={handleSubscribe}>
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                className="w-full bg-gray-700 text-white px-10 py-3 rounded-lg border-0 outline-none placeholder-gray-400"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? "..." : "SIGN UP"}
            </button>
          </form>
          {message && <p className="text-sm text-gray-300 mb-4">{message}</p>}
          
          {/* Social Media */}
          <div className="flex gap-2">
            <a href="#" className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-9 h-9 bg-black rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-9 h-9 bg-blue-700 rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <Linkedin size={18} />
            </a>
            <a href="#" className="w-9 h-9 bg-gradient-to-r from-pink-500 to-orange-500 rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-9 h-9 bg-orange-500 rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <Rss size={18} />
            </a>
            <a href="#" className="w-9 h-9 bg-red-600 rounded flex items-center justify-center text-white hover:opacity-80 transition-opacity">
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="container-max flex items-center justify-between">
          <p className="text-sm text-gray-300">
            Kapee © 2025 by PressLayouts All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Payment Methods:</span>
            <div className="flex items-center gap-2">
              <div className="w-10 h-7 bg-white rounded flex items-center justify-center">
                <FaCcVisa className="text-blue-600 text-2xl" />
              </div>
              <div className="w-10 h-7 bg-white rounded flex items-center justify-center">
                <FaCcPaypal className="text-blue-500 text-2xl" />
              </div>
              <div className="w-10 h-7 bg-white rounded flex items-center justify-center">
                <FaCcDiscover className="text-orange-500 text-2xl" />
              </div>
              <div className="w-10 h-7 bg-white rounded flex items-center justify-center">
                <CreditCard className="text-blue-700" size={20} />
              </div>
              <div className="w-10 h-7 bg-white rounded flex items-center justify-center">
                <FaCcMastercard className="text-red-600 text-2xl" />
              </div>
              <div className="w-10 h-7 bg-white rounded flex items-center justify-center">
                <FaCcAmex className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-brand hover:bg-brand-dark text-white p-3 rounded-lg shadow-lg transition-colors z-50"
      >
        <ChevronUp size={24} />
      </button>
    </footer>
  );
}
