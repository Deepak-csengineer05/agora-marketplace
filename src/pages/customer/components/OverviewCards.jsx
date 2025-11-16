import React from "react";
import { MapPin, Gift } from "lucide-react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

const formatCurrency = (n) => `₹${Math.round(n || 0)}`;

export default React.memo(function OverviewCards({ orders, rewards, lifetimeSpend }) {
  const activeOrder = orders.find((o) => ["Preparing", "On the way", "Ready for pickup"].includes(o.status));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Next Delivery</div>
            <div className="font-semibold">{activeOrder?.status || "No active orders"}</div>
            <div className="text-sm text-gray-500">{activeOrder ? `~${activeOrder.etaMinutes || 20} mins` : "Shop now"}</div>
          </div>
          <MapPin className="w-6 h-6 text-agoraPink" />
        </div>
      </Card>

      <Card>
        <div className="text-xs text-gray-500">Rewards</div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="font-semibold text-lg">{rewards.points} pts</div>
            <div className="text-sm text-gray-500">Tier: {rewards.tier}</div>
          </div>
          <Gift className="w-6 h-6 text-yellow-500" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="primary">Redeem</Button>
          <Button size="sm" variant="ghost">+50 pts</Button>
        </div>
      </Card>

      <Card>
        <div className="text-xs text-gray-500">Spending (last 30 days)</div>
        <div className="font-semibold text-lg mt-1">{formatCurrency(lifetimeSpend)}</div>
        <div className="text-sm text-gray-500 mt-2">Cashback: {formatCurrency(rewards.cashback)}</div>
      </Card>
    </div>
  );
});
