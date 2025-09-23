import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import ApplyDelivery from "./pages/ApplyDelivery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import FAQ from "./pages/FAQ";
import Kitchen from "./pages/kitchen";
import { CartProvider } from "./utils/CartContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import MyProducts from "./pages/vendor/MyProducts";
import VendorEarnings from "./pages/vendor/Earnings";
import VendorOrders from "./pages/vendor/Orders";
import { AuthProvider, useAuth } from "./utils/auth";
import Header from "./components/Header";
import Account from "./pages/Account"; 
import Earnings from "./pages/delivery/Earnings";
import { DeliveryProvider } from "./utils/DeliveryContext";
import AvailableTasks from "./pages/delivery/AvailableTasks";
import OngoingDeliveries from "./pages/delivery/OngoingDeliveries";
import CompletedDeliveries from "./pages/delivery/CompletedDeliveries";
import TrackOrder from "./pages/TrackOrder";
import { ParallaxProvider } from "react-scroll-parallax";

// ✅ Import the new dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import ProductVendorDashboard from "./pages/vendor/ProductVendorDashboard";
import ServiceVendorDashboard from "./pages/vendor/ServiceVendorDashboard";

// Simple protected route logic
function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

// ✅ Handles vendor redirection (product vs service dashboards)
function VendorDashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/login" replace />;

  if (user.role === "vendor") {
    // Check vendor type
    if (user.vendorType === "product") {
      return <ProductVendorDashboard />;
    }
    if (user.vendorType === "service") {
      return <ServiceVendorDashboard />;
    }
    // Default vendor dashboard (if no type set)
    return <ProductVendorDashboard />;
  }

  // If not vendor → push back home
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
      <ParallaxProvider>
        <CartProvider>
          <DeliveryProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Landing />} />

                  <Route path="/auth/:mode" element={<AuthPage />} />
                  <Route path="/apply/delivery" element={<ApplyDelivery />} />

                  {/* Public pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/kitchen/:id" element={<Kitchen />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />

                  {/* Customer routes */}
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute role="customer">
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/track-order"
                    element={
                      <ProtectedRoute role= "customer">
                        <TrackOrder />
                      </ProtectedRoute>
                    }
                  />

                  {/* Customer Dashboard */}
                  <Route
                    path="/customer/dashboard"
                    element={
                      <ProtectedRoute role="customer">
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Vendor routes */}
                  <Route
                    path="/vendor/dashboard"
                    element={
                      <ProtectedRoute role="vendor">
                        <VendorDashboardRouter />   {/* This auto-decides product vs service */}
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendor/products"
                    element={
                      <ProtectedRoute role="vendor">
                        <MyProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendor/earnings"
                    element={
                      <ProtectedRoute role="vendor">
                        <VendorEarnings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendor/orders"
                    element={
                      <ProtectedRoute role="vendor">
                        <VendorOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/delivery/dashboard"
                    element={
                      <ProtectedRoute role="delivery">
                        <DeliveryDashboard />
                      </ProtectedRoute>
                    }
                  />
                   
                  <Route
                    path="/delivery/tasks"
                    element={
                      <ProtectedRoute role="delivery">
                        <AvailableTasks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/delivery/ongoing"
                    element={
                      <ProtectedRoute role="delivery">
                        <OngoingDeliveries />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/delivery/completed"
                    element={
                      <ProtectedRoute role="delivery">
                        <CompletedDeliveries />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/delivery/earnings"
                    element={
                      <ProtectedRoute role="delivery">
                        <Earnings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute role="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </DeliveryProvider>
        </CartProvider>
      </ParallaxProvider>
  );
}
