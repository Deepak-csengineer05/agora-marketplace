import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { useAuth } from "../utils/auth";

// Mock menus with vendor info
const menus = {
  1: [
    { id: "m1", name: "Chicken Biryani", price: 250, desc: "Spicy Hyderabadi biryani.", vendor: "Priya's Kitchen" },
    { id: "m2", name: "Paneer Butter Masala", price: 200, desc: "Creamy tomato-based curry.", vendor: "Priya's Kitchen" },
  ],
  2: [
    { id: "m3", name: "Idli with Sambar", price: 120, desc: "South Indian breakfast.", vendor: "Ravi's Homemade Meals" },
    { id: "m4", name: "Masala Dosa", price: 150, desc: "Crispy dosa with potato filling.", vendor: "Ravi's Homemade Meals" },
  ],
};

export default function Kitchen() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const menu = menus[id] || [];

  function handleAdd(item) {
    if (!user) {
      // Save intended path and redirect to login
      localStorage.setItem("redirectAfterLogin", `/kitchen/${id}`);
      navigate("/auth/login");
      return;
    }
    addToCart(item);

    // 🔹 Save vendor → kitchen mapping
    const vendorKitchenMap = JSON.parse(localStorage.getItem("vendorKitchenMap") || "{}");
    vendorKitchenMap[item.vendor] = id;
    localStorage.setItem("vendorKitchenMap", JSON.stringify(vendorKitchenMap));

    alert(`${item.name} added to your cart ✅`);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 bg-brand-gradient bg-clip-text text-transparent">
        Menu
      </h1>

      {menu.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No menu available for this kitchen.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6"
            >
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              <p className="mt-2 font-bold text-agoraTeal">₹{item.price}</p>
              <button
                onClick={() => handleAdd(item)}
                className="mt-4 px-4 py-2 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Continue Shopping button */}
      <div className="mt-8 text-center">
        <Link
          to="/shop"
          className="px-6 py-3 bg-agoraPink text-black font-semibold rounded-full hover:scale-105 transition"
        >
          ← Continue Ordering
        </Link>
      </div>
    </main>
  );
}
