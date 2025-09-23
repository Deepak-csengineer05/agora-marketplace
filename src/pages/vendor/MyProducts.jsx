// src/pages/vendor/MyProducts.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/auth";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

/**
 * Simple localStorage-backed product CRUD for vendors.
 * Key: "agora_products" (array)
 * Product: { id, name, price, desc, vendorEmail, vendorName, createdAt }
 */

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem("agora_products") || "[]");
  } catch {
    return [];
  }
}

function saveAll(arr) {
  localStorage.setItem("agora_products", JSON.stringify(arr));
}

export default function MyProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const vendorEmail = user?.email;
  const vendorName = user?.name || user?.storeName || "Vendor";

  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // product object or null
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    const all = loadAll();
    setProducts(all.filter((p) => p.vendorEmail === vendorEmail));
  }, [vendorEmail]);

  function refresh() {
    const all = loadAll();
    setProducts(all.filter((p) => p.vendorEmail === vendorEmail));
  }

  function upsertProduct(data) {
    const all = loadAll();
    if (data.id) {
      // update
      const updated = all.map((p) => (p.id === data.id ? { ...p, ...data } : p));
      saveAll(updated);
    } else {
      // create
      const newP = {
        id: uuidv4(),
        name: data.name,
        price: Number(data.price) || 0,
        desc: data.desc || "",
        vendorEmail,
        vendorName,
        createdAt: new Date().toISOString(),
      };
      all.push(newP);
      saveAll(all);
    }
    refresh();
    setOpenForm(false);
    setEditing(null);
  }

  function remove(id) {
    if (!confirm("Delete this product?")) return;
    const all = loadAll().filter((p) => p.id !== id);
    saveAll(all);
    refresh();
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent">My Products</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setEditing(null); setOpenForm(true); }}
            className="px-4 py-2 rounded-full bg-agoraPink text-black font-semibold"
          >
            + Add Product
          </button>
          <button
            onClick={() => navigate("/vendor/earnings")}
            className="px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold"
          >
            View Earnings
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="p-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">You don't have any products yet. Add your first product.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
                  <p className="mt-3 font-bold text-agoraTeal">₹{p.price}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setEditing(p); setOpenForm(true); }}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded"
                  >
                    Edit
                  </button>
                  <button onClick={() => remove(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {openForm && (
        <ProductForm
          initial={editing}
          onCancel={() => { setOpenForm(false); setEditing(null); }}
          onSave={upsertProduct}
        />
      )}
    </main>
  );
}

/* ProductForm component */
function ProductForm({ initial = null, onCancel, onSave }) {
  const [form, setForm] = useState({
    id: initial?.id || null,
    name: initial?.name || "",
    price: initial?.price || "",
    desc: initial?.desc || "",
  });

  function submit(e) {
    e.preventDefault();
    if (!form.name) return alert("Please give a name");
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onCancel} className="absolute inset-0 bg-black/40" />
      <form onSubmit={submit} className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-4">{form.id ? "Edit Product" : "Add Product"}</h3>

        <label className="block mb-2 text-sm">Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 mb-3" />

        <label className="block mb-2 text-sm">Price (₹)</label>
        <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 mb-3" />

        <label className="block mb-2 text-sm">Short Description</label>
        <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 mb-4" rows={3} />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-agoraTeal text-black font-semibold">{form.id ? "Save" : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
    