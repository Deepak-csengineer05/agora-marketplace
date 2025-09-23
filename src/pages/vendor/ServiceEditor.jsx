// src/pages/vendor/ServiceEditor.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ServiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { services, saveService } = useVendorServices();

  const editing = id && services.find((s) => String(s.id) === id);

  const [form, setForm] = useState(
    editing || {
      id: Date.now(),
      name: "",
      price: "",
      description: "",
      duration: "",
      availability: true,
    }
  );

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    saveService(form);
    navigate("/vendor/services");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editing ? "Edit Service" : "Add New Service"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm mb-1">Service Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Duration (e.g. 1hr)</label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="availability" checked={form.availability} onChange={handleChange} />
            Available
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-agoraTeal text-black font-semibold rounded-md hover:scale-105 transition">
            {editing ? "Update Service" : "Add Service"}
          </button>
          <button type="button" onClick={() => navigate("/vendor/services")} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* Hook to manage vendor services in localStorage */
function useVendorServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("vendor_services")) || [];
    setServices(saved);
  }, []);

  const saveService = (service) => {
    setServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      let updated;
      if (exists) updated = prev.map((s) => (s.id === service.id ? service : s));
      else updated = [...prev, service];
      localStorage.setItem("vendor_services", JSON.stringify(updated));
      return updated;
    });
  };

  return { services, saveService };
}
