// src/pages/vendor/Orders.jsx
import React from "react";
import { useCart } from "../../utils/CartContext";
import { useAuth } from "../../utils/auth";
import { Phone, MapPin, User } from "lucide-react";

const steps = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"];

export default function VendorOrders() {
  const { orders, updateOrderStatus } = useCart();
  const { user } = useAuth();
  const vendorEmail = user?.email;

  // filter orders containing this vendor's items
  const vendorOrders = orders.filter((o) =>
    o.items.some((i) => (i.vendorEmail || "") === vendorEmail)
  );

  function changeStatus(orderId, newStatus) {
    updateOrderStatus(orderId, newStatus);
    alert(`✅ Order updated to "${newStatus}"`);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 bg-brand-gradient bg-clip-text text-transparent">
        Orders (Your Items)
      </h1>

      {vendorOrders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No orders containing your items yet.
        </p>
      ) : (
        <div className="space-y-6">
          {vendorOrders.slice().reverse().map((order) => {
            const vendorNames = Array.from(
              new Set(
                order.items.map(
                  (it) => it.vendorName || it.vendor || it.vendorEmail || "Unknown"
                )
              )
            );
            const kitchenLabel =
              vendorNames.length === 1 ? vendorNames[0] : "Multiple kitchens";

            const activeIndex = Math.max(0, steps.indexOf(order.status));
            const myItems = order.items.filter(
              (it) => (it.vendorEmail || "") === vendorEmail
            );

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="font-bold text-lg">Order #{order.id}</h2>
                    <div className="text-xs text-gray-500">
                      From: <span className="font-medium">{kitchenLabel}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-agoraTeal/20 text-agoraTeal font-semibold">
                    {order.status}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{order.customer?.name || "Unknown Customer"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{order.customer?.phone || "No phone"}</span>
                    {order.customer?.phone && (
                      <button
                        onClick={() =>
                          window.open(`tel:${order.customer.phone}`, "_self")
                        }
                        className="ml-2 px-2 py-1 rounded bg-agoraTeal text-black text-xs font-semibold"
                      >
                        Call
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{order.customer?.address || "No address"}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center">
                    {steps.map((s, i) => (
                      <React.Fragment key={s}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              i <= activeIndex
                                ? "bg-agoraTeal text-black"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {i + 1}
                          </div>
                          <div className="mt-2 text-xs text-center w-20">{s}</div>
                        </div>

                        {i < steps.length - 1 && (
                          <div
                            className={`flex-1 h-1 mx-3 mt-2 ${
                              i < activeIndex ? "bg-agoraTeal" : "bg-gray-700"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Vendor Items */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {myItems.map((it) => (
                    <div key={it.id} className="flex justify-between py-3">
                      <div>
                        <div className="font-medium">
                          {it.name} × {it.qty || 1}
                        </div>
                        <div className="text-xs text-gray-500">{it.desc}</div>
                      </div>
                      <div className="font-semibold text-agoraTeal">
                        ₹{(it.price || 0) * (it.qty || 1)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {order.status === "Pending" && (
                      <button
                        onClick={() => changeStatus(order.id, "Accepted")}
                        className="px-3 py-2 rounded bg-agoraTeal text-black"
                      >
                        Accept
                      </button>
                    )}
                    {["Accepted", "Preparing"].includes(order.status) && (
                      <button
                        onClick={() => changeStatus(order.id, "Preparing")}
                        className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700"
                      >
                        Mark Preparing
                      </button>
                    )}
                    {order.status === "Preparing" && (
                      <button
                        onClick={() => changeStatus(order.id, "Out for Delivery")}
                        className="px-3 py-2 rounded bg-agoraPink text-black"
                      >
                        Out for Delivery
                      </button>
                    )}
                    {order.status !== "Delivered" && (
                      <button
                        onClick={() => changeStatus(order.id, "Delivered")}
                        className="px-3 py-2 rounded bg-green-600 text-white"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>

                  <div className="font-bold text-lg">
                    ₹
                    {myItems.reduce(
                      (s, it) => s + (it.price || 0) * (it.qty || 1),
                      0
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
