import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { FiX, FiShoppingCart, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, addToCart, updateCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Real-time cart updates via Socket.IO
  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000');
    
    socket.on('cart:updated', ({ userId, cart: updatedCart }) => {
      if (userId === user._id) {
        // Update local cart with server cart data
        updateCart(updatedCart.items || []);
      }
    });

    return () => socket.disconnect();
  }, [user, updateCart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/payment');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-xl text-brand" />
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            <span className="bg-brand text-white text-xs px-2 py-1 rounded-full">
              {cartCount}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add some items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500">${item.price}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            removeFromCart(item.id);
                            addToCart({ ...item, quantity: item.quantity - 1 });
                          } else {
                            removeFromCart(item.id);
                          }
                        }}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart({ ...item, quantity: 1 })}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <FiPlus className="text-sm" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors ml-2"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-brand">${total.toFixed(2)}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleViewCart}
                className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                View Cart
              </button>
              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
