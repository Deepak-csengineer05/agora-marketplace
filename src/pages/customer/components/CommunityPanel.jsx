import React from "react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

export default React.memo(function CommunityPanel({ friends, onStartGroup }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Social & Group Orders</div>
        <div className="text-xs text-gray-500">Invite friends • Split bills</div>
      </div>
      <div className="flex gap-2 items-center">
        {friends.map((f) => <div key={f.id} className="px-3 py-1 rounded bg-gray-50 dark:bg-gray-800 text-sm">{f.name}</div>)}
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="accent" onClick={onStartGroup}>Start group</Button>
          <Button size="sm" variant="ghost" onClick={() => alert("Shared wishlist (demo)")}>Wishlist</Button>
        </div>
      </div>
    </Card>
  );
});
