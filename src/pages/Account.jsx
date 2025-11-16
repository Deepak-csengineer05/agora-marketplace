// src/pages/Account.jsx
import React, { useState } from "react";
import { useAuth } from "../utils/auth";

export default function Account() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
  const [msg, setMsg] = useState("");

  if (!user) {
    return <div className="p-6 text-center">You must log in to see your account.</div>;
  }

  const handleSave = () => {
    try {
      // Persist addresses into form before saving
      const updated = { ...form, addresses };
      updateUser(updated); // 🔥 persists to localStorage
      setEditing(false);
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>

      {msg && <div className="p-2 bg-green-100 text-green-700 rounded">{msg}</div>}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow space-y-4">
        {/* Common fields */}
        <Field
          label="Full Name"
          value={form.name}
          editing={editing}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Field label="Email" value={form.email} editing={false} /> {/* email locked */}
        <Field
          label="Role"
          value={form.role}
          editing={false}
        />

        {/* Customer-specific */}
        {user.role === "customer" && (
          <>
            <Field
              label="Phone"
              value={form.phone || ""}
              editing={editing}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            {/* Address management */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300">Addresses</label>
              {addresses.length === 0 && <div className="text-sm text-gray-400">No saved addresses</div>}
              <div className="space-y-2 mt-2">
                {addresses.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 text-sm px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 border">{a.street}, {a.city}, {a.state} - {a.zipCode}</div>
                    {editing && (
                      <button onClick={() => setAddresses(addresses.filter((_, idx) => idx !== i))} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
                    )}
                  </div>
                ))}
              </div>
              {editing && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" />
                  <input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" />
                  <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" />
                  <input placeholder="Pin Code" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" />
                  <div className="sm:col-span-2 flex gap-2">
                    <button onClick={() => { setAddresses([...addresses, newAddress]); setNewAddress({ street: '', city: '', state: '', zipCode: '' }); }} className="px-4 py-2 bg-agoraTeal text-black rounded">Add Address</button>
                    <button onClick={() => setNewAddress({ street: '', city: '', state: '', zipCode: '' })} className="px-4 py-2 bg-gray-300 rounded">Clear</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Vendor-specific */}
        {user.role === "vendor" && (
          <>
            <Field
              label="Store Name"
              value={form.storeName || ""}
              editing={editing}
              onChange={(v) => setForm({ ...form, storeName: v })}
            />
            <Field
              label="Bio"
              value={form.bio || ""}
              editing={editing}
              onChange={(v) => setForm({ ...form, bio: v })}
            />
            <Field
              label="Location"
              value={form.location || ""}
              editing={editing}
              onChange={(v) => setForm({ ...form, location: v })}
            />
            {/* Payment methods placeholder */}
            <div className="mt-4">
              <label className="block text-sm text-gray-600 dark:text-gray-300">Saved Payment Methods</label>
              <div className="mt-2 text-sm text-gray-500">No saved cards. (Placeholder UI)</div>
              {editing && <button className="mt-2 px-4 py-2 bg-agoraTeal text-black rounded">Add Card</button>}
            </div>
            <Field
              label="Vendor Type"
              value={form.vendorType || "product"}
              editing={editing}
              type="select"
              options={[
                { value: "product", label: "Product Vendor" },
                { value: "service", label: "Service Vendor" },
              ]}
              onChange={(v) => setForm({ ...form, vendorType: v })}
            />
          </>
        )}
      </div>

      <div className="flex gap-3">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-agoraTeal text-black font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => {
                setForm({ ...user });
                setEditing(false);
              }}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded bg-agoraPink text-white font-semibold"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- FIELD COMPONENT ---------------- */
function Field({ label, value, editing, onChange, type = "text", options = [] }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 dark:text-gray-300">{label}</label>
      {editing && onChange ? (
        type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
        )
      ) : (
        <div className="mt-1 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          {value || <span className="text-gray-400">Not set</span>}
        </div>
      )}
    </div>
  );
}
