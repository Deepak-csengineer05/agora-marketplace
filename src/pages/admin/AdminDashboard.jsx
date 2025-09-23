import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Store,
  Truck,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  Bell,
  ClipboardList,
  Settings,
  Search,
  PlusCircle,
  MessageSquare,
  MapPin,
  Activity,
  Zap,
  ShieldOff,
  CheckCircle,
  XCircle,
  Play,
  Database,
  Clipboard,
  PieChart as PieIcon,
  BarChart as BarIcon,
  Eye,
} from "lucide-react";

/**
 * AdminDashboard.jsx
 *
 * A single-file, demo-grade powerful Admin Dashboard for Agora.
 * Includes many admin-level features (all demo/mock data):
 *  - KPI overview (users/vendors/delivery/revenue)
 *  - Charts (growth, orders, revenue split, refunds)
 *  - Vendor & delivery partner monitoring (approve/suspend)
 *  - User management (suspend/verify)
 *  - Support tickets and moderation queue
 *  - Mock real-time order heatmap (SVG)
 *  - Financial reports & payout requests
 *  - System health checks (mock uptime, latency, errors)
 *  - Fraud detection alerts & actions
 *  - Audit logs with filter/search
 *  - Notifications center and broadcast announcements
 *  - AI Insights (mock analytics)
 *  - Role-based analytics tabs
 *  - Dark/light mode toggle
 *
 * Drop in and wire to real APIs as needed.
 */

/* -------------------- Mock / Demo Data -------------------- */

const KPI_DEFAULTS = {
  users: 12540,
  vendors: 820,
  deliveryPartners: 420,
  monthlyRevenue: 2480000,
  dailyOrders: 4600,
};

const USER_MOCK = [
  { id: "u1001", name: "Rohit Sharma", email: "rohit@demo.com", role: "customer", status: "active", joined: "2024-11-23" },
  { id: "u1002", name: "Nisha Verma", email: "nisha@demo.com", role: "vendor", status: "pending", vendorType: "product", joined: "2025-03-02" },
  { id: "u1003", name: "Aman Singh", email: "aman@demo.com", role: "delivery", status: "active", joined: "2024-09-14" },
  { id: "u1004", name: "Priya Kapoor", email: "priya@demo.com", role: "vendor", status: "suspended", vendorType: "service", joined: "2023-12-30" },
];

const VENDOR_MOCK = [
  { id: "v2001", name: "Spice Hub", type: "product", rating: 4.6, earningsM: 24000, status: "verified", lastActive: "2m ago" },
  { id: "v2002", name: "QuickFix Services", type: "service", rating: 4.4, earningsM: 11200, status: "pending", lastActive: "1h ago" },
  { id: "v2003", name: "Green Salads", type: "product", rating: 4.8, earningsM: 32000, status: "verified", lastActive: "5m ago" },
];

const DELIVERY_MOCK = [
  { id: "d3001", name: "Deepak", vehicle: "Bike", status: "online", rating: 4.7, lastOrder: "15m" },
  { id: "d3002", name: "Suman", vehicle: "Scooter", status: "busy", rating: 4.3, lastOrder: "3m" },
  { id: "d3003", name: "Kamal", vehicle: "Car", status: "offline", rating: 4.9, lastOrder: "2d" },
];

const TICKETS_MOCK = [
  { id: "t5001", subject: "Missing refund", user: "Rohit", created: "2h ago", status: "open", priority: "high", messages: 3 },
  { id: "t5002", subject: "Vendor verification docs", user: "Nisha", created: "1d ago", status: "pending", priority: "medium", messages: 1 },
  { id: "t5003", subject: "Delivery delayed", user: "Aman", created: "3h ago", status: "open", priority: "high", messages: 2 },
];

const AUDIT_LOGS_MOCK = [
  { id: "L1", ts: Date.now() - 1000 * 60 * 60 * 24, actor: "admin@agora", action: "suspended user", target: "u1004", role: "admin" },
  { id: "L2", ts: Date.now() - 1000 * 60 * 40, actor: "system", action: "batch payout processed", target: "v2001", role: "system" },
  { id: "L3", ts: Date.now() - 1000 * 60 * 5, actor: "admin@agora", action: "approved vendor", target: "v2002", role: "admin" },
];

