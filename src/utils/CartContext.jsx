// src/utils/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { orderService } from "../services/orderService";
import { authService } from "../services/authService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load orders from backend API
  useEffect(() => {
    if (authService.isAuthenticated()) {
      loadOrdersFromBackend();
    }
  }, []);

  // Load orders from backend
  const loadOrdersFromBackend = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      if (response && response.success) {
        // Transform backend orders to match frontend format
        const transformedOrders = (response.data || []).map(order => ({
          id: order._id,
          mode: order.orderType === 'service' ? 'service' : 'food',
          items: (order.items || []).map(item => ({
            id: item.product || item.service,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            vendorName: item.vendorName,
            vendorId: item.vendor
          })),
          subtotal: order.subtotal || 0,
          deliveryFee: order.deliveryFee || 0,
          total: order.total || 0,
          details: {
            name: order.customerName || '',
            phone: order.customerPhone || '',
            address: order.deliveryAddress || {},
            notes: order.specialInstructions || ''
          },
          status: order.status || 'Pending',
          createdAt: order.createdAt,
          deliveryEta: order.estimatedDelivery,
          history: order.timeline || [
            {
              status: order.status || 'Pending',
              time: new Date(order.createdAt).toLocaleString(),
            },
          ],
          kitchenName: (order.items && order.items[0]?.vendorName) || "Agora Vendor",
          // Backend specific fields
          _id: order._id,
          orderType: order.orderType,
          paymentMethod: order.paymentMethod
        }));
        setOrders(transformedOrders);
      } else {
        // Fallback if response is invalid
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(savedOrders);
      }
    } catch (error) {
      console.error('Failed to load orders from backend:', error);
      // Gracefully fallback to localStorage
      try {
        const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(savedOrders);
      } catch (storageError) {
        console.error('Failed to load from localStorage:', storageError);
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save orders to localStorage as backup
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

  // 🔹 Place order (now connects to backend API)
  const placeOrder = async (orderData) => {
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error("Cart is empty");
    }

    if (!authService.isAuthenticated()) {
      throw new Error("Please login to place an order");
    }

    try {
      setLoading(true);

      // Transform frontend order data to backend format
      const backendOrderData = {
        orderType: orderData.mode === 'service' ? 'service' : 'food',
        items: orderData.items.map(item => ({
          product: item.mode === 'service' ? undefined : item.id,
          service: item.mode === 'service' ? item.id : undefined,
          quantity: item.qty
        })),
        deliveryAddress: orderData.details?.address,
        scheduledTime: orderData.details?.scheduledTime,
        specialInstructions: orderData.details?.notes,
        paymentMethod: orderData.paymentMethod || 'cod'
      };

      // Send to backend
      const response = await orderService.createOrder(backendOrderData);
      
      if (response.success) {
        const newOrder = {
          id: response.data._id,
          mode: response.data.orderType === 'service' ? 'service' : 'food',
          items: response.data.items.map(item => ({
            id: item.product || item.service,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            vendorName: item.vendorName
          })),
          subtotal: response.data.subtotal,
          deliveryFee: response.data.deliveryFee,
          total: response.data.total,
          details: {
            name: response.data.customerName,
            phone: response.data.customerPhone,
            address: response.data.deliveryAddress,
            notes: response.data.specialInstructions
          },
          status: response.data.status,
          createdAt: response.data.createdAt,
          history: response.data.timeline || [
            {
              status: response.data.status,
              time: new Date(response.data.createdAt).toLocaleString(),
            },
          ],
          kitchenName: response.data.items[0]?.vendorName || "Agora Vendor",
          // Backend fields
          _id: response.data._id,
          orderType: response.data.orderType
        };

        // Update local state
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);

        // Clear cart only if it was a food order
        if (orderData.mode === "food") {
          setCart([]);
        }

        return newOrder;
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      
      // Fallback to localStorage if backend fails
      if (!authService.isAuthenticated()) {
        const newOrder = {
          id: Date.now().toString(),
          mode: orderData.mode || "food",
          items: orderData.items,
          subtotal: orderData.subtotal || 0,
          deliveryFee: orderData.deliveryFee || 0,
          total: orderData.total,
          details: orderData.details || {},
          status: orderData.status || "Pending",
          createdAt: orderData.createdAt || new Date().toISOString(),
          deliveryEta: orderData.deliveryEta || null,
          history: [
            {
              status: "Pending",
              time: new Date().toLocaleString(),
            },
          ],
          kitchenName: orderData.items[0]?.vendorName || "Agora Vendor",
        };

        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);

        if (orderData.mode === "food") {
          setCart([]);
        }

        return newOrder;
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update order status (connects to backend)
  const updateOrderStatus = async (orderId, status) => {
    try {
      // If user is vendor/admin, update via backend
      const user = authService.getStoredUser();
      if (user && (user.role === 'vendor' || user.role === 'admin')) {
        await orderService.updateOrderStatus(orderId, status);
      }

      // Update local state
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
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Fallback to local update if backend fails
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
    }
  };

  // 🔹 Refresh orders from backend
  const refreshOrders = () => {
    if (authService.isAuthenticated()) {
      loadOrdersFromBackend();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        loading,
        addToCart,
        removeFromCart,
        updateQty,
        placeOrder,
        updateOrderStatus,
        refreshOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}