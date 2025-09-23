// src/utils/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  // Save orders to localStorage on change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // 🔹 Add item to cart
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // 🔹 Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  // 🔹 Update quantity
  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, qty) } : p
      )
    );
  };

  // 🔹 Place order (fixed to preserve subtotal, deliveryFee, details)
  const placeOrder = (orderData) => {
    if (!orderData.items || orderData.items.length === 0) {
      return null; // nothing to order
    }

    const newOrder = {
      id: Date.now().toString(), // ✅ unique ID
      mode: orderData.mode || "food", // food | service | quote
      items: orderData.items,
      subtotal: orderData.subtotal || 0,
      deliveryFee: orderData.deliveryFee || 0,
      total: orderData.total,
      details: orderData.details || {}, // ✅ form details (name, address, phone, notes, etc.)
      status: orderData.status || "Pending",
      createdAt: orderData.createdAt || new Date().toISOString(),
      deliveryEta: orderData.deliveryEta || null,
      history: [
        {
          status: "Pending",
          time: new Date().toLocaleString(),
        },
      ],
      kitchenName:
        orderData.items[0]?.vendorName ||
        orderData.items[0]?.kitchen ||
        orderData.items[0]?.name ||
        "Agora Vendor",
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);

    // Clear cart only if it was a food/cart order
    if (orderData.mode === "food") {
      setCart([]);
    }

    return newOrder; // ✅ so Checkout → OrderSuccess works
  };

  // 🔹 Update order status
  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              history: [
                ...o.history,
                { status, time: new Date().toLocaleString() },
              ],
            }
          : o
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQty,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
