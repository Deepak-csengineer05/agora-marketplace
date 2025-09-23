// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../utils/CartContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { placeOrder } = useCart();

  const mode = location.state?.mode || "food";
  const items = location.state?.items || [];
  const service = location.state?.service || null;

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment: "cod",
    notes: "",
    date: "",
    time: "",
    specialInstructions: "", 
    messageForCook: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (mode === "food" && items.length === 0) {
      alert("No items to checkout!");
      return;
    }

    if ((mode === "service" || mode === "quote") && !service) {
      alert("No service selected!");
      return;
    }

    // 🕒 Generate timestamps & ETA
    const createdAt = new Date();
    const deliveryEta = new Date(createdAt.getTime() + 45 * 60000); // +45 mins

    // 💰 Calculate totals
    const subtotal =
      mode === "food"
        ? items.reduce((sum, i) => sum + i.price * i.qty, 0)
        : service.rate;
    const deliveryFee = mode === "food" ? 40 : 0;
    const total = subtotal + deliveryFee;

    // Place order
    const newOrder = placeOrder({
      details: { ...form }, // ✅ store form details under `details`
      mode,
      items: mode === "food" ? items : [service],
      subtotal,
      deliveryFee,
      total,
      status: "Pending",
      createdAt: createdAt.toISOString(),
      deliveryEta: deliveryEta.toISOString(),
    });

    // ✅ Redirect to Order Success
    navigate("/order-success", {
      replace: true,
      state: { order: newOrder },
    });
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 bg-brand-gradient bg-clip-text text-transparent">
        {mode === "food"
          ? "Checkout"
          : mode === "service"
          ? "Book Service"
          : "Request a Quote"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          required
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
        />
        <input
          type="tel"
          required
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
        />

        {mode === "food" && (
          <>
            <textarea
              required
              placeholder="Delivery Address"
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            />

            {/* 🆕 Special Instructions */}
            <textarea
              placeholder="Special Instructions (e.g. leave at door)"
              rows={2}
              value={form.specialInstructions}
              onChange={(e) =>
                setForm({ ...form, specialInstructions: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            />

            {/* 🆕 Message for Cook */}
            <textarea
              placeholder="Message for the Cook"
              rows={2}
              value={form.messageForCook}
              onChange={(e) =>
                setForm({ ...form, messageForCook: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            />
          </>
        )}

        {(mode === "service" || mode === "quote") && (
          <>
            <textarea
              placeholder={
                mode === "quote"
                  ? "Describe your requirements (for a quote)"
                  : "Notes (extra details, requirements...)"
              }
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            />
            {mode === "service" && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
              </div>
            )}
          </>
        )}

        <div>
          <label className="block font-medium mb-2">Payment Method</label>
          <select
            value={form.payment}
            onChange={(e) => setForm({ ...form, payment: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          >
            <option value="cod">
              {mode === "quote" ? "Pay Later (after quote)" : "Cash on Delivery"}
            </option>
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
        >
          {mode === "food"
            ? "Place Order"
            : mode === "service"
            ? "Book Service"
            : "Request Quote"}
        </button>
      </form>
    </main>
  );
}
