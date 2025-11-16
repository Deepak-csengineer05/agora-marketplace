// src/components/AuthForm.jsx - UPDATED VERSION
import React, { useState } from "react";
import { motion ,AnimatePresence} from "framer-motion";
import { useAuth } from "../utils/auth";
import { FaGoogle, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { authService } from "../services/authService";

export default function AuthForm({ mode = "login" }) {
  return mode === "signup" ? <SignupWizard /> : <LoginForm />;
}

/* ---------------- LOGIN FORM ---------------- */
function LoginForm() {
  const { login, loginWithOTP, verifyOTP, loginWithGoogleMock } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [uiMsg, setUiMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleRole, setGoogleRole] = useState("customer");
  const [googleVendorType, setGoogleVendorType] = useState("product");

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
    setLoading(true);
    try {
      const code = await loginWithOTP({ phone });
      setUiMsg(`OTP sent! Check your phone. Demo OTP: ${code}`);
      setOtpSent(true);
    } catch (err) {
      setUiMsg(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function doVerifyOtp() {
    setLoading(true);
    try {
      await verifyOTP({ 
        phone, 
        code: otpValue,
        role: "customer"
      });
    } catch (err) {
      setUiMsg(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function doGoogleMock(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithGoogleMock({
        email: googleEmail || "user@google.test",
        chosenRole: googleRole,
        vendorType: googleRole === "vendor" ? googleVendorType : undefined,
      });
    } catch (err) {
      setUiMsg(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  // Forgot password states & handler (local UI)
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  async function sendPasswordReset() {
    if (!resetEmail) return setResetMsg('Enter your email');
    setResetLoading(true);
    setResetMsg('');
    try {
      // Try backend endpoint - may be a no-op if backend not implemented
      if (authService && authService.resetPassword) {
        await authService.resetPassword({ email: resetEmail });
        setResetMsg('If the email exists, a reset link has been sent.');
      } else {
        setResetMsg('Password reset is not configured on the backend.');
      }
    } catch (err) {
      setResetMsg(err?.message || 'Failed to request password reset');
    } finally {
      setResetLoading(false);
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            placeholder="you@domain.com"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Password</label>
          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 pr-10 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              placeholder="••••••••"
              minLength="6"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Must contain uppercase, lowercase, and number</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold shadow disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {uiMsg && <p className="text-sm text-red-500">{uiMsg}</p>}

        {/* Forgot password UI */}
        <ForgotPassword />
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
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              placeholder="Eg:(9876543210)"
              maxLength="10"
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={loading || !phone}
              className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800 disabled:opacity-50"
            >
              Send OTP
            </button>
          </div>
          {otpSent && (
            <div className="mt-3 flex gap-2">
              <input
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="flex-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                placeholder="Enter OTP"
                maxLength="6"
              />
              <button
                type="button"
                onClick={doVerifyOtp}
                disabled={loading || otpValue.length < 4}
                className="px-3 py-2 rounded-md bg-agoraPink text-black disabled:opacity-50"
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
            disabled={loading}
            className="w-full px-3 py-2 rounded-full bg-pink-600 text-white disabled:opacity-50"
          >
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ----------------- Forgot Password UI (Login) ----------------- */
function ForgotPassword() {
  const [showResetLocal, setShowResetLocal] = useState(false);
  const [emailLocal, setEmailLocal] = useState("");
  const [msgLocal, setMsgLocal] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);

  async function send() {
    if (!emailLocal) return setMsgLocal('Enter an email');
    setLoadingLocal(true);
    setMsgLocal('');
    try {
      if (authService && authService.resetPassword) {
        await authService.resetPassword({ email: emailLocal });
        setMsgLocal('If this email exists, a reset link has been sent.');
      } else {
        setMsgLocal('Password reset is not available on the backend.');
      }
    } catch (err) {
      setMsgLocal(err?.message || 'Reset failed');
    } finally {
      setLoadingLocal(false);
    }
  }

  return (
    <div className="mt-3 text-sm">
      <button type="button" className="text-agoraTeal underline" onClick={() => setShowResetLocal((s) => !s)}>
        Forgot password?
      </button>
      {showResetLocal && (
        <div className="mt-2 flex gap-2">
          <input value={emailLocal} onChange={(e) => setEmailLocal(e.target.value)} placeholder="Your email" className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-900 border" />
          <button onClick={send} disabled={loadingLocal} className="px-3 py-2 bg-agoraPink text-black rounded">Send</button>
        </div>
      )}
    {msgLocal && <p className="mt-2 text-xs text-gray-500">{msgLocal}</p>}
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
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-400 dark:hover:bg-teal-400 dark:hover:text-black"
          }`}
        >
          Customer
        </button>
        <button
          onClick={() => setRole("vendor")}
          className={`px-4 py-2 rounded-md ${
            role === "vendor"
              ? "bg-agoraPink text-black font-semibold"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-400 dark:hover:bg-pink-400  dark:hover:text-black"
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
    address: { street: "", city: "", state: "", zipCode: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await signup({ ...form, role: "customer" });
    } catch (err) {
      if (err.errors) {
        const errorMessages = err.errors
          .map((error) => `${error.field}: ${error.message}`)
          .join(", ");
        setMsg(`Validation errors: ${errorMessages}`);
      } else {
        setMsg(err.message || "Signup failed");
      }
      console.error("Signup error details:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 space-x-2 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3 px-0.5 "
          >
            <input
              required
              placeholder="Full Name (min 2 characters)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className=" mt-1 w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 "
              minLength="2"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (e.g., Test123!)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 pr-10 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Must include uppercase, lowercase, number, and special character
            </p>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!form.name || !form.email || !form.password}
              className="w-full px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3 px-0.5"
          >
            <input
              required
              placeholder="Phone number (10 digits, starts with 6-9)"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              className=" mt-1 w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              maxLength="10"
            />
            {/* Address fields */}
            <input
              required
              placeholder="Street"
              value={form.address.street}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, street: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              required
              placeholder="City"
              value={form.address.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, city: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              required
              placeholder="State"
              value={form.address.state}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, state: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              required
              placeholder="Pin Code"
              value={form.address.zipCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, zipCode: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />

            {/* Back + Submit */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 rounded-full bg-gray-300 text-black font-semibold hover:bg-red-400"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-full bg-agoraPink text-black font-semibold disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {msg && (
        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{msg}</p>
      )}
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
    phone: "",
    storeName: "",
    bio: "",
    vendorType: "product",
    address: { street: "", city: "", state: "", zipCode: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const vendorData = { ...form, role: "vendor" };
      await signup(vendorData);
    } catch (err) {
      if (err.errors) {
        const errorMessages = err.errors
          .map((error) => `${error.field}: ${error.message}`)
          .join("\n");
        setMsg(`Validation errors:\n${errorMessages}`);
      } else {
        setMsg(err.message || "Vendor signup failed");
      }
      console.error("Vendor signup error details:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3 px-0.5 "
          >
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              minLength="2"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (e.g., Vendor123!)"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 pr-10 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!form.name || !form.email || !form.password}
              className="w-full px-4 py-2 rounded-full bg-agoraTeal text-black font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3 px-0.5"
          >
            <input
              required
              placeholder="Store Name"
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className=" mt-1 w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              required
              placeholder="Phone number (10 digits)"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              maxLength="10"
            />
            {/* Address fields */}
            <input
              required
              placeholder="Street"
              value={form.address.street}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, street: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              required
              placeholder="City"
              value={form.address.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, city: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              required
              placeholder="State"
              value={form.address.state}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, state: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />
            <input
              required
              placeholder="Pin Code"
              value={form.address.zipCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: { ...form.address, zipCode: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            />

            <textarea
              required
              placeholder="Store Bio / Description"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
              rows="3"
            />
            <select
              value={form.vendorType}
              onChange={(e) => setForm({ ...form, vendorType: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700"
            >
              <option value="product">
                Product Vendor (Food, Crafts, etc.)
              </option>
              <option value="service">
                Service Vendor (Plumber, Electrician, etc.)
              </option>
            </select>

            {/* Back + Submit */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 rounded-full bg-gray-300 text-black font-semibold hover:bg-red-400"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-full bg-agoraPink text-black font-semibold disabled:opacity-50"
              >
                {loading ? "Creating Vendor Account..." : "Create Vendor Account"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {msg && (
        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{msg}</p>
      )}
    </motion.form>
  );
}
