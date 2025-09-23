// src/pages/vendor/EarningsPage.jsx
import React, { useMemo } from "react";
import { useCart } from "../../utils/CartContext";
import { useAuth } from "../../utils/auth";

export default function EarningsPage() {
  const { orders } = useCart();
  const { user } = useAuth();

  // Get only this vendor's completed orders
  const completedOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status === "Completed" &&
          o.items.some((item) => item.vendorId === user?.id)
      ),
    [orders, user]
  );

  // Calculate total earnings
  const totalEarnings = completedOrders.reduce(
    (sum, order) =>
      sum +
      order.items
        .filter((i) => i.vendorId === user?.id)
        .reduce((s, i) => s + i.price * i.qty, 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">💰 My Earnings</h1>

      {/* Earnings summary */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Total Earnings</h2>
        <p className="text-3xl font-bold text-agoraTeal">₹{totalEarnings}</p>
        <p className="text-sm text-gray-500 mt-1">
          Based on completed orders only
        </p>
      </div>

      {/* Orders contributing to earnings */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Completed Orders</h2>
        {completedOrders.length === 0 ? (
          <p className="text-gray-500">No completed orders yet.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-3">Order #</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Items</th>
                <th className="py-2 px-3 text-right">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => {
                const vendorItems = order.items.filter(
                  (i) => i.vendorId === user?.id
                );
                const orderTotal = vendorItems.reduce(
                  (sum, i) => sum + i.price * i.qty,
                  0
                );

                return (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-2 px-3 font-semibold">#{order.id}</td>
                    <td className="py-2 px-3">{order.date}</td>
                    <td className="py-2 px-3">
                      {vendorItems.map((i) => (
                        <div key={i.id}>
                          {i.name} × {i.qty}
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-agoraTeal">
                      ₹{orderTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
