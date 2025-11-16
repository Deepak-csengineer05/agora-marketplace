// src/pages/customer/Orders.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../utils/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";

const foodSteps = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"];
const serviceSteps = ["Pending", "Accepted", "In Progress", "Completed"];

export default function CustomerOrders() {
  const { orders } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("food");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [backendOrders, setBackendOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOrder, setModalOrder] = useState(null);

  // Load orders from backend
  useEffect(() => {
    loadBackendOrders();
  }, []);

  const loadBackendOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      if (response.success) {
        setBackendOrders(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Poll for real-time updates every 15s
  useEffect(() => {
    const interval = setInterval(() => {
      loadBackendOrders();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Combine backend orders with local orders for fallback
  const allOrders = backendOrders.length > 0 ? backendOrders : orders;

  const foodOrders = allOrders.filter((o) => o.orderType === 'food' || o.mode === 'food');
  const serviceOrders = allOrders.filter((o) => o.orderType === 'service' || o.mode === 'service');

  const getSteps = () => {
    return activeTab === "food" ? foodSteps : serviceSteps;
  };

  const filterAndSort = (ordersList) => {
    let filtered = [...ordersList];
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    if (sortOrder === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
                <div className="absolute top-4 left-1/2 h-1 w-full bg-gray-300 dark:bg-gray-700 -z-10">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      i < activeIndex ? "bg-agoraTeal w-full" : "w-0"
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

    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agoraTeal"></div>
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No {activeTab} orders found
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-block px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
          >
            Start Ordering
          </Link>
        </div>
      );
    }

    return filtered.map((order) => {
      const activeIndex = steps.indexOf(order.status);

      return (
        <div
          key={order._id || order.id}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-6 mb-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="font-bold text-lg">
                {activeTab === "food"
                  ? `Order #${order._id ? order._id.slice(-8) : order.id}`
                  : `Service #${order._id ? order._id.slice(-8) : order.id}`}
              </h2>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-agoraTeal/20 text-agoraTeal font-semibold">
              {order.status}
            </span>
          </div>

          {/* Progress */}
          {steps.length > 1 && <ProgressTracker steps={steps} activeIndex={activeIndex} />}

          {/* Order Details */}
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <p><strong>Customer:</strong> {order.customerName}</p>
            {order.deliveryAddress && <p><strong>Address:</strong> {order.deliveryAddress}</p>}
            {order.specialInstructions && <p><strong>Instructions:</strong> {order.specialInstructions}</p>}
          </div>

          {/* Items */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Items:</h3>
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 border-t pt-3">
            <div className="flex justify-between font-bold">
              <span>Total Amount:</span>
              <span className="text-agoraTeal">₹{order.total}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            {activeTab === "food" && order.status === "Out for Delivery" && (
              <button
                onClick={() => navigate("/track-order", { state: { orderId: order._id || order.id } })}
                className="px-4 py-2 bg-agoraPink text-white rounded-full hover:scale-105 transition"
              >
                Track Order
              </button>
            )}
            <button
              onClick={() => setModalOrder(order)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-full"
            >
              Details
            </button>
            {order.status !== 'Delivered' && (
              <button
                onClick={async () => {
                  try {
                    await orderService.cancelOrder(order._id || order.id);
                    await loadBackendOrders();
                  } catch (err) {
                    console.error('Cancel failed', err);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-full"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  // Order details modal
  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Order Details</h3>
            <button onClick={onClose} className="text-gray-500">Close</button>
          </div>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>ID:</strong> {order._id || order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Items:</strong></p>
            <ul className="list-disc pl-5">
              {order.items?.map((it, i) => (
                <li key={i}>{it.name} × {it.quantity} — ₹{it.price * it.quantity}</li>
              ))}
            </ul>
            <p><strong>Total:</strong> ₹{order.total}</p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 bg-brand-gradient bg-clip-text text-transparent">
        My Orders
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["food", "service"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === tab
                ? "bg-agoraTeal text-black"
                : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab === "food" ? "🍴 Food Orders" : "🛠️ Services"}
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

      <div className="space-y-6">
        {activeTab === "food" && renderOrders(foodOrders, foodSteps)}
        {activeTab === "service" && renderOrders(serviceOrders, serviceSteps)}
      </div>
      {modalOrder && <OrderModal order={modalOrder} onClose={() => setModalOrder(null)} />}
    </main>
  );
}