import React from "react";
import { useCart } from "../utils/CartContext";
import { useAuth } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

export default function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const grouped = cart.reduce((acc, item) => {
    if (!acc[item.vendor]) acc[item.vendor] = [];
    acc[item.vendor].push(item);
    return acc;
  }, {});

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Load vendor → kitchen map
  const vendorKitchenMap = JSON.parse(localStorage.getItem("vendorKitchenMap") || "{}");

  function handleCheckout(items) {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/auth/login");
      return;
    }
    navigate("/checkout", { state: { items, mode: "food" } });
  }

  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Your cart is empty
          </p>
          <Link
            to="/shop"
            className="px-8 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition text-lg"
          >
            Discover Amazing Foods & Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 bg-brand-gradient bg-clip-text text-transparent">
        Your Shopping Cart
      </h1>

      <div className="space-y-8">
        {Object.entries(grouped).map(([vendor, items]) => {
          const kitchenId = vendorKitchenMap[vendor];
          const vendorTotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

          return (
            <Card key={vendor} className="border border-gray-300 dark:border-gray-700">
              <h2 className="font-semibold text-xl mb-4 flex justify-between">
                <span>{vendor}</span>
                <span className="text-agoraTeal">₹{vendorTotal}</span>
              </h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-agoraTeal font-bold">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg px-3 py-1">
                        <button 
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300"
                        >
                          −
                        </button>
                        <span className="font-medium min-w-[20px] text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vendor Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={() => handleCheckout(items)}
                  variant="accent"
                  size="md"
                  className="flex-1"
                >
                  Checkout from {vendor}
                </Button>

                {kitchenId && (
                  <Link to={`/kitchen/${kitchenId}`} className="flex-1">
                    <Button variant="primary" size="md" className="w-full">
                      ➕ Add More from {vendor}
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          );
        })}

        {/* Cart Summary */}
        <Card className="border border-gray-300 dark:border-gray-700">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total Amount</span>
            <span className="text-agoraTeal">₹{total}</span>
          </div>
          <Button
            onClick={() => handleCheckout(cart)}
            variant="primary"
            size="lg"
            className="w-full text-lg"
          >
            Proceed to Checkout All Items
          </Button>
        </Card>
      </div>
    </main>
  );
}