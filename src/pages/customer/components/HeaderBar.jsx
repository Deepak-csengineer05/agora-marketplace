import React from "react";
import { Wallet, Gift, Mic } from "lucide-react";
import Button from "../../../components/UI/Button";

const formatCurrency = (n) => `₹${Math.round(n || 0)}`;

export default React.memo(function HeaderBar({ user, loading, totalOrders, wallet, rewards, onVoiceClick }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold">
          Welcome back, <span className="text-agoraTeal">{user.name || "Guest"}</span>
        </h1>
        <p className="text-sm text-gray-500">Real-time dashboard • {loading ? "Updating..." : `${totalOrders} orders`}</p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-2">
          <Wallet className="w-4 h-4" /> <div className="text-sm font-medium">{formatCurrency(wallet.balance)}</div>
        </div>

        <div className="flex gap-2 ml-auto md:ml-0">
          <Button variant="accent" size="sm" onClick={onVoiceClick} className="flex items-center gap-2">
            <Mic className="w-4 h-4" /> Voice
          </Button>

          <div className="hidden sm:flex items-center px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-sm gap-2">
            <Gift className="w-4 h-4 text-yellow-500" /> <span>{rewards.points} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
});
