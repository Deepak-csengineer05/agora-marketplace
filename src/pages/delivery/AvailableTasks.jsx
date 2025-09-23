// src/pages/delivery/AvailableTasks.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useDelivery } from "../../utils/DeliveryContext";
import { MapPin, Clock, DollarSign, Package, Filter } from "lucide-react";

const mockTasks = [
  {
    id: "T001",
    vendor: "Priya's Biryani",
    pickup: "Anna Nagar",
    customer: "Kumar",
    drop: "Tambaram",
    distance: 6.2,
    orderValue: 520,
    deliveryFee: 60,
    pickupTime: "12:30 PM",
    otp: "1234",
  },
  {
    id: "T002",
    vendor: "SR Bakery",
    pickup: "T Nagar",
    customer: "Anjali",
    drop: "Guindy",
    distance: 3.5,
    orderValue: 220,
    deliveryFee: 45,
    pickupTime: "12:45 PM",
    otp: "5678",
  },
  {
    id: "T003",
    vendor: "The Craft Cafe",
    pickup: "Velachery",
    customer: "Rahul",
    drop: "Adyar",
    distance: 8.1,
    orderValue: 610,
    deliveryFee: 80,
    pickupTime: "01:15 PM",
    otp: "9101",
  },
];

export default function AvailableTasks() {
  const [tasks, setTasks] = useState([]);
  const { availableTasks, setAvailableTasks, acceptTask } = useDelivery();

  // Load from localStorage or fallback mock
  useEffect(() => {
    if (availableTasks.length > 0) {
      setTasks(availableTasks);
    } else {
      // seed mock only once if storage empty
      localStorage.setItem("availableTasks", JSON.stringify(mockTasks));
      setAvailableTasks(mockTasks);
      setTasks(mockTasks);
    }
  }, [availableTasks, setAvailableTasks]);

  const [sortBy, setSortBy] = useState("time");

  // Sorting logic
  const sortedTasks = useMemo(() => {
    const sorted = [...tasks];
    switch (sortBy) {
      case "distance":
        return sorted.sort((a, b) => a.distance - b.distance);
      case "fee":
        return sorted.sort((a, b) => b.deliveryFee - a.deliveryFee);
      case "value":
        return sorted.sort((a, b) => b.orderValue - a.orderValue);
      default:
        return sorted; // time (mock doesn't include timestamp, so just keep order)
    }
  }, [tasks, sortBy]);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">📦 Available Tasks</h1>

      {/* Sorting controls */}
      <div className="flex gap-2 items-center">
        <Filter className="w-4 h-4" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded border dark:bg-gray-900"
        >
          <option value="time">Sort by Time</option>
          <option value="distance">Sort by Distance</option>
          <option value="fee">Sort by Delivery Fee</option>
          <option value="value">Sort by Order Value</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{task.vendor}</h2>
              <span className="text-sm text-gray-500">ID: {task.id}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="inline w-4 h-4 mr-1" /> {task.pickup} → {task.drop}
            </div>
            <div className="flex justify-between text-sm">
              <span>
                <Clock className="inline w-4 h-4 mr-1" /> {task.pickupTime}
              </span>
              <span>
               Fee: ₹{task.deliveryFee}
              </span>
            </div>
            <div className="text-sm">
              <Package className="inline w-4 h-4 mr-1" /> Order Value: ₹{task.orderValue}
            </div>
            <div className="text-sm">
              Distance: <strong>{task.distance} km</strong>
            </div>
            <button
              onClick={() => {
                acceptTask(task); // ✅ now using DeliveryContext version
                alert(`✅ Task ${task.id} accepted! Check Ongoing Deliveries.`);
              }}
              className="mt-2 px-3 py-2 rounded bg-agoraTeal text-black font-semibold w-full"
            >
              Accept Task
            </button>
          </div>
        ))}
        {sortedTasks.length === 0 && (
          <p className="text-gray-500">No tasks available right now.</p>
        )}
      </div>
    </div>
  );
}
