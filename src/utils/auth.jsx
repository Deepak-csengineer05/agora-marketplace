// src/utils/auth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const adminMock = {
  email: "admin@agora.test",
  password: "admin123",
  role: "admin",
  name: "Agora Admin",
};

// 🔥 normalize vendorType (old -> new)
function normalizeVendorType(v) {
  if (!v) return null;
  if (["Food", "Craft", "Other"].includes(v)) return "product"; // old types → product
  if (v === "service") return "service";
  if (v === "product") return "product";
  return v;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Restore session from localStorage
  useEffect(() => {
    const s = localStorage.getItem("agora_user");
    if (s) {
      const parsed = JSON.parse(s);
      parsed.vendorType = normalizeVendorType(parsed.vendorType);
      setUser(parsed);
    }
  }, []);

  function persist(u) {
    const normalized = { ...u, vendorType: normalizeVendorType(u.vendorType) };
    setUser(normalized);
    localStorage.setItem("agora_user", JSON.stringify(normalized));
  }

  /* ---------- SIGNUP ---------- */
  const signup = async ({ email, password, role, name, vendorType = null, ...extra }) => {
    if (!["customer", "vendor"].includes(role)) {
      throw new Error("Role not allowed for public signup");
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // keep password for login (not secure in real life!)
      role,
      name,
      vendorType: normalizeVendorType(vendorType),
      ...extra, // 👈 phone, address, storeName, bio, etc.
    };

    const users = JSON.parse(localStorage.getItem("agora_users") || "[]");

    if (users.find((x) => x.email === email)) {
      throw new Error("Email already registered");
    }

    users.push(newUser);
    localStorage.setItem("agora_users", JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    persist(safeUser);

    const redirect = localStorage.getItem("redirectAfterLogin") || "/shop";
    navigate(redirect, { replace: true });
    localStorage.removeItem("redirectAfterLogin");

    return safeUser;
  };

  /* ---------- LOGIN ---------- */
  const login = async ({ email, password }) => {
    if (email === adminMock.email && password === adminMock.password) {
      persist(adminMock);
      const redirect = localStorage.getItem("redirectAfterLogin") || "/admin/dashboard";
      navigate(redirect, { replace: true });
      localStorage.removeItem("redirectAfterLogin");
      return adminMock;
    }

    const users = JSON.parse(localStorage.getItem("agora_users") || "[]");
    const u = users.find((x) => x.email === email && x.password === password);

    if (!u) throw new Error("Invalid credentials");

    const { password: _, ...safeUser } = u;
    safeUser.vendorType = normalizeVendorType(safeUser.vendorType);

    persist(safeUser);

    const redirect = localStorage.getItem("redirectAfterLogin") || "/shop";
    navigate(redirect, { replace: true });
    localStorage.removeItem("redirectAfterLogin");

    return safeUser;
  };

  /* ---------- GOOGLE MOCK LOGIN ---------- */
  const loginWithGoogleMock = async ({ email, chosenRole, vendorType = null }) => {
    const u = {
      email,
      role: chosenRole,
      name: email.split("@")[0],
      vendorType: normalizeVendorType(vendorType),
    };

    const users = JSON.parse(localStorage.getItem("agora_users") || "[]");
    if (!users.find((x) => x.email === email)) {
      users.push({ ...u, password: null });
      localStorage.setItem("agora_users", JSON.stringify(users));
    }

    persist(u);

    const redirect = localStorage.getItem("redirectAfterLogin") || "/shop";
    navigate(redirect, { replace: true });
    localStorage.removeItem("redirectAfterLogin");

    return u;
  };

  /* ---------- PHONE OTP MOCK ---------- */
  const loginWithOTP = async ({ phone }) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem("agora_otp", JSON.stringify({ phone, code }));
    return code;
  };

  const verifyOTP = async ({ phone, code, role = "customer", vendorType = null }) => {
    const stored = JSON.parse(sessionStorage.getItem("agora_otp") || null);
    if (!stored || stored.phone !== phone || stored.code !== code) {
      throw new Error("Invalid OTP");
    }

    const users = JSON.parse(localStorage.getItem("agora_users") || "[]");
    let u = users.find((x) => x.email === phone + "@phone.agora");

    if (!u) {
      u = {
        email: phone + "@phone.agora",
        role,
        name: "PhoneUser",
        vendorType: normalizeVendorType(vendorType),
      };
      users.push({ ...u, password: null });
      localStorage.setItem("agora_users", JSON.stringify(users));
    }

    const { password: _, ...safeUser } = u;
    persist(safeUser);

    const redirect = localStorage.getItem("redirectAfterLogin") || "/shop";
    navigate(redirect, { replace: true });
    localStorage.removeItem("redirectAfterLogin");

    return safeUser;
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("agora_user");
    window.location.href = "/";
  };
  function updateUser(updated) {
    const safe = { ...user, ...updated, vendorType: normalizeVendorType(updated.vendorType) };
    setUser(safe);
    localStorage.setItem("agora_user", JSON.stringify(safe));

    // also update in agora_users list
    const users = JSON.parse(localStorage.getItem("agora_users") || "[]");
    const idx = users.findIndex((u) => u.email === safe.email);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...safe };
      localStorage.setItem("agora_users", JSON.stringify(users));
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        loginWithGoogleMock,
        loginWithOTP,
        verifyOTP,
        updateUser, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
