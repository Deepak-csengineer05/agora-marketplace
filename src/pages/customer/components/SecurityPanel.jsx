import React from "react";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";

export default React.memo(function SecurityPanel() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Security & Privacy</div>
        <div className="text-xs text-gray-500">Control sensitive actions</div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Two-factor authentication</div>
            <div className="text-xs text-gray-500">Protects your account</div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => alert("2FA setup demo")}>Setup</Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Face/Fingerprint unlock</div>
            <div className="text-xs text-gray-500">Use biometrics for checkout</div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => alert("Biometrics demo")}>Enable</Button>
        </div>
      </div>
    </Card>
  );
});
