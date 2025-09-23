// src/pages/vendor/MenuPage.jsx
import React, { useState, useEffect } from "react";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", desc: "" });
  const [editingId, setEditingId] = useState(null);

  // Load menu from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("vendor_menu")) || [];
    setMenu(saved);
  }, []);

  // Save menu to localStorage
  useEffect(() => {
    localStorage.setItem("vendor_menu", JSON.stringify(menu));
  }, [menu]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      // update
      setMenu((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
      setEditingId(null);
    } else {
      // create new
      const newDish = { ...form, id: Date.now() };
      setMenu((prev) => [...prev, newDish]);
    }

    setForm({ name: "", price: "", desc: "" });
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price, desc: item.desc });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this dish?")) {
      setMenu((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🍴 Manage Menu</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 shadow rounded-lg p-4 mb-8 space-y-3"
      >
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Dish name"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800"
        />
        <input
          required
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="Price (₹)"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800"
        />
        <textarea
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          placeholder="Description"
          className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded bg-agoraTeal text-black font-semibold"
        >
          {editingId ? "Update Dish" : "Add Dish"}
        </button>
      </form>

      {/* Menu List */}
      <div className="space-y-4">
        {menu.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
              <div className="text-sm font-semibold mt-1">₹{item.price}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 text-sm rounded bg-blue-500 text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {menu.length === 0 && (
          <p className="text-gray-500 text-center">No dishes yet.</p>
        )}
      </div>
    </div>
  );
}
