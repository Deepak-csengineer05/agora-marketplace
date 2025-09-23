// src/pages/delivery/Earnings.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Wallet, Calendar, TrendingUp, Package, Banknote } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Earnings() {
  const [completed, setCompleted] = useState([]);
  const [payouts, setPayouts] = useState([]);

  useEffect(() => {
    function loadCompleted() {
      try {
        const saved =
          JSON.parse(localStorage.getItem("agora_completed_tasks")) || [];
        setCompleted(saved);
      } catch {
        setCompleted([]);
      }
    }

    function loadPayouts() {
      try {
        const saved =
          JSON.parse(localStorage.getItem("agora_payouts")) || [];
        setPayouts(saved);
      } catch {
        setPayouts([]);
      }
    }

    loadCompleted();
    loadPayouts();

    window.addEventListener("completedUpdated", loadCompleted);
    window.addEventListener("storage", () => {
      loadCompleted();
      loadPayouts();
    });

    return () => {
      window.removeEventListener("completedUpdated", loadCompleted);
      window.removeEventListener("storage", () => {});
    };
  }, []);

  // ✅ Group earnings by day
  const dailyEarnings = useMemo(() => {
    const map = {};
    completed.forEach((c) => {
      const date = new Date(c.completedAt).toLocaleDateString();
      map[date] = (map[date] || 0) + (c.deliveryFee || 0);
    });
    return Object.entries(map).map(([date, total]) => ({ date, total }));
  }, [completed]);

  // ✅ Group earnings by week
  const weeklyEarnings = useMemo(() => {
    const map = {};
    completed.forEach((c) => {
      const date = new Date(c.completedAt);
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      const key = `${year}-W${week}`;
      map[key] = (map[key] || 0) + (c.deliveryFee || 0);
    });
    return Object.entries(map).map(([week, total]) => ({ week, total }));
  }, [completed]);

  // ✅ Totals
  const today = new Date().toLocaleDateString();
  const todayTotal = completed
    .filter((c) => new Date(c.completedAt).toLocaleDateString() === today)
    .reduce((sum, c) => sum + (c.deliveryFee || 0), 0);

  const weeklyTotal = completed
    .filter((c) => {
      const date = new Date(c.completedAt);
      const diff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .reduce((sum, c) => sum + (c.deliveryFee || 0), 0);

  const monthlyTotal = completed
    .filter((c) => {
      const date = new Date(c.completedAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, c) => sum + (c.deliveryFee || 0), 0);

  const totalAllTime = completed.reduce(
    (sum, c) => sum + (c.deliveryFee || 0),
    0
  );

  // ✅ Payout calculations
  const totalTransferred = payouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingBalance = totalAllTime - totalTransferred;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">💰 Earnings Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Today"
          value={todayTotal}
          icon={<Wallet className="w-6 h-6" />}
          color="from-agoraTeal to-green-500"
        />
        <SummaryCard
          title="This Week"
          value={weeklyTotal}
          icon={<Calendar className="w-6 h-6" />}
          color="from-blue-500 to-indigo-600"
        />
        <SummaryCard
          title="This Month"
          value={monthlyTotal}
          icon={<TrendingUp className="w-6 h-6" />}
          color="from-pink-500 to-red-500"
        />
        <SummaryCard
          title="All Time"
          value={totalAllTime}
          icon={<Package className="w-6 h-6" />}
          color="from-gray-700 to-black"
        />
      </div>

      {/* Charts: Daily + Weekly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Earnings Line */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">📊 Daily Earnings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#14b8a6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Earnings Bar */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">📅 Weekly Earnings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">📦 Recent Deliveries</h2>
        {completed.slice(-5).reverse().map((c) => (
          <div
            key={c.id}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>Order #{c.id}</span>
            <span>{new Date(c.completedAt).toLocaleDateString()}</span>
            <span className="font-semibold text-agoraTeal">
              +₹{c.deliveryFee}
            </span>
          </div>
        ))}
        {completed.length === 0 && (
          <p className="text-gray-500">No deliveries completed yet.</p>
        )}
      </div>

      {/* 💸 Payouts Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">💸 Payouts</h2>

        {/* Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
            <h3 className="font-medium text-sm">Transferred</h3>
            <p className="text-xl font-bold">₹{totalTransferred}</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200">
            <h3 className="font-medium text-sm">Pending Balance</h3>
            <p className="text-xl font-bold">₹{pendingBalance}</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200">
            <h3 className="font-medium text-sm">Total Earnings</h3>
            <p className="text-xl font-bold">₹{totalAllTime}</p>
          </div>
        </div>

        {/* Recent Payouts */}
        <h3 className="font-semibold mb-2">Recent Transfers</h3>
        {payouts.length > 0 ? (
          payouts
            .slice(-5)
            .reverse()
            .map((p, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>{new Date(p.date).toLocaleDateString()}</span>
                <span className="font-semibold text-agoraTeal">
                  ₹{p.amount}
                </span>
              </div>
            ))
        ) : (
          <p className="text-gray-500">No payouts have been made yet.</p>
        )}
      </div>
    </div>
  );
}

// ✅ Summary Card Component
function SummaryCard({ title, value, icon, color }) {
  return (
    <div
      className={`flex items-center justify-between p-4 bg-gradient-to-r ${color} text-white rounded-xl shadow`}
    >
      <div>
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-2xl font-bold">₹{value}</p>
      </div>
      {icon}
    </div>
  );
}

// ✅ Utility: Get ISO Week Number
function getWeekNumber(date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
}
