import React from "react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

export default React.memo(function HealthPanel({ caloriesWeek }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Health & Nutrition</div>
        <div className="text-xs text-gray-500">Calories this week</div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <div className="text-xs text-gray-500">Estimated calories</div>
          <div className="text-2xl font-semibold">{caloriesWeek} kcal</div>
          <div className="text-sm text-gray-500">From your orders</div>
        </div>
        <div className="ml-auto">
          <Button size="sm" variant="primary" onClick={() => alert("Nutrition plans (demo)")}>Meal plan</Button>
        </div>
      </div>
    </Card>
  );
});
