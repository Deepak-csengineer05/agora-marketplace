import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../../../components/UI/Card";

export default React.memo(function SpendingChart({ spendSeries }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Spending Overview</div>
        <div className="text-sm text-gray-500">Real-time data</div>
      </div>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={spendSeries}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="spend" stroke="#14b8a6" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});
