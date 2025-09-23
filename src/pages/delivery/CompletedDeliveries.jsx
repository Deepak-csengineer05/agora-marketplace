// src/pages/delivery/CompletedDeliveries.jsx
import React, { useState, useEffect } from "react";
import { MapPin, User, DollarSign, Store, Clock, Package, Wallet } from "lucide-react";

export default function CompletedDeliveries() {
  const [localCompleted, setLocalCompleted] = useState([]);
  const [sortBy, setSortBy] = useState("time");
  const [totalEarnings, setTotalEarnings] = useState(0);

  // ✅ Load completed deliveries + listen for updates
  useEffect(() => {
    function loadCompleted() {
      try {
        const saved = JSON.parse(localStorage.getItem("agora_completed_tasks")) || [];
        setLocalCompleted(saved);
      } catch {
        setLocalCompleted([]);
      }
    }

    loadCompleted();

    // 🔥 Listen for updates from OngoingDeliveries + multi-tab sync
    window.addEventListener("completedUpdated", loadCompleted);
    window.addEventListener("storage", loadCompleted);

    return () => {
      window.removeEventListener("completedUpdated", loadCompleted);
      window.removeEventListener("storage", loadCompleted);
    };
  }, []);

  // ✅ Recalculate total earnings whenever completed list changes
  useEffect(() => {
    const total = localCompleted.reduce((sum, t) => sum + (t.deliveryFee || 0), 0);
    setTotalEarnings(total);
  }, [localCompleted]);

  // ✅ Sorting
  const sortedTasks = [...localCompleted].sort((a, b) => {
    if (sortBy === "fee")
      return b.deliveryFee - a.deliveryFee || new Date(b.completedAt) - new Date(a.completedAt);
    if (sortBy === "distance")
      return (a.distance || 0) - (b.distance || 0) || new Date(b.completedAt) - new Date(a.completedAt);
    return new Date(b.completedAt || b.time) - new Date(a.completedAt || a.time);
  });

  if (localCompleted.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No deliveries completed yet 📦
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">✅ Completed Deliveries</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-bold">Total Deliveries</h2>
              <p className="text-sm opacity-90">Completed orders</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold">{localCompleted.length}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl shadow">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-bold">Total Earnings</h2>
              <p className="text-sm opacity-90">All-time</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold">
            ₹{totalEarnings.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <label className="text-sm">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded border dark:bg-gray-900"
        >
          <option value="time">Time</option>
          <option value="fee">Delivery Fee</option>
          <option value="distance">Distance</option>
        </select>
      </div>

      {/* Completed tasks list */}
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-xl p-4 shadow bg-white dark:bg-gray-800 space-y-3"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Order #{task.id}</h2>
              <span className="flex items-center text-sm text-gray-500 gap-1">
                <Clock className="w-4 h-4" />
                {new Date(task.completedAt || task.time).toLocaleString()}
              </span>
            </div>

            {/* Pickup & Drop */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Pickup: {task.pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Drop: {task.drop}</span>
              </div>
            </div>

            {/* Vendor & Customer */}
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Store className="w-4 h-4 text-yellow-600" /> {task.vendor}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-blue-600" /> {task.customer}
              </span>
            </div>

            {/* Fee & Distance */}
            <div className="flex flex-wrap gap-6 text-sm font-medium pt-2">
              <span className="flex items-center gap-1">
                Fee: ₹ {task.deliveryFee}
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4 text-purple-600" /> Distance:{" "}
                {task.distance || "N/A"} km
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
