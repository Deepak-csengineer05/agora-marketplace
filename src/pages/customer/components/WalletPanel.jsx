import React from "react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

const formatCurrency = (n) => `₹${Math.round(n || 0)}`;

export default React.memo(function WalletPanel({ wallet, rewards, onTopUp, onToggleBNPL }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Wallet & Payments</div>
        <div className="text-xs text-gray-500">{wallet.bnplActive ? `BNPL ₹${wallet.bnplAmount}` : "No BNPL"}</div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <div className="text-xs text-gray-500">Balance</div>
          <div className="font-semibold text-lg">{formatCurrency(wallet.balance)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Cashback</div>
          <div className="font-semibold">{formatCurrency(rewards.cashback)}</div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="ghost" onClick={onTopUp}>Top-up</Button>
          <Button size="sm" variant="accent" onClick={onToggleBNPL}>{wallet.bnplActive ? "Disable BNPL" : "Enable BNPL"}</Button>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">BNPL is demo only — enable proper checks in production.</div>
    </Card>
  );
});