const ORDERS_SERIES = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12],
  orders: Math.round(2000 + Math.random() * 5000),
  revenue: Math.round(80000 + Math.random() * 120000),
}));

const REVENUE_SPLIT = [
  { name: "Products", value: 58 },
  { name: "Services", value: 24 },
  { name: "Delivery Fees", value: 10 },
  { name: "Other", value: 8 },
];

const FRAUD_ALERTS_MOCK = [
  { id: "f1", type: "chargeback", score: 0.92, description: "Multiple chargebacks from user u1072", created: "10m ago", resolved: false },
  { id: "f2", type: "suspicious_vendor", score: 0.78, description: "High refund rate for vendor v210", created: "2h ago", resolved: false },
];

const SYSTEM_HEALTH_MOCK = {
  uptime: 99.98,
  avgLatency: 120, // ms
  errorRate: 0.08, // %
  dbConnections: 18,
  queueDepth: 4,
};

/* -------------------- Helpers -------------------- */

const currency = (n) => `₹${Number(n).toLocaleString()}`;

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

/* -------------------- Main Component -------------------- */

export default function AdminDashboard() {
  // Admin state
  const [kpi, setKpi] = useState(KPI_DEFAULTS);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("adm_users") || "[]").length ? JSON.parse(localStorage.getItem("adm_users")) : USER_MOCK);
  const [vendors, setVendors] = useState(() => JSON.parse(localStorage.getItem("adm_vendors") || "[]").length ? JSON.parse(localStorage.getItem("adm_vendors")) : VENDOR_MOCK);
  const [deliveryPartners, setDeliveryPartners] = useState(() => JSON.parse(localStorage.getItem("adm_delivery") || "[]").length ? JSON.parse(localStorage.getItem("adm_delivery")) : DELIVERY_MOCK);
  const [tickets, setTickets] = useState(TICKETS_MOCK);
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOGS_MOCK);
  const [ordersSeries] = useState(ORDERS_SERIES);
  const [revenueSplit] = useState(REVENUE_SPLIT);
  const [fraudAlerts, setFraudAlerts] = useState(FRAUD_ALERTS_MOCK);
  const [systemHealth, setSystemHealth] = useState(SYSTEM_HEALTH_MOCK);
  const [announcements, setAnnouncements] = useState(() => JSON.parse(localStorage.getItem("adm_announcements") || "[]"));
  const [notifications, setNotifications] = useState([]);
  const [roleTab, setRoleTab] = useState("overview"); // overview | customers | vendors | delivery | finance
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("admin_dark") === "1");
  const [filterLogsRole, setFilterLogsRole] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const announcementRef = useRef();

  // persist some things locally to demo continuity
  useEffect(() => {
    localStorage.setItem("adm_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("adm_vendors", JSON.stringify(vendors));
  }, [vendors]);
  useEffect(() => {
    localStorage.setItem("adm_delivery", JSON.stringify(deliveryPartners));
  }, [deliveryPartners]);
  useEffect(() => {
    localStorage.setItem("adm_announcements", JSON.stringify(announcements));
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem("admin_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // simulate some live notifications
  useEffect(() => {
    const id = setInterval(() => {
      const n = { id: uid("N-"), text: `New order spike in zone ${Math.ceil(Math.random() * 6)}`, ts: Date.now() };
      setNotifications((s) => [n, ...s].slice(0, 10));
    }, 18_000);
    return () => clearInterval(id);
  }, []);

  // small helper to push audit logs
  function pushLog(action, actor = "admin@agora", target = null, role = "admin") {
    const l = { id: uid("L-"), ts: Date.now(), actor, action, target, role };
    setAuditLogs((a) => [l, ...a].slice(0, 200));
  }

  /* -------------------- Admin Actions -------------------- */

  // User management
  function suspendUser(userId) {
    setUsers((arr) => arr.map((u) => (u.id === userId ? { ...u, status: "suspended" } : u)));
    pushLog("suspended user", "admin@agora", userId, "admin");
    alert(`User ${userId} suspended (demo).`);
  }
  function verifyUser(userId) {
    setUsers((arr) => arr.map((u) => (u.id === userId ? { ...u, status: "active" } : u)));
    pushLog("verified user", "admin@agora", userId, "admin");
    alert(`User ${userId} verified (demo).`);
  }

  // Vendor moderation
  function approveVendor(vId) {
    setVendors((arr) => arr.map((v) => (v.id === vId ? { ...v, status: "verified" } : v)));
    pushLog("approved vendor", "admin@agora", vId, "admin");
    setAnnouncements((a) => [{ id: uid("A-"), ts: Date.now(), text: `Vendor ${vId} approved`, audience: "vendors" }, ...a]);
  }
  function suspendVendor(vId) {
    setVendors((arr) => arr.map((v) => (v.id === vId ? { ...v, status: "suspended" } : v)));
    pushLog("suspended vendor", "admin@agora", vId, "admin");
    alert(`Vendor ${vId} suspended (demo).`);
  }

  // Delivery management
  function toggleDeliveryStatus(dId) {
    setDeliveryPartners((arr) => arr.map((d) => (d.id === dId ? { ...d, status: d.status === "online" ? "offline" : "online" } : d)));
    pushLog("toggled delivery status", "admin@agora", dId, "admin");
  }

  // Tickets
  function resolveTicket(tId) {
    setTickets((arr) => arr.map((t) => (t.id === tId ? { ...t, status: "resolved" } : t)));
    pushLog("resolved ticket", "admin@agora", tId, "admin");
    setSelectedTicket(null);
  }

  // Fraud
  function resolveFraud(fId) {
    setFraudAlerts((arr) => arr.map((f) => (f.id === fId ? { ...f, resolved: true } : f)));
    pushLog("resolved fraud alert", "admin@agora", fId, "admin");
    alert(`Fraud alert ${fId} marked resolved (demo).`);
  }

  // Announcements
  function sendAnnouncement() {
    const text = announcementRef.current?.value?.trim();
    if (!text) return alert("Enter an announcement message (demo).");
    const a = { id: uid("A-"), ts: Date.now(), text, audience: "all" };
    setAnnouncements((arr) => [a, ...arr]);
    pushLog("sent announcement", "admin@agora", null, "admin");
    announcementRef.current.value = "";
    alert("Announcement broadcast (demo).");
  }

  // Financial actions (mock)
  function processPayouts() {
    // pretend to mark payout requests as completed
    pushLog("processed payouts", "system", null, "system");
    alert("Batch payouts processed (demo).");
  }

  // System health simulation toggle
  function simulateIncident() {
    setSystemHealth((s) => ({ ...s, uptime: Math.max(90, s.uptime - Math.random() * 5), errorRate: +(s.errorRate + Math.random() * 0.5).toFixed(2) }));
    pushLog("simulated system incident", "admin@agora", null, "admin");
    setNotifications((n) => [{ id: uid("N-"), text: "Simulated incident: increased error rate", ts: Date.now() }, ...n].slice(0, 20));
  }

  /* -------------------- Computed / Derived -------------------- */

  const totals = useMemo(() => {
    const activeVendors = vendors.filter((v) => v.status === "verified").length;
    const pendingVendors = vendors.filter((v) => v.status === "pending").length;
    const onlineDelivery = deliveryPartners.filter((d) => d.status === "online").length;
    return { activeVendors, pendingVendors, onlineDelivery };
  }, [vendors, deliveryPartners]);

  const filteredLogs = useMemo(() => {
    if (filterLogsRole === "all") return auditLogs;
    return auditLogs.filter((l) => l.role === filterLogsRole);
  }, [auditLogs, filterLogsRole]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { users, vendors, deliveryPartners };
    return {
      users: users.filter((u) => (u.name + u.email + u.id).toLowerCase().includes(q)),
      vendors: vendors.filter((v) => (v.name + v.id).toLowerCase().includes(q)),
      deliveryPartners: deliveryPartners.filter((d) => (d.name + d.id).toLowerCase().includes(q)),
    };
  }, [searchQuery, users, vendors, deliveryPartners]);

  /* -------------------- Small UI Subcomponents -------------------- */

  function Header() {
    return (
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Console</h1>
          <p className="text-sm text-gray-500">Full system control & observability • Demo mode</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, vendors, delivery..."
              className="bg-transparent outline-none text-sm"
            />
          </div>

          <div className="px-3 py-2 rounded bg-agoraTeal text-black hidden sm:inline-flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="text-sm">Notifications</span>
          </div>
        </div>
      </div>
    );
  }

  function KpiRow() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Total Users</div>
            <div className="font-semibold text-lg">{kpi.users.toLocaleString()}</div>
          </div>
          <Users className="w-8 h-8 text-agoraTeal" />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Vendors</div>
            <div className="font-semibold text-lg">{kpi.vendors.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Verified: {totals.activeVendors}</div>
          </div>
          <Store className="w-8 h-8 text-agoraPink" />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Delivery Partners</div>
            <div className="font-semibold text-lg">{kpi.deliveryPartners.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Online: {totals.onlineDelivery}</div>
          </div>
          <Truck className="w-8 h-8 text-yellow-500" />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Monthly Revenue</div>
            <div className="font-semibold text-lg">{currency(kpi.monthlyRevenue)}</div>
            <div className="text-xs text-gray-400">Daily Orders: {kpi.dailyOrders}</div>
          </div>
          <DollarSign className="w-8 h-8 text-green-500" />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">System Health</div>
            <div className="font-semibold text-lg">{systemHealth.uptime}% uptime</div>
            <div className="text-xs text-gray-400">Latency: {systemHealth.avgLatency}ms</div>
          </div>
          <Activity className="w-8 h-8 text-agoraTeal" />
        </div>
      </div>
    );
  }

  function ChartsPanel() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">User Growth & Revenue</div>
            <div className="text-xs text-gray-500">Last 12 months</div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersSeries}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Revenue Split</div>
            <div className="text-xs text-gray-500">By category</div>
          </div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueSplit} dataKey="value" nameKey="name" outerRadius={80} label>
                  {revenueSplit.map((_, i) => (
                    <Cell key={i} fill={["#14b8a6", "#ec4899", "#f59e0b", "#60a5fa"][i % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  function VendorsPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Vendors</div>
          <div className="text-xs text-gray-500">Manage vendor verifications & payouts</div>
        </div>

        <div className="space-y-3">
          {vendors.map((v) => (
            <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <div className="font-medium">{v.name} <span className="text-xs text-gray-400">• {v.type}</span></div>
                <div className="text-xs text-gray-500">Rating {v.rating} • Earnings {currency(v.earningsM)}</div>
                <div className="text-xs text-gray-400">Last active: {v.lastActive}</div>
              </div>
              <div className="flex items-center gap-2">
                {v.status === "pending" && <button onClick={() => approveVendor(v.id)} className="px-3 py-1 rounded bg-agoraTeal text-black text-sm">Approve</button>}
                {v.status !== "suspended" ? <button onClick={() => suspendVendor(v.id)} className="px-3 py-1 rounded bg-red-200 text-red-800 text-sm">Suspend</button> : <button className="px-3 py-1 rounded bg-red-500 text-sm">Suspended</button>}
                <button onClick={() => alert("Open vendor profile (demo)")} className="px-3 py-1 rounded bg-agoraBlue text-sm">View</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => processPayouts()} className="px-4 py-2 rounded bg-agoraPink text-white">Process Payouts</button>
          <button onClick={() => pushLog("bulk message vendors", "admin@agora", null, "admin")} className="px-4 py-2 rounded bg-agoraBlue">Message Vendors</button>
        </div>
      </div>
    );
  }

  function DeliveryPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Delivery Partners</div>
          <div className="text-xs text-gray-500">Toggle availability & monitor ratings</div>
        </div>
        <div className="space-y-3">
          {deliveryPartners.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <div className="font-medium">{d.name} <span className="text-xs text-gray-400">• {d.vehicle}</span></div>
                <div className="text-xs text-gray-500">Rating {d.rating} • last order {d.lastOrder}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded text-sm ${d.status === "online" ? "bg-green-400 text-green-800" : d.status === "busy" ? "bg-yellow-100 text-yellow-800" : "bg-red-600 text-wh"}`}>{d.status}</div>
                <button onClick={() => toggleDeliveryStatus(d.id)} className="px-3 py-1 rounded bg-red-400 text-sm">Toggle</button>
                <button onClick={() => alert("Impersonate delivery (demo)")} className="px-3 py-1 rounded bg-blue-400 text-sm">Impersonate</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function TicketsPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Support Tickets</div>
          <div className="text-xs text-gray-500">Quick resolve & assign</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className ="space-y-2">
            {tickets.map((t) => (
              <div key={t.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-between ">
                <div>
                  <div className="font-medium">{t.subject}</div>
                  <div className="text-xs text-gray-500">{t.user} • {t.created} • {t.messages} messages</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-xs px-2 py-1 rounded ${t.status === "open" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>{t.status}</div>
                  <button onClick={() => { setSelectedTicket(t); }} className="px-2 py-1 rounded bg-agoraBlue text-sm">Open</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            {selectedTicket ? (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="font-semibold mb-2">Ticket: {selectedTicket.subject}</div>
                <div className="text-xs text-gray-500 mb-3">From: {selectedTicket.user} • Created: {selectedTicket.created}</div>
                <div className="mb-3">          
                  <textarea placeholder="Reply to user..." className="w-full p-2 rounded bg-white dark:bg-gray-900" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => resolveTicket(selectedTicket.id)} className="px-3 py-2 rounded bg-agoraTeal text-black">Resolve</button>
                  <button onClick={() => setSelectedTicket(null)} className="px-3 py-2 rounded bg-red-400">Close</button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-gray-500">Select a ticket to view details.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function ModerationPanel() {
    const [queue, setQueue] = useState(() => [
      { id: "m1", type: "review", content: "Inappropriate image on product v2001", reporter: "u1020", ts: Date.now() - 1000 * 60 * 15 },
      { id: "m2", type: "menu", content: "Menu item claims false weight", reporter: "u1012", ts: Date.now() - 1000 * 60 * 60 * 4 },
    ]);

    function takeAction(itemId, action) {
      setQueue((q) => q.filter((x) => x.id !== itemId));
      pushLog(`${action} moderation item`, "admin@agora", itemId, "admin");
      alert(`${action} executed on ${itemId} (demo).`);
    }

    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Moderation Queue</div>
          <div className="text-xs text-gray-500">User reported content</div>
        </div>

        <div className="space-y-3">
          {queue.length === 0 ? <div className="text-gray-500">No items in queue.</div> : queue.map((q) => (
            <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <div className="font-medium">{q.type} • {q.reporter}</div>
                <div className="text-xs text-gray-500">{q.content}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => takeAction(q.id, "Remove")} className="px-3 py-1 rounded bg-red-200 text-red-800 text-sm">Remove</button>
                <button onClick={() => takeAction(q.id, "Warn")} className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">Warn</button>
                <button onClick={() => takeAction(q.id, "Ignore")} className="px-3 py-1 rounded bg-red-300   text-sm">Ignore</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function AuditLogsPanel() {
    const [q, setQ] = useState("");
    const results = filteredLogs.filter((l) => (l.action + l.actor + (l.target || "")).toLowerCase().includes(q.toLowerCase()));
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Audit Logs</div>
          <div className="text-xs text-gray-500">Filter & search</div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <select value={filterLogsRole} onChange={(e) => setFilterLogsRole(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="system">System</option>
            <option value="vendor">Vendor</option>
          </select>
          <input placeholder="Search logs..." value={q} onChange={(e) => setQ(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
        </div>

        <div className="space-y-2 max-h-56 overflow-auto">
          {results.map((l) => (
            <div key={l.id} className="text-xs p-2 rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <div>
                <div><span className="font-medium">{l.action}</span> — {l.actor}</div>
                <div className="text-gray-500">{new Date(l.ts).toLocaleString()} {l.target ? `• ${l.target}` : ""}</div>
              </div>
              <div className="text-gray-400">{l.role}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function HeatmapPanel() {
    // Mock: render colored circles on map representing order density
    const zones = [
      { id: "z1", x: 35, y: 30, intensity: Math.random() * 1.0 },
      { id: "z2", x: 70, y: 50, intensity: Math.random() * 1.0 },
      { id: "z3", x: 180, y: 80, intensity: Math.random() * 1.0 },
      { id: "z4", x: 240, y: 40, intensity: Math.random() * 1.0 },
    ];

    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Order Heatmap</div>
          <div className="text-xs text-gray-500">Mock geographic view</div>
        </div>

        <div className="rounded overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 h-60 flex items-center justify-center">
          <svg viewBox="0 0 300 140" className="w-full h-full">
            <rect x="0" y="0" width="300" height="140" fill="transparent" />
            {zones.map((z) => (
              <g key={z.id} transform={`translate(${z.x}, ${z.y})`}>
                <circle r={20 + z.intensity * 30} fill={`rgba(236,72,153,${0.2 + z.intensity * 0.6})`} />
                <text x={-10} y={5} fontSize="10" fill="#111">{z.id}</text>
              </g>
            ))}
            {/* vendor markers */}
            {vendors.map((v, i) => (
              <g key={v.id} transform={`translate(${40 + (i * 50) % 260}, ${20 + (i * 30) % 110})`}>
                <circle r="5" fill="#14b8a6" />
                <text x="8" y="4" fontSize="8" fill="#111">{v.name.split(" ")[0]}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  function FraudPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Fraud Detection</div>
          <div className="text-xs text-gray-500">Flagged alerts</div>
        </div>

        <div className="space-y-3">
          {fraudAlerts.length === 0 ? <div className="text-gray-500">No active alerts.</div> : fraudAlerts.map((f) => (
            <div key={f.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
              <div>
                <div className="font-medium">{f.type} • score {Math.round(f.score * 100)}%</div>
                <div className="text-xs text-gray-500">{f.description} • {f.created}</div>
              </div>
              <div className="flex gap-2">
                {!f.resolved && <button onClick={() => resolveFraud(f.id)} className="px-3 py-1 rounded bg-agoraTeal text-black text-sm">Mark resolved</button>}
                <button onClick={() => pushLog("ignore fraud", "admin@agora", f.id, "admin")} className="px-3 py-1 rounded bg-red-500 text-sm">Ignore</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function FinancialsPanel() {
    const payoutRequests = [
      { id: "p1", vendor: "v2001", amount: 15000, requested: "2d ago", status: "pending" },
      { id: "p2", vendor: "v2003", amount: 22000, requested: "6d ago", status: "pending" },
    ];

    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Financials & Payouts</div>
          <div className="text-xs text-gray-500">Review and approve vendor payouts</div>
        </div>

        <div className="space-y-3">
          {payoutRequests.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <div className="font-medium">{p.vendor}</div>
                <div className="text-xs text-gray-500">{p.requested} • {currency(p.amount)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { alert(`Payout ${p.id} approved (demo)`); pushLog("approved payout", "admin@agora", p.id, "admin"); }} className="px-3 py-1 rounded bg-agoraTeal text-black text-sm">Approve</button>
                <button onClick={() => { alert(`Payout ${p.id} rejected (demo)`); pushLog("rejected payout", "admin@agora", p.id, "admin"); }} className="px-3 py-1 rounded bg-red-200 text-red-800 text-sm">Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-500">Monthly reports</div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
              <div className="text-xs text-gray-500">Revenue (last month)</div>
              <div className="font-semibold text-lg">{currency(kpi.monthlyRevenue)}</div>
            </div>
            <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
              <div className="text-xs text-gray-500">Refund rate</div>
              <div className="font-semibold text-lg">1.2%</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function AiInsightsPanel() {
    const insights = [
      "Orders increased by 12% vs last week — promotions drove traffic in zone 3.",
      "Top performing vendors: Green Salads, Spice Hub — consider featured placement.",
      "Delivery partner utilization at 78% — consider surge incentives for evening shift.",
      "High refund cluster detected around vendor v210 — recommend manual review.",
    ];
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">AI Insights</div>
          <div className="text-xs text-gray-500">Auto-generated (mock)</div>
        </div>
        <div className="space-y-2">
          {insights.map((i, idx) => (
            <div key={idx} className="p-3 rounded bg-gray-50 dark:bg-gray-800 text-sm">
              <div className="font-medium">Insight #{idx + 1}</div>
              <div className="text-xs text-gray-500">{i}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function NotificationsCenter() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow space-y-3">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Notifications</div>
          <div className="text-xs text-gray-500">Latest system alerts</div>
        </div>
        <div className="space-y-2 max-h-44 overflow-auto">
          {notifications.length === 0 ? <div className="text-gray-500">No notifications yet.</div> : notifications.map((n) => (
            <div key={n.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800 text-sm flex items-center justify-between">
              <div>{n.text}</div>
              <div className="text-xs text-gray-400">{new Date(n.ts).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={() => setNotifications([])} className="px-3 py-2 rounded bg-red-400">Clear</button>
          <button onClick={() => { setNotifications((s) => [{ id: uid("N-"), text: "Manual test notification", ts: Date.now() }, ...s]); pushLog("pushed test notification", "admin@agora", null, "admin"); }} className="px-3 py-2 rounded bg-agoraTeal text-black">Push Test</button>
        </div>
      </div>
    );
  }

  /* -------------------- Main render -------------------- */

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors p-6`}>
      <div className="max-w-8xl mx-auto space-y-6">
        <Header />

        <KpiRow />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ChartsPanel />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VendorsPanel />
              <DeliveryPanel />
            </div>

            <div className="grid-cols-1 lg:grid-cols-3 gap-4 space-y-3">
              <TicketsPanel />
              <ModerationPanel />
              <AuditLogsPanel />
            </div>

            <div className="grid-cols-1 lg:grid-cols-3 gap-4 space-y-3">
              <HeatmapPanel />
            </div>

            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 space-y-3">
              <AiInsightsPanel />
              <div className=" space-y-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow ">
                  <div className="font-semibold mb-2">System Health</div>
                  <div className="text-xs text-gray-500 mb-3">Quick metrics</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded bg-gray-50 dark:bg-gray-800 text-sm">
                      <div className="text-xs text-gray-500">Uptime</div>
                      <div className="font-semibold">{systemHealth.uptime}%</div>
                    </div>
                    <div className="p-3 rounded bg-gray-50 dark:bg-gray-800 text-sm">
                      <div className="text-xs text-gray-500">Avg Latency</div>
                      <div className="font-semibold">{systemHealth.avgLatency} ms</div>
                    </div>
                    <div className="p-3 rounded bg-gray-50 dark:bg-gray-800 text-sm">
                      <div className="text-xs text-gray-500">Error Rate</div>
                      <div className="font-semibold">{systemHealth.errorRate}%</div>
                    </div>
                    <div className="p-3 rounded bg-gray-50 dark:bg-gray-800 text-sm">
                      <div className="text-xs text-gray-500">Queue Depth</div>
                      <div className="font-semibold">{systemHealth.queueDepth}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button onClick={() => simulateIncident()} className="px-3 py-2 rounded bg-red-200 text-red-800">Simulate Incident</button>
                    <button onClick={() => pushLog("ran health check", "admin@agora", null, "admin")} className="px-3 py-2 rounded bg-green-300 text-green-800 ">Run Health Check</button>
                  </div>
                </div>
              </div>
              <div>

              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Quick Actions</div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setRoleTab("customers"); }} className="px-3 py-2 rounded bg-agoraBlue text-left"><Users className="inline w-4 h-4 mr-2" /> Manage Users</button>
                <button onClick={() => { setRoleTab("vendors"); }} className="px-3 py-2 rounded bg-agoraBlue text-left"><Store className="inline w-4 h-4 mr-2" /> Vendor Center</button>
                <button onClick={() => { setRoleTab("delivery"); }} className="px-3 py-2 rounded bg-agoraBlue text-left"><Truck className="inline w-4 h-4 mr-2" /> Delivery Ops</button>
                <button onClick={() => { setRoleTab("finance"); }} className="px-3 py-2 rounded bg-agoraPink text-left"><DollarSign className="inline w-4 h-4 mr-2" /> Finance</button>
                <button onClick={() => { pushLog("ran full audit", "admin@agora", null, "admin"); alert("Full audit started (demo)."); }} className="px-3 py-2 rounded bg-agoraPink text-white text-left"><ClipboardList className="inline w-4 h-4 mr-2" /> Run Audit</button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Role Tab</div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setRoleTab("overview")} className={`px-3 py-1 rounded ${roleTab === "overview" ? "bg-agoraTeal text-black" : "bg-agoraBlue"}`}>Overview</button>
                <button onClick={() => setRoleTab("customers")} className={`px-3 py-1 rounded ${roleTab === "customers" ? "bg-agoraTeal text-black" : "bg-agoraBlue"}`}>Customers</button>
                <button onClick={() => setRoleTab("vendors")} className={`px-3 py-1 rounded ${roleTab === "vendors" ? "bg-agoraTeal text-black" : "bg-agoraBlue"}`}>Vendors</button>
                <button onClick={() => setRoleTab("delivery")} className={`px-3 py-1 rounded ${roleTab === "delivery" ? "bg-agoraTeal text-black" : "bg-agoraBlue"}`}>Delivery</button>
                <button onClick={() => setRoleTab("finance")} className={`px-3 py-1 rounded ${roleTab === "finance" ? "bg-agoraTeal text-black" : "bg-agoraBlue"}`}>Finance</button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Quick Search Results</div>
              <div className="text-xs mb-2 text-gray-500">Showing top matches</div>
              <div className="space-y-2">
                <div className="text-sm">Users: {searchResults.users.length}</div>
                <div className="text-sm">Vendors: {searchResults.vendors.length}</div>
                <div className="text-sm">Delivery: {searchResults.deliveryPartners.length}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Fraud Alerts</div>
              <div className="space-y-2">
                {fraudAlerts.slice(0, 3).map((f) => (
                  <div key={f.id} className="text-sm flex items-center justify-between">
                    <div>{f.type} ({Math.round(f.score * 100)}%)</div>
                    <div className="flex gap-2">
                      {!f.resolved && <button onClick={() => resolveFraud(f.id)} className="px-2 py-1 rounded bg-agoraTeal text-black text-xs">Resolve</button>}
                      <button onClick={() => pushLog("escalated fraud", "admin@agora", f.id, "admin")} className="px-2 py-1 rounded bg-red-500 text-xs">Escalate</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">System Controls</div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { alert("Backup triggered (demo)"); pushLog("triggered backup", "admin@agora", null, "admin"); }} className="px-3 py-2 rounded bg-green-400 text-left">Trigger Backup</button>
                <button onClick={() => { alert("Deploy triggered (demo)"); pushLog("triggered deploy", "admin@agora", null, "admin"); }} className="px-3 py-2 rounded bg-green-400 text-left">Trigger Deploy</button>
                <button onClick={() => { setUsers((u) => [...u, { id: uid("u"), name: "New Demo", email: "new@demo", role: "customer", status: "active", joined: new Date().toISOString().split("T")[0] }]); pushLog("created demo user", "admin@agora", null, "admin"); }} className="px-3 py-2 rounded bg-agoraTeal text-black text-left">Create Demo User</button>
              </div>
            </div>  
            
            <div className = "space-y-3">
                <NotificationsCenter />
                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mb-4 space-y-3" >
                  <div className="font-semibold mb-2">Announcements</div>
                  <textarea ref={announcementRef} placeholder="Write broadcast announcement..." className="w-full p-2 rounded bg-gray-50 dark:bg-gray-800 text-sm" />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => sendAnnouncement()} className="px-3 py-2 rounded bg-agoraTeal text-black">Broadcast</button>
                    <button onClick={() => { announcementRef.current.value = ""; }} className="px-3 py-2 rounded bg-red-400">Clear</button>
                  </div>
                </div>

                
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
                  <div className="font-semibold mb-2">Recent Announcements</div>
                  <div className="space-y-2 max-h-56 overflow-auto">
                    {announcements.length === 0 ? <div className="text-gray-500">No announcements</div> : announcements.map((a) => (
                      <div key={a.id} className="text-sm p-2 rounded bg-gray-50 dark:bg-gray-800">
                        <div className="text-xs text-gray-400">{new Date(a.ts).toLocaleString()}</div>
                        <div>{a.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <FraudPanel />
                <FinancialsPanel />

            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
