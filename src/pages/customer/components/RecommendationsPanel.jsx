import React from "react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

const formatCurrency = (n) => `₹${Math.round(n || 0)}`;

function RecommendationsPanel({ onOrderClick }) {
  const recommendations = [
    { id: "r1", title: "Paneer Butter Masala", vendor: "HomeChef", price: 220, kcal: 650 },
    { id: "r2", title: "Organic Detergent (2kg)", vendor: "CleanCo", price: 420, kcal: 0 },
    { id: "r3", title: "Electrician - 1 hr", vendor: "QuickFix", price: 600, kcal: 0 },
    { id: "r4", title: "Protein Smoothie", vendor: "FitBar", price: 180, kcal: 320 },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Recommended for you</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((r) => (
          <div key={r.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-start justify-between">
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-gray-500">{r.vendor} • {r.kcal ? `${r.kcal} kcal` : "service"}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatCurrency(r.price)}</div>
              <div className="mt-2 flex flex-col gap-2">
                <Button size="sm" variant="accent" onClick={() => onOrderClick({ vendor: r.vendor, total: r.price, items: [{ name: r.title, quantity: 1, kcal: r.kcal }] })}>Order</Button>
                <button onClick={() => alert("Saved to wishlist (demo)")} className="text-xs text-gray-500">Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default React.memo(RecommendationsPanel);
