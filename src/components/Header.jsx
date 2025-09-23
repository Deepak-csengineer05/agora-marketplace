import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { useCart } from "../utils/CartContext";
import logo from "../assets/logo.png";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-agoraPink font-semibold border-b-2 border-agoraPink pb-1"
      : "text-gray-700 dark:text-gray-300 hover:text-agoraTeal dark:hover:text-agoraTeal";

  return (
    <header className=" py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-colors shadow-lg shadow-pink-200/20 dark:shadow-agoraTeal/20">
      <div className=" max-w-7xl mx-auto px-4 flex items-center justify-between gap-6">
        {/* Left: Logo + Location */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
            title="Go to Agora home"
          >
            <img src={logo} alt="Agora logo" className="w-11 h-11 rounded-full shadow" />
            <div>
              <div className="font-extrabold text-lg bg-brand-gradient bg-clip-text text-transparent">
                AGORA
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Hyper-local marketplace
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <LocationSelector />
          </div>
        </div>

        {/* Middle nav (only for guests) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          {!user && (
            <nav className="flex items-center gap-6 text-sm">
              <NavLink to="/shop" className={navLinkClass}>Browse</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
              <NavLink to="/faq" className={navLinkClass}>FAQ</NavLink>
            </nav>
          )}
        </div>

        {/* Right controls (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <DesktopControls
            user={user}
            cart={cart}
            logout={logout}
            navLinkClass={navLinkClass}
            navigate={navigate}
            toggleTheme={toggleTheme}
            isDark={isDark}
          />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden px-3 py-2 rounded bg-gray-100 dark:bg-gray-800"
          onClick={() => setMobileOpen(true)}
        >
          ☰
        </button>
      </div>
      {/* Mobile Drawer */}
      <div
        className={`
          fixed top-14 right-0  // ⬅ start below floating header
          w-80 h-[calc(100%-3.5rem)] // ⬅ full height minus header height
          bg-white dark:bg-gray-900 shadow-lg z-40 
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="text-xl">✖</button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto">
          <LocationSelector inMobile />
          {!user && (
            <nav className="flex flex-col gap-3 text-sm">
              <NavLink to="/shop" className={navLinkClass} onClick={() => setMobileOpen(false)}>Browse</NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileOpen(false)}>Contact</NavLink>
              <NavLink to="/faq" className={navLinkClass} onClick={() => setMobileOpen(false)}>FAQ</NavLink>
            </nav>
          )}
          <MobileControls
            user={user}
            cart={cart}
            logout={logout}
            navLinkClass={navLinkClass}
            navigate={navigate}
            toggleTheme={toggleTheme}
            isDark={isDark}
            closeDrawer={() => setMobileOpen(false)}
          />
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed top-14 inset-x-0 bottom-0 bg-black/40 z-30"
        />
      )}
    </header>
  );
}

/* Desktop controls (unchanged content) */
function DesktopControls({ user, cart, logout, navLinkClass, navigate, toggleTheme, isDark }) {
  return (
    <>
      {user ? (
        <>
          {user.role === "customer" && (
            <>
              <ForYouDropdown />
              <NotificationBell role="customer" />
              <NavLink to="/cart" className="relative hover:scale-150 transition">
                <span className="text-gray-700 dark:text-gray-300 hover:text-agoraTeal">🛒</span>
                {cart?.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-agoraPink text-white text-xs px-2 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </NavLink>
              <NavLink to="/orders" className={navLinkClass } >My Orders</NavLink>
              <button
                onClick={() => navigate("/shop")}
                className="ml-2 px-4 py-2 bg-agoraTeal text-black font-semibold rounded-full hover:scale-105 transition"
                title="Order Food / Book Services"
              >
                🍴 Order Food / 🔧 Book Services
              </button>
            </>
          )}
          {user.role === "vendor" && (
            <>
              {user.vendorType === "product" ? (
                <>
                  <NavLink to="/vendor/orders" className={navLinkClass}>My Orders</NavLink>
                  <NavLink to="/vendor/products" className={navLinkClass}>My Menu</NavLink>
                </>
              ) : (
                <NavLink to="/vendor/services" className={navLinkClass}>My Services</NavLink>
              )}
              <NavLink to="/vendor/earnings" className={navLinkClass}>Earnings</NavLink>
              <NotificationBell role="vendor" categories={["New Orders", "Questions", "Payouts"]} />
              <QuickActions role="vendor" vendorType={user.vendorType} />
            </>
          )}
          {user.role === "delivery" && (
            <>
              <NavLink to="/delivery/tasks" className={navLinkClass}>Tasks</NavLink>
              <NavLink to="/delivery/ongoing" className={navLinkClass}>Ongoing</NavLink>
              <NavLink to="/delivery/completed" className={navLinkClass}>Completed</NavLink>
              <NavLink to="/delivery/earnings" className={navLinkClass}>Earnings</NavLink>
              <EarningsCounter />
              <NotificationBell role="delivery" categories={["New Tasks", "Confirmations"]} />
              <StatusToggle />
            </>
          )}
          {user.role === "admin" && (
            <>
              <NavLink to="/admin/dashboard" className={navLinkClass}>Analytics</NavLink>
              <NotificationBell role="admin" categories={["Disputes", "Security", "System"]} />
              <button
                onClick={() => alert("Emergency stop (mock).")}
                className="px-3 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-500 transition"
              >
                🛑 Emergency Stop
              </button>
            </>
          )}
          {user && <ProfileDropdown user={user} logout={logout} />}
        </>
      ) : (
        <>
          <NavLink to="/auth/login" className={navLinkClass}>Login / Signup</NavLink>
          <NavLink
            to="/apply/delivery"
            className="px-3 py-2 rounded bg-agoraPink/20 hover:bg-agoraPink/40 transition text-sm"
          >
            Apply as Delivery
          </NavLink>
        </>
      )}
      <button
        onClick={toggleTheme}
        className="ml-2 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
        title="Toggle theme"
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </>
  );
}

/* ---------------------------
   Mobile controls: stacked layout with buttons
--------------------------- */
function MobileControls({ user, cart, logout, navLinkClass, navigate, toggleTheme, isDark, closeDrawer }) {
  return (
    <div className="space-y-4">
      {user && <ProfileDropdown user={user} logout={logout} />}
      {user ? (
        <>
          {user.role === "customer" && (
            <div className="flex flex-col gap-3">
              <ForYouDropdown />
              <NotificationBell role="customer" />
              <NavLink to="/cart" className={navLinkClass} onClick={closeDrawer}>
                Cart ({cart?.length || 0})
              </NavLink>
              <NavLink to="/orders" className={navLinkClass} onClick={closeDrawer}>
                My Orders
              </NavLink>
              <button
                onClick={() => { navigate("/shop"); closeDrawer(); }}
                className="w-full px-4 py-2 bg-agoraTeal text-black font-semibold rounded-full"
              >
                🍴 Order Food / 🔧 Book Services
              </button>
            </div>
          )}
          {user.role === "vendor" && (
          <div className="space-y-3">
              <div className="flex flex-col gap-3 text-lg">
                {user.vendorType === "product" ? (
                  <>
                    <NavLink to="/vendor/orders" className={navLinkClass} onClick={closeDrawer}>
                      My Orders
                    </NavLink>
                    <NavLink to="/vendor/products" className={navLinkClass} onClick={closeDrawer}>
                      My Menu
                    </NavLink>
                  </>
                ) : (
                  <NavLink to="/vendor/services" className={navLinkClass} onClick={closeDrawer}>
                    My Services
                  </NavLink>
                )}
                <NavLink to="/vendor/earnings" className={navLinkClass} onClick={closeDrawer}>
                  Earnings
                </NavLink>
              </div>

              {/* Notifications & Quick Actions in one aligned block */}
              <div className="flex flex-col gap-2">
                <NotificationBell role="vendor" categories={["New Orders", "Questions", "Payouts"]} />
                <QuickActions role="vendor" vendorType={user.vendorType} />
              </div>
          </div>
          )}
          {user.role === "delivery" && (
            <div className="flex flex-col gap-3"> 
              <NavLink to="/delivery/tasks" className={navLinkClass} onClick={closeDrawer}>Available</NavLink>
              <NavLink to="/delivery/ongoing" className={navLinkClass} onClick={closeDrawer}>Ongoing</NavLink>
              <NavLink to="/delivery/completed" className={navLinkClass} onClick={closeDrawer}>Completed</NavLink>
              <NavLink to="/delivery/earnings" className={navLinkClass} onClick={closeDrawer}>Earnings</NavLink>
              <EarningsCounter />
              <NotificationBell role="delivery" categories={["New Tasks", "Confirmations"]} />
              <StatusToggle />
            </div>
          )}
          {user.role === "admin" && (
            <>
              <NavLink to="/admin/dashboard" className={navLinkClass} onClick={closeDrawer}>Analytics</NavLink>
              <NotificationBell role="admin" categories={["Disputes", "Security", "System"]} />
              <button
                onClick={() => alert("Emergency stop (mock).")}
                className="w-full px-3 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-500 transition"
              >
                🛑 Emergency Stop
              </button>
            </>
          )}
         
        </>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Login button */}
          <NavLink
            to="/auth/login"
            onClick={closeDrawer}
            className="w-full px-4 py-2 rounded-full bg-agoraPink text-white text-center font-semibold hover:bg-agoraPink/80 transition"
          >
            Login / Signup
          </NavLink>

          {/* Apply as Delivery button */}
          <NavLink
            to="/apply/delivery"
            onClick={closeDrawer}
            className="w-full px-4 py-2 rounded-full bg-agoraTeal text-black text-center font-semibold hover:bg-agoraTeal/80 transition"
          >
            Apply as Delivery
          </NavLink>
        </div>
      )}

      {/* Theme Toggle always at bottom */}
      <button
        onClick={toggleTheme}
        className="w-full px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition text-center"
      >
        {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
}

/* --------------------------- 
   Location Selector
--------------------------- */
function LocationSelector({ inMobile = false }) {
  const [open, setOpen] = useState(false);
  const [loc, setLoc] = useState(localStorage.getItem("agora_location") || "Set location");
  const ref = useRef();

  useEffect(() => {
    function onClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const options = ["Ottakkalmandapam", "Coimbatore", "Chennai", "Bengaluru", "Detect my location"];

  async function reverseGeocode(lat, lon) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.display_name.split(",")[0] ||
        `Lat:${lat},Lon:${lon}`
      );
    } catch {
      return `Lat:${lat},Lon:${lon}`;
    }
  }

  function selectLocation(v) {
    if (v === "Detect my location") {
      if (!navigator.geolocation) {
        alert("Geolocation not supported in your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude.toFixed(3);
          const lon = pos.coords.longitude.toFixed(3);
          const name = await reverseGeocode(lat, lon);
          localStorage.setItem("agora_location", name);
          setLoc(name);
          setOpen(false);
        },
        () => alert("Could not detect location.")
      );
    } else {
      localStorage.setItem("agora_location", v);
      setLoc(v);
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 flex items-center justify-between"
        title="Select location"
      >
        📍 {loc}
      </button>

      {open && (
        <div
          className={`
            ${inMobile ? "absolute left-0 right-0 mt-2" : "fixed md:absolute top-0 right-0 md:top-auto md:right-auto md:mt-2"}
            bg-white dark:bg-gray-900 border md:border-gray-200 dark:md:border-gray-700
            rounded-lg shadow-lg z-50
            ${inMobile ? "" : "w-80 md:w-56 h-full md:h-auto"}
          `}
        >
          <div className="p-3">
            <h4 className="font-semibold mb-2">Choose location</h4>
            <div className="space-y-1">
              {options.map((o) => (
                <button
                  key={o}
                  onClick={() => selectLocation(o)}
                  className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   NotificationBell
   --------------------------- */
function NotificationBell({ role = "customer", categories = null }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("agora_notifs") || "{}");
      return saved[role] || [];
    } catch {
      return [];
    }
  });
  const ref = useRef();

  useEffect(() => {
    function clicker(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", clicker);
    return () => document.removeEventListener("click", clicker);
  }, []);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("agora_notifs") || "{}");
    all[role] = notifications;
    localStorage.setItem("agora_notifs", JSON.stringify(all));
  }, [notifications, role]);

  const unread = notifications.filter((n) => n.unread).length;
  const cats = categories || ["Orders", "Promos", "Info"];

  function markRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative px-3 py-2 rounded bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
        title="Notifications"
      >
        🔔
        {unread > 0 && <span className="absolute -top-2 -right-2 bg-agoraPink text-white text-xs px-2 py-0.5 rounded-full">{unread}</span>}
      </button>
      {open && (
        <div
          className={`
            fixed md:absolute top-0 right-0 md:top-auto md:right-auto md:mt-2
            w-80 h-full md:h-auto
            bg-white dark:bg-gray-900 border md:border-gray-200 dark:md:border-gray-700
            rounded-none md:rounded-lg shadow-lg z-50
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "translate-x-full"}
            md:translate-x-0
          `}
        >
          <div className="p-3">
            <h4 className="font-semibold mb-2">Notifications</h4>
            <div className="space-y-2 max-h-64 overflow-auto">
              {notifications.map((n) => (
                <div key={n.id} className={`p-2 rounded ${n.unread ? "bg-gray-100 dark:bg-gray-800" : ""}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-gray-500">{n.type}</div>
                    </div>
                    {n.unread && <button onClick={() => markRead(n.id)} className="text-xs text-agoraTeal">Mark read</button>}
                  </div>
                </div>
              ))}
              {notifications.length === 0 && <p className="text-xs text-gray-500">No notifications</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   ForYouDropdown (customer recs)
   --------------------------- */
function ForYouDropdown() {
  const [open, setOpen] = useState(false);
  const [recs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("agora_recs")) || [
        { id: "r1", label: "Priya's Biryani — 15% off" },
        { id: "r2", label: "Handmade Sweets nearby" },
      ];
    } catch {
      return [];
    }
  });
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="relative hover:scale-105 transition" ref={ref}>
      <button onClick={() => setOpen((s) => !s)} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-900">⭐ For You</button>
      {open && (
        <div
          className={`
            fixed md:absolute top-0 right-0 md:top-auto md:right-auto md:mt-2
            w-80 md:w-64 h-full md:h-auto
            bg-white dark:bg-gray-900 border md:border-gray-200 dark:md:border-gray-700
            rounded-none md:rounded-lg shadow-lg z-50
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "translate-x-full"}
            md:translate-x-0
          `}
        >
          <div className="p-3">
            <h4 className="font-semibold mb-2">Recommended for you</h4>
            <div className="space-y-2">
              {recs.map((r) => (
                <button key={r.id} onClick={() => navigate("/shop")} className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  {r.label}
                </button>
              ))}
              {recs.length === 0 && <p className="text-xs text-gray-500">No recommendations yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   QuickActions (vendor actions)
   --------------------------- */
function QuickActions({ role, vendorType }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  useEffect(() => {
    const onClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  let actions = [];
  if (role === "vendor") {
    if (vendorType === "product") {
      actions = [
        { id: "a1", label: "Add Dish", to: "/vendor/menu/new" },
        { id: "a2", label: "Manage Menu", to: "/vendor/menu" },
        { id: "a3", label: "Go Live", to: "/vendor/live" },
      ];
    } else if (vendorType === "service") {
      actions = [
        { id: "a1", label: "Add Service", to: "/vendor/services/new" },
        { id: "a2", label: "Manage Services", to: "/vendor/services" },
        { id: "a3", label: "Go Live", to: "/vendor/live" },
      ];
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="px-3 py-2 rounded-full bg-agoraPink text-white font-bold hover:scale-105 transition"
      >
       Quick Actions
      </button>
      {open && (
        <div
          className={`
            fixed md:absolute bottom-0 md:top-auto md:right-0 md:mt-2
            w-full md:w-48 h-1/2 md:h-auto
            bg-white dark:bg-gray-900 border md:border-gray-200 dark:md:border-gray-700
            rounded-t-lg md:rounded-lg shadow-lg z-50
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-y-0" : "translate-y-full"}
            md:translate-y-0
          `}
        >
          <div className="p-2">
            {actions.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  navigate(a.to);
                  setOpen(false);
                }}
                className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
/* ---------------------------
   ProfileDropdown
   --------------------------- */
function ProfileDropdown({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // ✅ Match roles to your App.jsx routes
  const getDashboardRoute = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "customer":
        return "/customer/dashboard";
      case "delivery":
        return "/delivery/dashboard";
      case "vendor":
        return "/vendor/dashboard"; // 🚀 this uses VendorDashboardRouter inside App.jsx
      default:
        return "/";
    }
  };

  const items = [
    { id: "p0", label: "My Dashboard", to: getDashboardRoute() },
    { id: "p1", label: "My Account", to: "/account" },
    { id: "p2", label: "Settings", to: "/settings" },
    { id: "p3", label: "Help", to: "/help" },
    { id: "p4", label: "Logout", action: logout },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-900 font-semibold hover:scale-105 transition"
      >
        {user?.name || "Login in to access these"}
      </button>
      {open && (
        <div
          className={`
            fixed md:absolute top-0 right-0 md:top-auto md:right-auto md:mt-2
            w-80 md:w-40 h-full md:h-auto
            bg-white dark:bg-gray-900 border md:border-gray-200 dark:md:border-gray-700
            rounded-none md:rounded-lg shadow-lg z-50
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "translate-x-full"}
            md:translate-x-0
          `}
        >
          <div className="p-2">
            {items.map((i) => (
              <button
                key={i.id}
                onClick={() => {
                  if (i.action) i.action();
                  else navigate(i.to);
                  setOpen(false);
                }}
                className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   EarningsCounter (delivery)
--------------------------- */
function EarningsCounter() {
  const [amount, setAmount] = useState(() =>
    Number(localStorage.getItem("agora_earnings") || "0")
  );

  useEffect(() => {
    // Handler to update state when earnings change
    function updateEarnings() {
      setAmount(Number(localStorage.getItem("agora_earnings") || "0"));
    }

    // Listen for storage events (multi-tab sync)
    window.addEventListener("storage", updateEarnings);

    // Listen for custom event fired from your OngoingDeliveries.jsx
    window.addEventListener("earningsUpdated", updateEarnings);

    return () => {
      window.removeEventListener("storage", updateEarnings);
      window.removeEventListener("earningsUpdated", updateEarnings);
    };
  }, []);

  return (
    <div className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded text-green-800 dark:text-green-200 text-sm">
      ₹{amount.toLocaleString()}
    </div>
  );
}

/* ---------------------------
   StatusToggle (delivery)
--------------------------- */
import { useDelivery } from "../utils/DeliveryContext";

function StatusToggle() {
  const { online, setOnline } = useDelivery();

  return (
    <div className="flex items-center gap-3">
      {/* Toggle Switch */}
      <div
        onClick={() => setOnline(!online)}
        className={`relative w-14 h-8 flex items-center rounded-full cursor-pointer transition-colors ${
          online ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
            online ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </div>

      {/* Status Label */}
      <span className={`font-medium ${online ? "text-green-600" : "text-red-600"}`}>
        {online ? "Active" : "Inactive"}
      </span>
    </div>
  );
}
