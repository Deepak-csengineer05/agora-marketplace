  // src/pages/OrderSuccess.jsx
  import React from "react";
  import { Link, useLocation } from "react-router-dom";
  import { CheckCircle } from "lucide-react";
  import PageContainer from "../components/UI/PageContainer";
  import Card from "../components/UI/Card";
  import Button from "../components/UI/Button";

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

    // Safe ID extraction (handles both 'id' and '_id')
    const orderId = order.id || order._id || 'unknown';
    const shortId = orderId.toString().slice(0, 6);

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
      <PageContainer title={title} className="text-center">
        <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-6" />
        <p className="text-gray-600 dark:text-gray-400 mb-8">{subtitle}</p>

        {/* ✅ Order summary / receipt */}
        <Card className="mb-8 text-left">
          <h2 className="font-semibold text-lg mb-3">
            Order #{shortId}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            👤 {order.details?.name || 'Customer'} — {order.details?.phone || 'N/A'}
          </p>

          {mode === "food" && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                📍 {order.details?.address || 'Delivery address not provided'}
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
              {order.items.map((item) => {
                const qty = item.qty || item.quantity || 1;
                const price = item.price || item.rate || 0;
                const itemTotal = price * qty;
                
                return (
                  <div
                    key={item.id || item.name}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>
                      {item.name || 'Unknown Item'}
                      {mode === "food" && ` × ${qty}`}
                    </span>
                    <span className="font-semibold">
                      {mode === "food"
                        ? `₹${isNaN(itemTotal) ? 0 : itemTotal}`
                        : mode === "service"
                        ? `₹${isNaN(price) ? 0 : price}`
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {mode === "food" && (
            <div className="border-t pt-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{isNaN(order.subtotal) ? 0 : order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{isNaN(order.deliveryFee) ? 0 : order.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{isNaN(order.total) ? 0 : order.total}</span>
              </div>
              {order.deliveryEta && (
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-agoraTeal font-medium">
                    ETA: {formatEta(order.deliveryEta)}
                  </p>
                  <Link
                    to={`/orders/${orderId}/track`}
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
        </Card>

        {/* ✅ Action buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/shop">
            <Button variant="primary" size="lg">Continue Browsing</Button>
          </Link>

          <Link to="/orders">
            <Button variant="accent" size="lg">{mode === "quote" ? "View Requests" : "Track Orders"}</Button>
          </Link>

          <Link to="/customer/dashboard">
            <Button variant="success" size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }
