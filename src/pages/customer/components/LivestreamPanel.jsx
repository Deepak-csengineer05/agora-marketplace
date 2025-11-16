import React from "react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

export default React.memo(function LivestreamPanel({ livestreamActive, onToggle }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Vendor Livestream</div>
        <div className="text-xs text-gray-500">Watch & buy live</div>
      </div>
      {!livestreamActive ? (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">No active stream</div>
            <div className="text-xs text-gray-500">Vendors go live with deals</div>
          </div>
          <Button size="sm" variant="primary" onClick={onToggle}>Go live</Button>
        </div>
      ) : (
        <div className="rounded-lg bg-black text-white p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">Chef Live — Tonight 7:00 PM</div>
            <div className="text-xs text-gray-300">Cooking paneer specials • Tap to buy</div>
          </div>
          <Button size="sm" variant="primary" onClick={() => alert("Join stream (demo)")} className="bg-yellow-400 text-black hover:bg-yellow-500">Join</Button>
        </div>
      )}
    </Card>
  );
});
