// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-20">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-3 sm:mb-4 bg-brand-gradient bg-clip-text text-transparent">
          About Agora
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
          Agora is more than just an app — it’s a community-powered marketplace
          designed to connect customers, local vendors, and delivery partners in
          a seamless, sustainable, and human-first way.
        </p>
      </section>

      {/* Our Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">
            Our Story
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Born out of the vision to support small businesses and empower
            home-based entrepreneurs, Agora started as a simple idea:{" "}
            <span className="font-semibold">
              what if technology could bring communities closer together?
            </span>
            Over time, this idea grew into a platform that helps vendors reach
            customers directly, enables delivery partners to earn flexibly, and
            lets customers enjoy authentic, affordable products right from their
            neighborhoods.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
            Quick Facts
          </h3>
          <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <li>🚀 Founded in 2025</li>
            <li>🌍 Serving local communities across cities</li>
            <li>👩‍🍳 1000+ vendors already onboard</li>
            <li>📦 Thousands of orders delivered</li>
          </ul>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">
            Our Mission
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            We aim to transform the way people shop and sell by blending
            cutting-edge technology with human-centered design. Whether you’re a
            small vendor or a customer, Agora gives you the tools to grow,
            connect, and thrive within your community.
          </p>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">
            Our Values
          </h2>
          <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
            <li>✨ Transparency in every transaction</li>
            <li>🤝 Community-driven innovation</li>
            <li>💡 Empowering small businesses</li>
            <li>🌱 Commitment to sustainability</li>
          </ul>
        </div>
      </section>

      {/* Features / Why Different */}
      <section className="text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-5 sm:mb-6">
          Why Choose Agora?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-base sm:text-lg mb-2 text-agoraTeal">
              For Customers
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Access fresh, authentic, and affordable goods directly from local
              vendors in your area.
            </p>
          </div>
          <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-base sm:text-lg mb-2 text-agoraPink">
              For Vendors
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Start your business without heavy fees. Manage products, track
              sales, and grow with community support.
            </p>
          </div>
          <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-base sm:text-lg mb-2 text-agoraTeal">
              For Delivery Partners
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Earn flexibly by completing tasks close to your home while
              supporting local vendors and customers.
            </p>
          </div>
        </div>
      </section>

      {/* Vision / Team */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">
            Our Vision
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            We envision a future where technology empowers communities instead
            of replacing them. Agora strives to create an ecosystem where trust,
            fairness, and opportunity are available for everyone — from a
            home-based chef to a local delivery partner.
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-5 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
            Our Team
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Behind Agora is a passionate team of technologists, designers, and
            entrepreneurs dedicated to building platforms that put people first.
            Our diverse backgrounds help us design solutions that are inclusive
            and impactful.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-10 sm:py-12 lg:py-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-brand-gradient bg-clip-text text-transparent">
          Be Part of the Change
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-xl sm:max-w-2xl mx-auto">
          Agora isn’t just an app — it’s a movement towards empowering local
          communities. Join us today as a customer, vendor, or delivery partner
          and experience the difference.
        </p>
        <div className="mt-5 sm:mt-6">
          <a
            href="/auth/register"
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-agoraTeal text-black font-semibold shadow hover:scale-105 transition text-sm sm:text-base"
          >
            Join Agora
          </a>
        </div>
      </section>
    </main>
  );
}
