import React, { useState } from "react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

const formatCurrency = (n) => `₹${Math.round(n || 0)}`;

function SchedulerPanel({ schedules, onAdd, onRemove }) {
  const [vendor, setVendor] = useState("");
  const [time, setTime] = useState("12:30");
  const [total, setTotal] = useState(250);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Auto-Reorder Scheduler</div>
        <div className="text-xs text-gray-500">Never run out</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <input placeholder="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800" />
        <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-28" />
        <Button size="sm" variant="primary" onClick={() => { onAdd({ vendor: vendor || "HomeChef", time, total }); setVendor(""); }}>Add</Button>
      </div>

      <div className="mt-3 space-y-2">
        {schedules.length === 0 ? <div className="text-xs text-gray-500">No schedules yet.</div> : schedules.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">
            <div>
              <div className="font-medium">{s.vendor}</div>
              <div className="text-xs text-gray-500">{s.time} • {formatCurrency(s.total)}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onRemove(s.id)}>Remove</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default React.memo(SchedulerPanel);
