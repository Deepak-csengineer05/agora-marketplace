// src/pages/vendor/MenuEditor.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function MenuEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { menu, saveMenuItem } = useVendorMenu();

  const editing = id && menu.find((item) => String(item.id) === id);

  const [form, setForm] = useState(
    editing || {
      id: Date.now(),
      name: "",
      price: "",
      description: "",
      image: "",
      category: "Main Course",
      availability: true,
    }
  );

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    saveMenuItem(form);
    navigate("/vendor/menu");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editing ? "Edit Dish" : "Add New Dish"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm mb-1">Dish Name</label>
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
          <label className="block text-sm mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800"
          >
            <option>Main Course</option>
            <option>Starter</option>
            <option>Beverage</option>
            <option>Dessert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Image URL</label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://example.com/dish.jpg"
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
            {editing ? "Update Dish" : "Add Dish"}
          </button>
          <button type="button" onClick={() => navigate("/vendor/menu")} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* Hook to manage vendor menu in localStorage */
function useVendorMenu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("vendor_menu")) || [];
    setMenu(saved);
  }, []);

  const saveMenuItem = (item) => {
    setMenu((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      let updated;
      if (exists) updated = prev.map((i) => (i.id === item.id ? item : i));
      else updated = [...prev, item];
      localStorage.setItem("vendor_menu", JSON.stringify(updated));
      return updated;
    });
  };

  return { menu, saveMenuItem };
}
