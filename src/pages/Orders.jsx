// src/pages/customer/Orders.jsx
import React, { useState } from "react";
import { useCart } from "../utils/CartContext";
import { Link, useNavigate } from "react-router-dom";

const foodSteps = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"];
const serviceSteps = ["Pending", "Accepted", "In Progress", "Completed"];
const quoteSteps = ["Requested", "Quoted", "Completed"];

export default function CustomerOrders() {
  const { orders } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("food");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const foodOrders = orders.filter((o) => o.mode === "food");
  const serviceOrders = orders.filter((o) => o.mode === "service");
  const quoteOrders = orders.filter((o) => o.mode === "quote");

  const getSteps = () => {
    if (activeTab === "food") return foodSteps;
    if (activeTab === "service") return serviceSteps;
    return quoteSteps;
  };

  const filterAndSort = (ordersList) => {
    let filtered = [...ordersList];
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    if (sortOrder === "newest") {
      filtered = filtered.slice().reverse();
    }
    return filtered;
  };

  function formatEta(eta) {
    if (!eta) return null;
    const diff = new Date(eta) - new Date();
    if (diff <= 0) return "Arriving soon 🚚";
    const mins = Math.ceil(diff / 60000);
    return `${mins} min${mins > 1 ? "s" : ""}`;
  }

  const ProgressTracker = ({ steps, activeIndex }) => (
    <div className="mb-6">
      {/* Mobile */}
      <div className="flex sm:hidden overflow-x-auto no-scrollbar gap-6 px-1">
        {steps.map((step, i) => {
          const isActive = i <= activeIndex;
          return (
            <div key={step} className="flex flex-col items-center min-w-[80px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-agoraTeal text-black"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <p className="mt-2 text-xs text-center">{step}</p>
            </div>
          );
        })}
      </div>
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, i) => {
          const isActive = i <= activeIndex;
          return (
            <div key={step} className="flex-1 text-center relative">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-agoraTeal text-black"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
              <p className="mt-2 text-xs">{step}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-1/2 left-1/2 h-1 w-[calc(100%-2rem)] -translate-y-1/2">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      i < activeIndex
                        ? "bg-agoraTeal w-full"
                        : "bg-gray-300 dark:bg-gray-700 w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderOrders = (ordersList, steps) => {
    const filtered = filterAndSort(ordersList);

    if (filtered.length === 0) {
      return (
        <p className="text-gray-600 dark:text-gray-400">
          No {activeTab} orders match your filters.
        </p>
      );
    }

    return filtered.map((order) => {
      const activeIndex = steps.indexOf(order.status);

      return (
        <div
          key={order.id}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-lg">
                {activeTab === "food"
                  ? `Order #${order.id}`
                  : activeTab === "service"
                  ? `Service Booking #${order.id}`
                  : `Quote Request #${order.id}`}
              </h2>
              <p className="text-sm text-gray-500">
                {activeTab === "food"
                  ? `From: ${order.kitchenName || "Agora Vendor"}`
                  : activeTab === "service"
                  ? `Provider: ${order.items?.[0]?.name || "Service Provider"}`
                  : `Requested: ${order.items?.[0]?.service || "Service"}`}
              </p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-agoraTeal/20 text-agoraTeal font-semibold">
              {order.status}
            </span>
          </div>

          {/* Progress */}
          {steps.length > 1 && <ProgressTracker steps={steps} activeIndex={activeIndex} />}

          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p>
              👤 {order.details?.name} — {order.details?.phone}
            </p>
            {activeTab === "food" && <p>📍 {order.details?.address}</p>}
            {activeTab === "service" && (
              <p>
                📅 {order.details?.date} at {order.details?.time}
              </p>
            )}
            {order.details?.notes && <p>📝 {order.details.notes}</p>}
            
            {/* 🆕 New fields */}
            {activeTab === "food" && order.details?.specialInstructions && (
              <p>📝 Special Instructions: {order.details.specialInstructions}</p>
            )}
            {activeTab === "food" && order.details?.messageForCook && (
              <p>👨‍🍳 Message for Cook: {order.details.messageForCook}</p>
            )}
          </div>


          {/* Receipts */}
          {activeTab === "food" && (
            <div className="mt-4 border-t pt-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
              {order.deliveryEta && (
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-agoraTeal font-medium">
                    ETA: {formatEta(order.deliveryEta)}
                  </p>
                  <button
                    onClick={() =>
                      navigate("/track-order", { state: { orderId: order.id } })
                    }
                    className="text-sm px-3 py-1 bg-agoraPink text-white rounded-full hover:scale-105 transition"
                  >
                    Track Live
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "service" && (
            <div className="mt-3 font-bold text-lg">Total: ₹{order.total}</div>
          )}
        </div>
      );
    });
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 bg-brand-gradient bg-clip-text text-transparent">
        My Orders
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["food", "service", "quote"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === tab
                ? "bg-agoraTeal text-black"
                : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab === "food" ? "🍴 Food Orders" : tab === "service" ? "🛠️ Services" : "💬 Quotes"}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded-lg border dark:bg-gray-800"
        >
          <option value="all">All Statuses</option>
          {getSteps().map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 rounded-lg border dark:bg-gray-800"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="space-y-8">
        {activeTab === "food" && renderOrders(foodOrders, foodSteps)}
        {activeTab === "service" && renderOrders(serviceOrders, serviceSteps)}
        {activeTab === "quote" && renderOrders(quoteOrders, quoteSteps)}
      </div>
    </main>
  );
}
