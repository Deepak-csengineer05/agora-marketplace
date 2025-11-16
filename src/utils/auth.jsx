// src/utils/auth.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing authentication on app start
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = authService.getStoredUser();
        if (userData) {
          setUser(userData);
        } else {
          // Try to get fresh user data from backend
          const response = await authService.getCurrentUser();
          if (response.success) {
            const normalizedUser = normalizeUserData(response.data);
            setUser(normalizedUser);
            localStorage.setItem("agora_user", JSON.stringify(normalizedUser));
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid authentication
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  // 🔥 normalize vendorType (old -> new)
  function normalizeVendorType(v) {
    if (!v) return null;
    if (["Food", "Craft", "Other"].includes(v)) return "product";
    if (v === "service") return "service";
    if (v === "product") return "product";
    return v;
  }

  // Normalize user data from backend
  function normalizeUserData(userData) {
    return {
      ...userData,
      vendorType: normalizeVendorType(userData.vendorType),
      id: userData._id || userData.id
    };
  }

  function persist(userData) {
    const normalized = normalizeUserData(userData);
    setUser(normalized);
    localStorage.setItem("agora_user", JSON.stringify(normalized));
  }

  /* ---------- SIGNUP (Backend API) ---------- */
  const signup = async (userData) => {
    try {
      setLoading(true);
      
      // Transform frontend data to backend format
      const backendUserData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role,
        ...(userData.role === 'vendor' && {
          vendorType: userData.vendorType,
          storeName: userData.storeName,
          bio: userData.bio,
          address: userData.address
        }),
        ...(userData.role === 'customer' && {
          vendorType: userData.vendorType,
          address: userData.address
        })
      };

      const response = await authService.register(backendUserData);
      
      if (response.success) {
        const normalizedUser = normalizeUserData(response.data);
        persist(normalizedUser);

        const redirect = localStorage.getItem("redirectAfterLogin") || 
                        (userData.role === 'vendor' ? '/vendor/dashboard' : '/shop');
        navigate(redirect, { replace: true });
        localStorage.removeItem("redirectAfterLogin");

        return normalizedUser;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      // Fallback to localStorage mock if backend fails
      if (!navigator.onLine) {
        return await mockSignup(userData);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- LOGIN (Backend API) ---------- */
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      const response = await authService.login(credentials);
      
      if (response.success) {
        const normalizedUser = normalizeUserData(response.data);
        persist(normalizedUser);

        const redirect = localStorage.getItem("redirectAfterLogin") || 
                        getDefaultRedirect(normalizedUser.role);
        navigate(redirect, { replace: true });
        localStorage.removeItem("redirectAfterLogin");

        return normalizedUser;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to localStorage mock if backend fails
      if (!navigator.onLine) {
        return await mockLogin(credentials);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OTP LOGIN (Backend API) ---------- */
  const loginWithOTP = async (phoneData) => {
    try {
      const response = await authService.otpLogin(phoneData);
      return response.data?.otp; // Return OTP for demo (remove in production)
    } catch (error) {
      console.error('OTP login error:', error);
      
      // Fallback to mock
      if (!navigator.onLine) {
        return await mockLoginWithOTP(phoneData);
      }
      
      throw error;
    }
  };

  const verifyOTP = async (otpData) => {
    try {
      const response = await authService.verifyOTP(otpData);
      
      if (response.success) {
        const normalizedUser = normalizeUserData(response.data);
        persist(normalizedUser);

        const redirect = localStorage.getItem("redirectAfterLogin") || 
                        getDefaultRedirect(normalizedUser.role);
        navigate(redirect, { replace: true });
        localStorage.removeItem("redirectAfterLogin");

        return normalizedUser;
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Fallback to mock
      if (!navigator.onLine) {
        return await mockVerifyOTP(otpData);
      }
      
      throw error;
    }
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    setUser(null);
    authService.logout();
    localStorage.removeItem("agora_user");
    localStorage.removeItem("redirectAfterLogin");
    navigate("/");
  };

  /* ---------- UPDATE USER PROFILE ---------- */
  const updateUser = async (updatedData) => {
    try {
      const response = await authService.updateProfile(updatedData);
      
      if (response.success) {
        const normalizedUser = normalizeUserData(response.data);
        persist(normalizedUser);
        return normalizedUser;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Fallback to local update if backend fails
      const updatedUser = { ...user, ...updatedData };
      persist(updatedUser);
      return updatedUser;
    }
  };

  // Helper function to get default redirect based on role
  const getDefaultRedirect = (role) => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'vendor': return '/vendor/dashboard';
      case 'delivery': return '/delivery/dashboard';
      default: return '/shop';
    }
  };

  // ========== MOCK FALLBACK FUNCTIONS (for offline/backend failure) ==========
  
  const mockSignup = async (userData) => {
    // Your existing mock signup logic
    if (!["customer", "vendor"].includes(userData.role)) {
      throw new Error("Role not allowed for public signup");
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      vendorType: normalizeVendorType(userData.vendorType),
    };

    const users = JSON.parse(localStorage.getItem("agora_users") || "[]");

    if (users.find((x) => x.email === userData.email)) {
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

  const mockLogin = async (credentials) => {
    // Your existing mock login logic
    const users = JSON.parse(localStorage.getItem("agora_users") || "[]");
    const u = users.find((x) => x.email === credentials.email && x.password === credentials.password);

    if (!u) throw new Error("Invalid credentials");

    const { password: _, ...safeUser } = u;
    safeUser.vendorType = normalizeVendorType(safeUser.vendorType);

    persist(safeUser);

    const redirect = localStorage.getItem("redirectAfterLogin") || "/shop";
    navigate(redirect, { replace: true });
    localStorage.removeItem("redirectAfterLogin");

    return safeUser;
  };

  const mockLoginWithOTP = async ({ phone }) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem("agora_otp", JSON.stringify({ phone, code }));
    return code;
  };

  const mockVerifyOTP = async ({ phone, code, role = "customer", vendorType = null }) => {
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

  // Keep your existing Google mock login
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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