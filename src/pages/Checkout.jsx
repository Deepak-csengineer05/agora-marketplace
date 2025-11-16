// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../utils/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import { orderService } from "../services/orderService";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { placeOrder, cart } = useCart();

  const mode = location.state?.mode || "food";
  const items = location.state?.items || [];
  const service = location.state?.service || null;

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cod",
    specialInstructions: "",
    messageForCook: "",
    scheduledTime: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "food" && items.length === 0) {
        alert("No items to checkout!");
        return;
      }

      if ((mode === "service" || mode === "quote") && !service) {
        alert("No service selected!");
        return;
      }

      // Prepare order data for backend
      const orderData = {
        orderType: mode === "food" ? "food" : "service",
        items: mode === "food" 
          ? items.map(item => ({
              product: item.id,
              quantity: item.qty
            }))
          : [{
              service: service.id,
              quantity: 1
            }],
        deliveryAddress: form.address,
        specialInstructions: form.specialInstructions,
        messageForCook: form.messageForCook,
        scheduledTime: form.scheduledTime,
        paymentMethod: form.paymentMethod
      };

      // Send to backend
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        // Merge backend response with form details and item info
        const enrichedOrder = {
          ...response.data,
          id: response.data._id, // Ensure id field exists
          details: {
            name: form.name,
            phone: form.phone,
            address: form.address,
            specialInstructions: form.specialInstructions,
            messageForCook: form.messageForCook,
            date: form.scheduledTime ? new Date(form.scheduledTime).toLocaleDateString() : '',
            time: form.scheduledTime ? new Date(form.scheduledTime).toLocaleTimeString() : '',
            notes: form.notes
          },
          mode: mode === "food" ? "food" : "service",
          items: mode === "food" 
            ? items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty,
                vendorName: item.vendorName
              }))
            : [
                {
                  id: service.id,
                  name: service.name,
                  rate: service.rate,
                  qty: 1,
                  vendorName: service.vendorName
                }
              ]
        };

        // ✅ FIXED: Added await before placeOrder
        const localOrder = await placeOrder({
          details: enrichedOrder.details,
          mode: enrichedOrder.mode,
          items: enrichedOrder.items,
          subtotal: response.data.subtotal || 0,
          deliveryFee: response.data.deliveryFee || 0,
          total: response.data.total || 0,
          status: "Pending",
          createdAt: new Date().toISOString(),
          deliveryEta: new Date(Date.now() + 45 * 60000).toISOString(),
        });

        // ✅ FIXED: Add safety check for navigation state
        const navigationState = {
          order: enrichedOrder,
          localOrder: localOrder
        };

        // Safety validation
        try {
          JSON.stringify(navigationState);
        } catch (err) {
          console.warn('Navigation state contains non-serializable data, using fallback');
          navigationState.localOrder = null;
        }

        // Redirect to success page
        navigate("/order-success", {
          replace: true,
          state: navigationState
        });
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert(error.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
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

            <textarea
              placeholder="Special Instructions (e.g. leave at door)"
              rows={2}
              value={form.specialInstructions}
              onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            />

            <textarea
              placeholder="Message for the Cook"
              rows={2}
              value={form.messageForCook}
              onChange={(e) => setForm({ ...form, messageForCook: e.target.value })}
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
              <input
                type="datetime-local"
                required
                value={form.scheduledTime}
                onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
            )}
          </>
        )}

        <div>
          <label className="block font-medium mb-2">Payment Method</label>
          <select
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          >
            <option value="cod">
              {mode === "quote" ? "Pay Later (after quote)" : "Cash on Delivery"}
            </option>
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="md"
          className="w-full"
        >
          {loading ? "Processing..." : mode === "food"
            ? "Place Order"
            : mode === "service"
            ? "Book Service"
            : "Request Quote"}
        </Button>
      </form>
    </main>
  );
}