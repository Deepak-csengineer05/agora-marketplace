// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

export default function Landing() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-white dark:bg-black transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold bg-brand-gradient bg-clip-text text-transparent leading-tight">
              AGORA — Discover local handmade & home-cooked foods
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
              Support home-based entrepreneurs near you. Fresh, authentic, and
              delivered fast.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link to="/auth/login" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.img
            src={logo}
            alt="Agora hero"
            className="rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full h-56 sm:h-80 lg:h-[400px] object-contain bg-gray-50 dark:bg-black/50 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 dark:bg-black transition-colors text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-10 bg-brand-gradient bg-clip-text text-transparent">
          How AGORA Works
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Step
            title="Browse"
            desc="Discover authentic home-cooked food and handmade products near you."
          />
          <Step
            title="Order"
            desc="Place secure orders with transparent pricing and trusted vendors."
          />
          <Step
            title="Deliver"
            desc="Get your order quickly via local delivery partners."
          />
        </div>
      </section>

      {/* Who Benefits */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 dark:bg-black transition-colors text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-10 bg-brand-gradient2 bg-clip-text text-transparent">
          Who Benefits from AGORA?
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Benefit
            title="Customers"
            desc="Access fresh, affordable, and authentic goods directly from locals."
          />
          <Benefit
            title="Vendors"
            desc="Grow your business with zero setup costs and weekly payouts."
          />
          <Benefit
            title="Delivery Partners"
            desc="Earn flexibly with tasks close to your home area."
          />
        </div>
      </section>

      {/* Why Join */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 dark:bg-black transition-colors text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-brand-gradient2 bg-clip-text text-transparent">
          Why Join AGORA?
        </h2>
        <p className="max-w-lg sm:max-w-2xl lg:max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-400">
          Unlike traditional marketplaces that charge high commissions and delay
          payments, AGORA puts community first. Vendors keep more of their
          earnings, customers get affordable products, and delivery partners
          enjoy flexible work.
        </p>
      </section>

      {/* What our community says */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-100 dark:bg-black transition-colors text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-10 bg-brand-gradient bg-clip-text text-transparent">
          What our community says
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Testimonial
            quote="Agora helps me order home-cooked meals nearby — better than any restaurant app."
            author="Priya"
            role="Customer"
          />
          <Testimonial
            quote="As a small food business, Agora gave me customers without heavy fees."
            author="Ravi"
            role="Vendor"
          />
          <Testimonial
            quote="I earn extra income by delivering locally. Flexible and reliable payouts."
            author="Amit"
            role="Delivery"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-black transition-colors text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-brand-gradient2 bg-clip-text text-transparent">
          Ready to be part of AGORA?
        </h2>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-400 max-w-md sm:max-w-xl mx-auto">
          Join as a customer or vendor today and start your journey with us.
        </p>
        <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/auth/login" className="w-full sm:w-auto">
            <Button variant="accent" size="md" className="w-full">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Gradient Footer only for Landing page */}
      <Footer />
    </main>
  );
}

/* --------- Reusable components --------- */
function Step({ title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg transition-colors text-center sm:text-left"
    >
      <h4 className="font-bold text-base sm:text-lg text-agoraTeal">{title}</h4>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
        {desc}
      </p>
    </motion.div>
  );
}

function Benefit({ title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg transition-colors text-center sm:text-left"
    >
      <h4 className="font-bold text-base sm:text-lg text-agoraPink">{title}</h4>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
        {desc}
      </p>
    </motion.div>
  );
}

function Testimonial({ quote, author, role }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg transition-colors text-center sm:text-left"
    >
      <p className="italic text-sm sm:text-base text-gray-600 dark:text-gray-400">
        “{quote}”
      </p>
      <p className="mt-3 sm:mt-4 font-semibold text-agoraTeal text-sm sm:text-base">
        {author} ({role})
      </p>
    </motion.div>
  );
}
