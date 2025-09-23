// src/pages/vendor/ServicePage.jsx
import React, { useState, useEffect } from "react";

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", desc: "", unit: "per hour" });
  const [editingId, setEditingId] = useState(null);

  // Load services from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("vendor_services")) || [];
    setServices(saved);
  }, []);

  // Save to localStorage whenever services change
  useEffect(() => {
    localStorage.setItem("vendor_services", JSON.stringify(services));
  }, [services]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s))
      );
      setEditingId(null);
    } else {
      const newService = { ...form, id: Date.now() };
      setServices((prev) => [...prev, newService]);
    }

    setForm({ name: "", price: "", desc: "", unit: "per hour" });
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      price: service.price,
      desc: service.desc,
      unit: service.unit,
    });
    setEditingId(service.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this service?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🔧 Manage Services</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 shadow rounded-lg p-4 mb-8 space-y-3"
      >
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Service name (e.g., Plumbing, Electrician)"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800"
        />
        <input
          required
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800"
        />
        <select
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800"
        >
          <option value="per hour">Per Hour</option>
          <option value="per day">Per Day</option>
          <option value="per job">Per Job</option>
        </select>
        <textarea
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          placeholder="Description (e.g., Fixes leakage, installs pipes)"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded bg-agoraPink text-black font-semibold"
        >
          {editingId ? "Update Service" : "Add Service"}
        </button>
      </form>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div>
              <div className="font-bold">{service.name}</div>
              <div className="text-sm text-gray-500">{service.desc}</div>
              <div className="text-sm font-semibold mt-1">
                ₹{service.price} {service.unit}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(service)}
                className="px-3 py-1 text-sm rounded bg-blue-500 text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-gray-500 text-center">No services yet.</p>
        )}
      </div>
    </div>
  );
}
