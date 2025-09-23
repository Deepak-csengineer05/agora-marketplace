// src/pages/vendor/OrdersPage.jsx
import React from "react";
import { useCart } from "../../utils/CartContext";
import { useAuth } from "../../utils/auth";

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useCart();
  const { user } = useAuth();

  // Filter only orders that belong to this vendor
  const vendorOrders = orders.filter((o) =>
    o.items.some((item) => item.vendorId === user?.id)
  );

  const steps = ["Pending", "Preparing", "Out for delivery", "Completed"];

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📦 Incoming Orders</h1>

      {vendorOrders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      <div className="space-y-6">
        {vendorOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow p-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">
                Order #{order.id} — {order.details?.kitchen || "Your Kitchen"}
              </h2>
              <span className="px-3 py-1 text-sm rounded-full bg-agoraTeal/20 text-agoraTeal font-semibold">
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="mb-4">
              {order.items
                .filter((i) => i.vendorId === user?.id)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm border-b py-1"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              <div className="font-semibold text-right mt-2">
                Total: ₹
                {order.items
                  .filter((i) => i.vendorId === user?.id)
                  .reduce((sum, i) => sum + i.price * i.qty, 0)}
              </div>
            </div>

            {/* Customer Details */}
            <div className="mb-4 text-sm text-gray-600">
              <p>
                👤 {order.details?.name} ({order.details?.phone})
              </p>
              <p>📍 {order.details?.address}</p>
            </div>

            {/* Tracking Progress Bar */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, i) => {
                const activeIndex = steps.indexOf(order.status);
                const isActive = i <= activeIndex;

                return (
                  <div
                    key={step}
                    className="flex-1 text-center relative flex flex-col items-center"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                        isActive
                          ? "bg-agoraTeal text-black"
                          : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <p className="mt-2 text-xs">{step}</p>

                    {i < steps.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 h-1 w-full -translate-x-1/2 z-0 ${
                          isActive
                            ? "bg-agoraTeal"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {steps.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(order.id, s)}
                  className={`px-3 py-1 rounded text-sm ${
                    order.status === s
                      ? "bg-agoraTeal text-black font-semibold"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600"
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => handleStatusChange(order.id, "Cancelled")}
                className="px-3 py-1 rounded text-sm bg-red-500 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
