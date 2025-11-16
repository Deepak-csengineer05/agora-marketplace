import React from "react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

const formatCurrency = (n) => `₹${Math.round(n || 0)}`;

export default React.memo(function OrdersPanel({ orders, totalOrders, onReorder, onTrack }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Recent Orders</div>
        <div className="text-xs text-gray-500">{totalOrders} total</div>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet — explore the shop.</p>
      ) : (
        <div className="space-y-3">
          {orders.slice(0, 6).map((o) => (
            <div key={o._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-full sm:w-2/3">
                <div className="font-medium text-sm">{o.customerName} • <span className="text-xs text-gray-500">{o.status}</span></div>
                <div className="text-xs text-gray-500">{o.items.map((it) => `${it.name} x${it.quantity || 1}`).join(", ")}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(o.createdAt).toLocaleString()}</div>
              </div>

              <div className="w-full sm:w-auto text-right mt-3 sm:mt-0">
                <div className="font-semibold">{formatCurrency(o.total)}</div>
                <div className="mt-2 flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => onReorder(o._id)}>Reorder</Button>
                  <Button size="sm" variant="ghost" onClick={() => onTrack()}>Track</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});
