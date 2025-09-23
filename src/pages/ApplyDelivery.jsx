import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ApplyDelivery() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    license: "",
    vehicle: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function submit(e) {
    e.preventDefault();
    const queue = JSON.parse(
      localStorage.getItem("agora_delivery_applications") || "[]"
    );
    queue.push({ ...form, id: Date.now().toString(), status: "pending" });
    localStorage.setItem("agora_delivery_applications", JSON.stringify(queue));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg transition-colors"
        >
          <h3 className="text-2xl font-bold text-agoraTeal">
            Application submitted
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Thanks! Admin will review your delivery partner application. We'll
            contact you via phone/email.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={submit}
        className="max-w-3xl w-full p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg transition-colors"
      >
        <h3 className="text-2xl font-extrabold bg-brand-gradient bg-clip-text text-transparent">
          Apply as a Delivery Partner
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Fill the form and we'll review your application.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Full name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />

          <label className="text-sm text-gray-700 dark:text-gray-300">
            Phone
          </label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />

          <label className="text-sm text-gray-700 dark:text-gray-300">
            Driver's license / ID
          </label>
          <input
            required
            value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />

          <label className="text-sm text-gray-700 dark:text-gray-300">
            Vehicle details
          </label>
          <input
            required
            value={form.vehicle}
            onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />

          <div className="mt-4">
            <button className="px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold">
              Submit application
            </button>
          </div>
        </div>
      </motion.form>
    </main>
  );
}
