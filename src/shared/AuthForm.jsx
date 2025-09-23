// src/components/AuthForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../utils/auth";
import { FaGoogle, FaPhone } from "react-icons/fa";

/**
 * AuthForm handles login + signup with multi-step wizard for signup
 */
export default function AuthForm({ mode = "login" }) {
  return mode === "signup" ? <SignupWizard /> : <LoginForm />;
}

/* ---------------- LOGIN FORM ---------------- */
function LoginForm() {
  const { login, loginWithOTP, verifyOTP, loginWithGoogleMock } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [uiMsg, setUiMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleRole, setGoogleRole] = useState("customer");
  const [googleVendorType, setGoogleVendorType] = useState("product"); // NEW

  async function doLogin(e) {
    e.preventDefault();
    setUiMsg("");
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setUiMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp() {
    if (!phone) return setUiMsg("Enter phone number");
    try {
      const code = await loginWithOTP({ phone });
      setUiMsg(`OTP (mock): ${code} — enter below`);
      setOtpSent(true);
    } catch (err) {
      setUiMsg(err.message || "Failed to send OTP");
    }
  }

  async function doVerifyOtp() {
    try {
      await verifyOTP({ phone, code: otpValue });
    } catch (err) {
      setUiMsg(err.message || "OTP verification failed");
    }
  }

  async function doGoogleMock(e) {
    e.preventDefault();
    try {
      await loginWithGoogleMock({
        email: googleEmail || "user@google.test",
        chosenRole: googleRole,
        vendorType: googleRole === "vendor" ? googleVendorType : undefined, // NEW
      });
    } catch (err) {
      setUiMsg(err.message || "Google sign-in failed");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Email + Password Login */}
      <motion.form
        onSubmit={doLogin}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            placeholder="you@domain.com"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold shadow"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {uiMsg && <p className="text-sm text-red-500">{uiMsg}</p>}
      </motion.form>

      {/* OTP + Google mock login */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Phone OTP */}
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FaPhone className="text-agoraTeal" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Phone (OTP)</span>
          </div>
          <div className="flex gap-2">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              placeholder="+91 98765 43210"
            />
            <button
              type="button"
              onClick={sendOtp}
              className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800"
            >
              Send OTP
            </button>
          </div>
          {otpSent && (
            <div className="mt-3 flex gap-2">
              <input
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                placeholder="Enter OTP"
              />
              <button
                type="button"
                onClick={doVerifyOtp}
                className="px-3 py-2 rounded-md bg-agoraPink text-black"
              >
                Verify
              </button>
            </div>
          )}
        </div>

        {/* Google mock */}
        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <FaGoogle className="text-pink-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Google Sign-in (mock)</span>
          </div>
          <input
            value={googleEmail}
            onChange={(e) => setGoogleEmail(e.target.value)}
            placeholder="Google email"
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 mb-2"
          />
          <select
            value={googleRole}
            onChange={(e) => setGoogleRole(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 mb-2"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="delivery">Delivery (testing)</option>
            <option value="admin">Admin (testing)</option>
          </select>

          {/* 👇 Extra dropdown if vendor is chosen */}
          {googleRole === "vendor" && (
            <select
              value={googleVendorType}
              onChange={(e) => setGoogleVendorType(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 mb-2"
            >
              <option value="product">Product Vendor (Food, Crafts, etc.)</option>
              <option value="service">Service Vendor (Plumber, Electrician, etc.)</option>
            </select>
          )}

          <button
            onClick={doGoogleMock}
            className="w-full px-3 py-2 rounded-full bg-pink-600 text-white"
          >
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- SIGNUP WIZARD ---------------- */
function SignupWizard() {
  const [role, setRole] = useState("customer");

  return (
    <div>
      {/* Role selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setRole("customer")}
          className={`px-4 py-2 rounded-md ${
            role === "customer"
              ? "bg-agoraTeal text-black font-semibold"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setRole("vendor")}
          className={`px-4 py-2 rounded-md ${
            role === "vendor"
              ? "bg-agoraPink text-black font-semibold"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          Vendor
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
        >
          Delivery (Apply separately)
        </button>
      </div>

      {role === "customer" && <CustomerSignup />}
      {role === "vendor" && <VendorSignup />}
    </div>
  );
}

/* ---------------- CUSTOMER SIGNUP ---------------- */
function CustomerSignup() {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await signup({ ...form, role: "customer" });
    } catch (err) {
      setMsg(err.message || "Signup failed");
    }
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {step === 1 && (
        <>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <input
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <input
            required
            placeholder="Delivery address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-full bg-agoraPink text-black font-semibold"
          >
            Create Account
          </button>
        </>
      )}
      {msg && <p className="text-sm text-red-500">{msg}</p>}
    </motion.form>
  );
}

/* ---------------- VENDOR SIGNUP ---------------- */
function VendorSignup() {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    storeName: "",
    bio: "",
    location: "",
    vendorType: "product", // 👈 default is product
    documents: {},
  });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await signup({ ...form, role: "vendor" });
    } catch (err) {
      setMsg(err.message || "Signup failed");
    }
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {step === 1 && (
        <>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <input
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            required
            placeholder="Store Name"
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <textarea
            required
            placeholder="Store Bio / Description"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <input
            required
            placeholder="Business Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <select
            value={form.vendorType}
            onChange={(e) => setForm({ ...form, vendorType: e.target.value })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          >
            <option value="product">Product Vendor (Food, Crafts, etc.)</option>
            <option value="service">Service Vendor (Plumber, Electrician, etc.)</option>
          </select>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full px-4 py-2 rounded-full bg-agoraPink text-black font-semibold"
          >
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Upload documents (mock)
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setForm({ ...form, documents: e.target.files })}
            className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold"
          >
            Create Vendor Account
          </button>
        </>
      )}
      {msg && <p className="text-sm text-red-500">{msg}</p>}
    </motion.form>
  );
}
