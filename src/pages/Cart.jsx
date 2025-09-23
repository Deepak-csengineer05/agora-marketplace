import React from "react";
import { useCart } from "../utils/CartContext";
import { useAuth } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";

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

  // 🔹 Load vendor → kitchen map
  const vendorKitchenMap = JSON.parse(localStorage.getItem("vendorKitchenMap") || "{}");

  function handleCheckout(items) {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/auth/login");
      return;
    }
    navigate("/checkout", { state: { items } });
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 bg-brand-gradient bg-clip-text text-transparent">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your cart is empty 🛒
          </p>
          <Link
            to="/shop"
            className="px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
          >
            See Kitchens near you
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([vendor, items]) => {
            const kitchenId = vendorKitchenMap[vendor];
            return (
              <div key={vendor} className="border border-gray-300 dark:border-gray-700 rounded-xl p-4">
                <h2 className="font-semibold text-lg mb-4">{vendor}</h2>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow mb-3"
                  >
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="font-bold text-agoraTeal">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-3 px-3 py-1 bg-red-500 text-white rounded-lg">Remove</button>
                    </div>
                  </div>
                ))}

                {/* Checkout & Add More buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  <button
                    onClick={() => handleCheckout(items)}
                    className="flex-1 px-4 py-2 bg-agoraPink text-black font-semibold rounded-full"
                  >
                    Checkout from {vendor}
                  </button>

                  {kitchenId && (
                    <Link
                      to={`/kitchen/${kitchenId}`}
                      className="flex-1 px-4 py-2 bg-agoraTeal text-black font-semibold rounded-full text-center"
                    >
                      ➕ Add More items from {vendor}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {/* Full Cart Checkout */}
          <div className="flex justify-between items-center font-bold text-lg mt-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button
            onClick={() => handleCheckout(cart)}
            className="w-full mt-4 px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
          >
            Checkout All Items
          </button>
        </div>
      )}
    </main>
  );
}
