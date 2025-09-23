  // src/pages/OrderSuccess.jsx
  import React from "react";
  import { Link, useLocation } from "react-router-dom";
  import { CheckCircle } from "lucide-react";

  export default function OrderSuccess() {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
      return (
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold">No order found!</h1>
          <Link
            to="/shop"
            className="mt-6 inline-block px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
          >
            Back to Shop
          </Link>
        </main>
      );
    }

    const mode = order.mode || "food";

    const messages = {
      food: {
        title: "Order Placed Successfully!",
        subtitle:
          "🎉 Thank you for ordering with AGORA. Your order is being prepared. You can track it in My Orders.",
      },
      service: {
        title: "Service Booked Successfully!",
        subtitle:
          "✅ Your service booking has been confirmed. Our provider will contact you soon.",
      },
      quote: {
        title: "Quote Requested Successfully!",
        subtitle:
          "📩 Thank you for requesting a quote. Our team will review your request and get back to you shortly.",
      },
    };

    const { title, subtitle } = messages[mode];

    function formatEta(eta) {
      if (!eta) return null;
      const diff = new Date(eta) - new Date();
      if (diff <= 0) return "Arriving soon 🚚";
      const mins = Math.ceil(diff / 60000);
      return `${mins} min${mins > 1 ? "s" : ""}`;
    }

    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-6" />
        <h1 className="text-4xl font-bold mb-4 bg-brand-gradient bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{subtitle}</p>

        {/* ✅ Order summary / receipt */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8 text-left">
          <h2 className="font-semibold text-lg mb-3">
            Order #{order.id.slice(0, 6)}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            👤 {order.details?.name} — {order.details?.phone}
          </p>

          {mode === "food" && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                📍 {order.details?.address}
              </p>

              {order.details?.specialInstructions && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  📝 Special Instructions: {order.details.specialInstructions}
                </p>
              )}
              {order.details?.messageForCook && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  👨‍🍳 Message for Cook: {order.details.messageForCook}
                </p>
              )}
            </>
          )}


          {order.items?.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700 mb-3">
              {order.items.map((item) => (
                <div
                  key={item.id || item.name}
                  className="flex justify-between py-2 text-sm"
                >
                  <span>
                    {item.name}
                    {mode === "food" && ` × ${item.qty}`}
                  </span>
                  <span className="font-semibold">
                    {mode === "food"
                      ? `₹${item.price * item.qty}`
                      : mode === "service"
                      ? `₹${item.rate || order.total}`
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          )}

          {mode === "food" && (
            <div className="border-t pt-3 text-sm space-y-1">
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
                  <Link
                    to={`/orders/${order.id}/track`}
                    className="px-3 py-1 bg-agoraPink text-black rounded-full text-sm font-semibold hover:scale-105 transition"
                  >
                    Track Live
                  </Link>
                </div>
              )}
            </div>
          )}

          {mode === "service" && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              📅 {order.details?.date} at {order.details?.time}
              {order.details?.notes && (
                <p className="mt-1">📝 {order.details.notes}</p>
              )}
              <div className="flex justify-between font-bold text-lg mt-3">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          )}

          {mode === "quote" && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>📝 {order.details?.notes || "No additional details provided."}</p>
            </div>
          )}
        </div>

        {/* ✅ Action buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/shop"
            className="px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
          >
            Continue Browsing
          </Link>
          <Link
            to="/orders"
            className="px-6 py-3 bg-agoraPink text-black font-semibold rounded-full hover:scale-105 transition"
          >
            {mode === "quote" ? "View Requests" : "Track Orders"}
          </Link>
          <Link
            to="/customer/dashboard"
            className="px-6 py-4 bg-green-400 text-black font-semibold rounded-full hover:scale-105 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }
