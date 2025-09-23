import React, { useState } from "react";
import { motion } from "framer-motion";
import AuthForm from "../shared/AuthForm";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl rounded-3xl p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold bg-brand-gradient bg-clip-text text-transparent">
              {mode === "login" ? "Welcome back to AGORA" : "Join AGORA Today"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {mode === "login"
                ? "Sign in to your account to continue"
                : "Create a new account and start your journey"}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode("login")}
              className={`px-4 py-2 rounded-md ${
                mode === "login"
                  ? "bg-agoraTeal text-black font-semibold"
                  : "bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`px-4 py-2 rounded-md ${
                mode === "signup"
                  ? "bg-agoraPink text-black font-semibold"
                  : "bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* AuthForm */}
        <div>
          <AuthForm mode={mode} />
        </div>

        {/* Delivery & Admin info */}
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          <span>Want to be a delivery partner? </span>
          <a
            href="/apply/delivery"
            className="text-agoraTeal underline hover:text-agoraPink transition"
          >
            Apply here
          </a>
          <span>. Admin accounts cannot be created publicly.</span>
        </div>
      </motion.div>
    </main>
  );
}
