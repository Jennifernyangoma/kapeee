import { useCart } from '../hooks/useCart';
import { useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi';

export default function Cart() {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    navigate("/payment");
  };

  return (
    <div className="container-max my-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <div className="text-gray-600">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
              <FiArrowRight />
            </Link>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Cart Items</h2>
              </div>
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          ${item.price.toFixed(2)} each
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                removeFromCart(item.id);
                                addToCart({ ...item, quantity: item.quantity - 1 });
                              }
                            }}
                            className="p-2 border rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus className="text-sm" />
                          </button>
                          <span className="text-lg font-medium w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart({ ...item, quantity: 1 })}
                            className="p-2 border rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FiPlus className="text-sm" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Price & Remove */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 mb-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <FiTrash2 />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping Button */}
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 mb-3"
              >
                Proceed to Checkout
                <FiArrowRight />
              </button>

              <button
                onClick={clearCart}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FiTrash2 />
                Clear Cart
              </button>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Secure Checkout | 💳 Multiple Payment Options
                </p>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
