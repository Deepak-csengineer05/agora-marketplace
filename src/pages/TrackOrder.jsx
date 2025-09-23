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

      <button
        onClick={() => navigate("/orders")}
        className="px-6 py-3 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
      >
        Back to Orders
      </button>
    </main>
  );
}
