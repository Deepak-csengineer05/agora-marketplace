// src/pages/delivery/OngoingDeliveries.jsx
import React, { useState, useEffect } from "react";
import { Phone, MapPin, Clock, FileText, Wallet, Truck } from "lucide-react";
import { useDelivery } from "../../utils/DeliveryContext";

export default function OngoingDeliveries() {
  const { ongoing, updateOngoingStatus, completeTask, completed } = useDelivery();
  const [otpInputs, setOtpInputs] = useState({});
  const [toast, setToast] = useState(null);

  const [earningsToday, setEarningsToday] = useState(0);
  const [earningsTotal, setEarningsTotal] = useState(0);
  const [localOngoing, setLocalOngoing] = useState(ongoing);

  // ✅ Keep local ongoing list synced with context + localStorage
  useEffect(() => {
    function loadOngoing() {
      try {
        const saved = JSON.parse(localStorage.getItem("ongoingDeliveries")) || [];
        setLocalOngoing(saved);
      } catch {
        setLocalOngoing([]);
      }
    }

    loadOngoing();
    window.addEventListener("ongoingUpdated", loadOngoing);
    window.addEventListener("storage", loadOngoing);

    return () => {
      window.removeEventListener("ongoingUpdated", loadOngoing);
      window.removeEventListener("storage", loadOngoing);
    };
  }, [ongoing]);

  // ✅ Recalculate earnings whenever completed changes
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    let todayEarnings = 0;
    let total = 0;

    completed.forEach((c) => {
      total += c.deliveryFee || 0;
      if (c.completedAt?.startsWith(today)) {
        todayEarnings += c.deliveryFee || 0;
      }
    });

    setEarningsToday(todayEarnings);
    setEarningsTotal(total);
  }, [completed]);

  // ✅ OTP Input change
  function handleOtpChange(id, value) {
    setOtpInputs((prev) => ({ ...prev, [id]: value }));
  }

  function verifyOtp(order) {
        const correctOtp = order.otp || "1234";
        const enteredOtp = otpInputs[order.id];

        if (enteredOtp === correctOtp) {
            const result = completeTask(order.id, enteredOtp);

            if (result.success) {
            // ✅ Show success toast
            setToast(`+₹${order.deliveryFee} added to earnings`);
            setTimeout(() => setToast(null), 3000);

            // ✅ Update header earnings (localStorage + custom event)
            const prevEarnings = Number(localStorage.getItem("agora_earnings") || "0");
            localStorage.setItem("agora_earnings", prevEarnings + (order.deliveryFee || 0));
            window.dispatchEvent(new Event("earningsUpdated"));

            // ✅ Clear OTP input
            setOtpInputs((prev) => ({ ...prev, [order.id]: "" }));

            // ✅ Refresh local ongoing deliveries immediately
            const saved = JSON.parse(localStorage.getItem("ongoingDeliveries")) || [];
            setLocalOngoing(saved);

            alert(`✅ Order #${order.id} delivered successfully!`);
            } else {
                alert("❌ Could not complete the task. Please try again.");
            }
        } else {
            alert("❌ Incorrect OTP. Please try again.");
        }
    }

  if (localOngoing.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold">No ongoing deliveries 🚴‍♂️</h2>
        <p className="text-gray-500 mt-2">
          Accept a task from <strong>Available Tasks</strong> to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 relative">
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-agoraTeal/90 to-agoraPink/90 text-white rounded-xl shadow">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-bold">Today’s Earnings</h2>
              <p className="text-sm opacity-90">Completed deliveries today</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold">₹{earningsToday}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl shadow">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <div>
              <h2 className="text-lg font-bold">Total Earnings</h2>
              <p className="text-sm opacity-90">All-time</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold">₹{earningsTotal}</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold">📦 Ongoing Deliveries</h1>

      {localOngoing.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 space-y-3"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Order #{order.id}</h2>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" /> {order.pickupTime || "Now"}
            </span>
          </div>

          {/* Pickup & Drop */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>Pickup: {order.pickup}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Drop: {order.drop}</span>
            </div>
          </div>

          {/* Bill */}
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>
              Bill Amount: ₹{order.orderValue} + Fee: ₹{order.deliveryFee}
            </span>
          </div>

          {/* Status */}
          <div className="pt-3 flex items-center gap-3">
            <Truck className="w-5 h-5 text-agoraTeal" />
            <select
              value={order.status || "Accepted"}
              onChange={(e) => updateOngoingStatus(order.id, e.target.value)}
              className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800"
            >
              <option value="Accepted">✅ Accepted</option>
              <option value="Picked Up">📦 Picked Up</option>
              <option value="On the Way">🚚 On the Way</option>
              <option value="Near Destination">📍 Near Destination</option>
              {/* ❌ Removed "Delivered" to enforce OTP verification */}
            </select>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={() =>
                alert(`📞 Calling customer ${order.customer} (mock)`)
              }
              className="flex items-center gap-2 px-3 py-2 rounded bg-agoraTeal text-black text-sm"
            >
              <Phone className="w-4 h-4" /> Call Customer
            </button>
            <button
              onClick={() => alert(`📞 Calling vendor ${order.vendor} (mock)`)}
              className="flex items-center gap-2 px-3 py-2 rounded bg-yellow-400 text-black text-sm"
            >
              <Phone className="w-4 h-4" /> Call Vendor
            </button>
          </div>

          {/* OTP */}
          <div className="pt-3">
            <label className="block text-sm font-medium mb-1">
              Enter Delivery OTP:
            </label>
            <input
              type="text"
              value={otpInputs[order.id] || ""}
              onChange={(e) => handleOtpChange(order.id, e.target.value)}
              placeholder="Enter OTP"
              className="w-40 text-black p-2 border rounded"
            />
            <button
              onClick={() => verifyOtp(order)}
              className="ml-3 px-4 py-2 rounded bg-agoraPink text-white text-sm"
            >
              Verify & Complete
            </button>

            {/* 🔹 Test hint (remove in production) */}
            <span className="ml-3 text-xs text-gray-500">
              OTP: <strong>{order.otp}</strong>
            </span>
          </div>
        </div>
      ))}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-lg animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
