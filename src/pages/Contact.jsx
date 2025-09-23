import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStatus("✅ Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    }, 500);
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-5xl font-extrabold mb-4 bg-brand-gradient bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Have questions, feedback, or partnership inquiries? We’d love to hear
          from you. Whether you’re a customer, vendor, or delivery partner —
          Agora is here to help.
        </p>
      </section>

      {/* Contact Details + Form */}
      <section className="grid md:grid-cols-2 gap-12">
        {/* Left: Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <ul className="space-y-4 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="text-agoraTeal mt-1" />
              <span>
                123 Community Street, Local Town, India <br />
                (Global expansion coming soon 🌍)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-agoraTeal" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-agoraTeal" /> support@agora.com
            </li>
            <li className="flex items-center gap-3">
              <Clock className="text-agoraTeal" /> Mon – Sat, 9:00am – 8:00pm
            </li>
          </ul>
          <p className="mt-6 text-gray-500 dark:text-gray-500 text-sm">
            Our support team usually responds within 24 hours.
          </p>
        </div>

        {/* Right: Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>

          <label htmlFor="name" className="sr-only">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-agoraTeal outline-none"
          />

          <label htmlFor="email" className="sr-only">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-agoraTeal outline-none"
          />

          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            required
            placeholder="Message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-agoraTeal outline-none"
          />

          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-agoraTeal text-white font-semibold shadow hover:scale-105 transition"
          >
            Send Message
          </button>

          {status && (
            <p className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2">
              <CheckCircle size={18} /> {status}
            </p>
          )}
        </form>
      </section>

      {/* Map */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Find Us</h2>
        <div className="w-full h-64 rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-700">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3..."
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            className="border-0"
          ></iframe>
        </div>
      </section>

      {/* Quick Help */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Quick Help</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-2">Customer Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Questions about your order? Visit our{" "}
              <a href="/faq" className="underline text-agoraTeal">
                FAQ page
              </a>.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-2">Vendor Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Want to sell on Agora?{" "}
              <a
                href="/auth/register?role=vendor"
                className="underline text-agoraTeal"
              >
                Register here
              </a>.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-2">Delivery Partners</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Interested in joining our fleet? Apply on the{" "}
              <a
                href="/apply/delivery?ref=contact"
                className="underline text-agoraTeal"
              >
                Delivery page
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4 bg-brand-gradient bg-clip-text text-transparent">
          Let’s Build Community Together
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Agora is more than a marketplace — it’s a movement. We’re excited to
          hear from you and work together to create better opportunities for
          everyone.
        </p>
        <div className="mt-6">
          <a
            href="/about"
            className="px-6 py-3 rounded-full bg-agoraPink text-black font-semibold shadow hover:scale-105 transition"
          >
            Learn More About Us
          </a>
        </div>
      </section>
    </main>
  );
}
