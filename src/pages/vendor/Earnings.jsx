// src/pages/vendor/Earnings.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { useCart } from "../../utils/CartContext";

/**
 * Vendor Earnings page:
 * - computes earnings from orders (any order items where item.vendorEmail matches current vendor)
 * - shows payout history saved under localStorage key "vendor_payouts_{vendorEmail}"
 */

function loadPayouts(vendorEmail) {
  try {
    return JSON.parse(localStorage.getItem(`vendor_payouts_${vendorEmail}`) || "[]");
  } catch {
    return [];
  }
}

function savePayouts(vendorEmail, arr) {
  localStorage.setItem(`vendor_payouts_${vendorEmail}`, JSON.stringify(arr));
}

export default function Earnings() {
  const { user } = useAuth();
  const { orders } = useCart();
  const vendorEmail = user?.email;

  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    setPayouts(loadPayouts(vendorEmail));
  }, [vendorEmail]);

  // calculate earnings from orders (sum of order items that belong to this vendor)
  const earned = orders.reduce((sum, order) => {
    const vendorItems = order.items.filter((i) => (i.vendorEmail || "") === vendorEmail);
    const s = vendorItems.reduce((ss, it) => ss + (it.price || 0) * (it.qty || 1), 0);
    return sum + s;
  }, 0);

  const paid = payouts.reduce((s, p) => s + (p.amount || 0), 0);
  const balance = Math.max(0, earned - paid);

  function requestPayout() {
    if (!confirm(`Request payout of ₹${Math.round(balance)}?`)) return;
    const newPayout = { id: Date.now(), amount: Math.round(balance), date: new Date().toLocaleString(), status: "Requested" };
    const next = [...payouts, newPayout];
    savePayouts(vendorEmail, next);
    setPayouts(next);
    alert("Payout requested (mock).");
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4 bg-brand-gradient bg-clip-text text-transparent">Earnings</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500">Total earned (this account)</h3>
          <div className="mt-4 text-2xl font-bold text-agoraTeal">₹{Math.round(earned)}</div>
          <div className="mt-6">
            <div className="text-sm">Paid out: ₹{Math.round(paid)}</div>
            <div className="text-sm mt-2">Available balance: <span className="font-bold">₹{Math.round(balance)}</span></div>
            <div className="mt-4">
              <button onClick={requestPayout} disabled={balance <= 0} className="px-4 py-2 rounded bg-agoraPink text-black font-semibold">
                Request Payout
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm text-gray-500">Quick stats</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Orders containing your items: {orders.filter(o => o.items.some(i => (i.vendorEmail || "") === vendorEmail)).length}</li>
            <li>Active payouts pending: {payouts.filter(p => p.status === "Requested").length}</li>
          </ul>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold mb-4">Payout History</h3>
        {payouts.length === 0 ? (
          <p className="text-gray-500">No payouts yet.</p>
        ) : (
          <div className="space-y-3">
            {payouts.slice().reverse().map((p) => (
              <div key={p.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">₹{p.amount}</div>
                  <div className="text-xs text-gray-500">{p.date}</div>
                </div>
                <div className="text-sm">{p.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
