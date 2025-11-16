import React from "react";
import Card from "../../../components/UI/Card";

export default React.memo(function LiveMap({ orders }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Live Orders Map</div>
        <div className="text-xs text-gray-500">Mock locations</div>
      </div>
      <div className="w-full h-48 rounded overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <svg viewBox="0 0 300 150" className="w-full h-full">
          <rect x="0" y="0" width="300" height="150" fill="transparent" />
          {orders.slice(0, 6).map((o, idx) => (
            <g key={o._id} transform={`translate(${o.location?.x || (30 + idx * 40)}, ${(o.location?.y) || (30 + (idx % 3) * 30)})`}>
              <circle r="6" fill={o.status === "Delivered" ? "#a3e635" : "#f472b6"} />
              <text x="10" y="4" fontSize="9" fill="#111">{o._id.slice(0, 6)}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="text-xs text-gray-500 mt-2">ETA predictions use historical data (demo).</div>
    </Card>
  );
});
