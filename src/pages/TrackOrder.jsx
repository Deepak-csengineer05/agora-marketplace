// src/pages/TrackOrder.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// ✅ Fix default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function TrackOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useCart();

  const orderId = location.state?.orderId;
  const order = orders.find((o) => o.id === orderId);

  // 🚚 Simulated driver position (Delhi as base)
  const [driverPos, setDriverPos] = useState([28.6139, 77.209]);

  // Simulate driver moving randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPos(([lat, lng]) => [
        lat + (Math.random() - 0.5) * 0.001,
        lng + (Math.random() - 0.5) * 0.001,
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500">Order Not Found</h1>
        <button
          onClick={() => navigate("/orders")}
          className="mt-6 px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
        >
          Back to Orders
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent">
        Tracking Order #{order.id}
      </h1>

      {/* ETA */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow">
        <p className="text-lg font-semibold">Estimated Delivery</p>
        <p className="text-xl text-agoraPink">
          {order.deliveryEta
            ? new Date(order.deliveryEta).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </p>
      </div>

      {/* Status Timeline */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow">
        <p className="text-lg font-semibold mb-3">Order Updates</p>
        <ul className="space-y-2">
          {order.history.map((h, i) => (
            <li
              key={i}
              className={`flex items-center space-x-2 ${
                i === order.history.length - 1
                  ? "font-bold text-agoraTeal"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="w-2 h-2 bg-agoraTeal rounded-full"></span>
              <span>{h.status}</span>
              <span className="text-gray-500 text-sm">({h.time})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Live Map */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl shadow">
        <p className="mb-2 font-medium">Live Location</p>
        <MapContainer
          center={driverPos}
          zoom={14}
          className="w-full h-[400px] rounded-xl shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          <Marker position={driverPos}>
            <Popup>Delivery Agent 🚴‍♂️</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Live Chat & Driver Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <p className="mb-2 font-medium">Live Chat with Driver</p>
          <div className="h-64 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded">
            {/* messages */}
            <ChatWindow />
          </div>
          <ChatInput />
        </div>

        <aside className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <p className="font-medium">Driver Contact</p>
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Name:</strong> {order.driver?.name || 'Delivery Agent'}</p>
            <p><strong>Phone:</strong> {order.driver?.phone || 'N/A'}</p>
            <p className="mt-2"><a href={`tel:${order.driver?.phone || ''}`} className="text-agoraTeal">Call Driver</a></p>
          </div>
        </aside>
      </div>
      <button
        onClick={() => navigate("/orders")}
        className="px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
      >
        Back to Orders
      </button>
    </main>
  );
}

/* ----------------- Simple Chat Components (UI-only) ----------------- */
function ChatWindow() {
  const [messages, setMessages] = React.useState([
    { from: 'system', text: 'Driver is on the way.' },
  ]);

  // Expose a simple message append via event
  React.useEffect(() => {
    const onNew = (e) => {
      // noop for now - no global bus
    };
    return () => {};
  }, []);

  return (
    <div className="space-y-2">
      {messages.map((m, i) => (
        <div key={i} className={`p-2 rounded ${m.from === 'me' ? 'bg-agoraTeal text-black self-end' : 'bg-gray-100 dark:bg-gray-800'}`}>
          {m.text}
        </div>
      ))}
    </div>
  );
}

function ChatInput() {
  const [value, setValue] = React.useState('');
  const [msgs, setMsgs] = React.useState([]);
  const ref = React.useRef();

  const send = () => {
    if (!value.trim()) return;
    setMsgs((s) => [...s, { from: 'me', text: value }]);
    setValue('');
    // simulated reply
    setTimeout(() => setMsgs((s) => [...s, { from: 'them', text: 'On my way!' }]), 1200);
  };

  return (
    <div className="mt-3 flex gap-2">
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Message driver..."
        className="flex-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      />
      <button onClick={send} className="px-4 py-2 bg-agoraTeal rounded text-black">Send</button>
    </div>
  );
}
