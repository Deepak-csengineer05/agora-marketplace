// src/pages/vendor/ServiceVendorDashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "recharts";
import {
  Clock,
  MapPin,
  AlertTriangle,
  ShoppingBag,
  Users,
  PhoneIncoming,
  FileText,
  Settings,
  Bell,
  Star,
  Flag,
  TrendingUp,
  ShieldCheck,
  Video,
  Calendar,
  BellRing,
  Clipboard,
  Truck,
  CheckSquare,
  Zap,
  GitBranch,
  DollarSign,
  MessageSquare,
  Award,
  Gift,
  Box,
} from "lucide-react";

/**
 * ServiceVendorDashboard.jsx
 *
 * Single-file, feature-complete demo dashboard for Service Vendors
 * (Plumbers, Electricians, Cleaners, Painters...). This file intentionally
 * includes many mock/demo features requested:
 *
 * Tabs:
 * - Overview / Earnings / Productivity / Bookings / Route Optimizer / Inventory
 * - Invoices / Customers / Scheduler (subscriptions) / Team & Support / AI Insights
 *
 * All data is mocked and persisted to localStorage for demo purposes.
 *
 * Styling: Tailwind CSS utility classes assumed. Uses 'agora' theme vars:
 * - bg-agoraTeal, agoraPink etc. (you can map these in your tailwind config)
 *
 * NOTE: Replace mock sections with real APIs in production.
 */

// ----------------- Helpers & Mock Data -----------------
const storage = {
  get(k, fallback) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

const COLORS = ["#14b8a6", "#ec4899", "#f59e0b", "#60a5fa"];

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

const MOCK_EARNINGS = [
  { day: "Mon", earnings: 2800 },
  { day: "Tue", earnings: 3200 },
  { day: "Wed", earnings: 2400 },
  { day: "Thu", earnings: 4100 },
  { day: "Fri", earnings: 5200 },
  { day: "Sat", earnings: 6100 },
  { day: "Sun", earnings: 3000 },
];

const MOCK_BOOKINGS = [
  {
    id: "J-1001",
    status: "Scheduled",
    priority: "normal",
    customer: "Rhea Sharma",
    phone: "99988xxxxx",
    address: "Sector 14, Gurgaon",
    time: "2025-09-19T10:30:00",
    durationMin: 60,
    type: "Plumbing",
    notes: "Leak under sink. Check old pipe joint.",
    checklist: [
      { id: "c1", label: "Inspect site", done: false },
      { id: "c2", label: "Turn off water", done: false },
      { id: "c3", label: "Replace gasket", done: false },
    ],
    invoiceId: null,
    assignee: "Vikram",
    tools: ["Wrench", "Gasket kit"],
    parts: [{ name: "Gasket", qty: 1 }],
    location: { lat: 28.4595, lng: 77.0266 },
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
  {
    id: "J-1002",
    status: "In Progress",
    priority: "urgent",
    customer: "Amit Patel",
    phone: "88877xxxxx",
    address: "MG Road, Delhi",
    time: new Date(Date.now() + 1000 * 60 * 40).toISOString(),
    durationMin: 90,
    type: "Electrician",
    notes: "Old wiring in kitchen. Bring safety gloves.",
    checklist: [
      { id: "c1", label: "Test circuits", done: true },
      { id: "c2", label: "Replace switch", done: false },
      { id: "c3", label: "Safety check", done: false },
    ],
    invoiceId: null,
    assignee: "Ramesh",
    tools: ["Insulated Screwdriver", "Voltage Tester"],
    parts: [{ name: "Switch", qty: 1 }],
    location: { lat: 28.7041, lng: 77.1025 },
    createdAt: Date.now() - 1000 * 60 * 20,
  },
];

const MOCK_TEAM = [
  { id: "T1", name: "Vikram", role: "Lead", active: true },
  { id: "T2", name: "Ramesh", role: "Field Tech", active: true },
  { id: "T3", name: "Sunita", role: "Support", active: false },
];

const MOCK_INVENTORY = [
  { id: "I1", name: "Gaskets", qty: 8, unit: "pcs", lowThreshold: 5 },
  { id: "I2", name: "Switches", qty: 12, unit: "pcs", lowThreshold: 5 },
  { id: "I3", name: "PVC Pipe 1m", qty: 3, unit: "pcs", lowThreshold: 4 },
  { id: "I4", name: "Paint - White 1L", qty: 10, unit: "L", lowThreshold: 2 },
];

const MOCK_CUSTOMERS = [
  {
    id: "C1",
    name: "Rhea Sharma",
    phone: "99988xxxxx",
    lastSeen: Date.now() - 1000 * 60 * 60 * 24 * 7,
    notes: ["Prefers morning slots", "Old plumbing in kitchen"],
    rating: 4.7,
  },
  {
    id: "C2",
    name: "Amit Patel",
    phone: "88877xxxxx",
    lastSeen: Date.now() - 1000 * 60 * 60 * 26,
    notes: ["House with pets", "Provide protective shoe covers"],
    rating: 4.3,
  },
];

const MOCK_CERTS = [
  { id: "S1", title: "Electrical Safety Level 1", dueInDays: 120 },
  { id: "S2", title: "First Aid Training", dueInDays: 60 },
];

// ----------------- Main Component -----------------
export default function ServiceVendorDashboard() {
  // persisted state
  const [bookings, setBookings] = useState(() => storage.get("sv_bookings", MOCK_BOOKINGS));
  const [earningsSeries, setEarningsSeries] = useState(() => storage.get("sv_earnings", MOCK_EARNINGS));
  const [team, setTeam] = useState(() => storage.get("sv_team", MOCK_TEAM));
  const [inventory, setInventory] = useState(() => storage.get("sv_inventory", MOCK_INVENTORY));
  const [customers, setCustomers] = useState(() => storage.get("sv_customers", MOCK_CUSTOMERS));
  const [certs, setCerts] = useState(() => storage.get("sv_certs", MOCK_CERTS));
  const [selectedTab, setSelectedTab] = useState("overview");
  const [activeBooking, setActiveBooking] = useState(null);
  const [timerState, setTimerState] = useState(() => storage.get("sv_timer", {}));
  const timerRef = useRef(null);
  const [invoices, setInvoices] = useState(() => storage.get("sv_invoices", []));
  const [searchQ, setSearchQ] = useState("");
  const [aiTips, setAiTips] = useState(() => storage.get("sv_ai_tips", []));
  const [tickets, setTickets] = useState(() => storage.get("sv_tickets", [
    { id: "TK1", subject: "Payout not credited", status: "open", createdAt: Date.now() - 1000 * 60 * 60 * 36, priority: "high" },
  ]));

  // persist
  useEffect(() => storage.set("sv_bookings", bookings), [bookings]);
  useEffect(() => storage.set("sv_earnings", earningsSeries), [earningsSeries]);
  useEffect(() => storage.set("sv_team", team), [team]);
  useEffect(() => storage.set("sv_inventory", inventory), [inventory]);
  useEffect(() => storage.set("sv_customers", customers), [customers]);
  useEffect(() => storage.set("sv_certs", certs), [certs]);
  useEffect(() => storage.set("sv_invoices", invoices), [invoices]);
  useEffect(() => storage.set("sv_tickets", tickets), [tickets]);
  useEffect(() => storage.set("sv_ai_tips", aiTips), [aiTips]);
  useEffect(() => storage.set("sv_timer", timerState), [timerState]);

  // computed totals
  const totalEarnings = useMemo(() => earningsSeries.reduce((s, d) => s + d.earnings, 0), [earningsSeries]);
  const todayBookings = bookings.filter((b) => new Date(b.time).toDateString() === new Date().toDateString());

  // ----------------- Booking management -----------------
  function addBooking(b) {
    const booking = { id: uid("J-"), createdAt: Date.now(), ...b };
    setBookings((arr) => [booking, ...arr]);
    return booking.id;
  }

  function updateBooking(id, patch) {
    setBookings((arr) => arr.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function removeBooking(id) {
    setBookings((arr) => arr.filter((b) => b.id !== id));
  }

  // ----------------- Inventory -----------------
  function adjustInventory(id, delta) {
    setInventory((arr) => arr.map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it)));
  }

  function addInventoryItem({ name, qty = 1, unit = "pcs", lowThreshold = 2 }) {
    setInventory((arr) => [{ id: uid("I-"), name, qty, unit, lowThreshold }, ...arr]);
  }

  // ----------------- Timer / Productivity -----------------
  function startTimer(bookingId) {
    if (timerRef.current) clearInterval(timerRef.current);
    const ts = Date.now();
    setTimerState({ bookingId, running: true, startedAt: ts, elapsed: 0 });
    timerRef.current = setInterval(() => {
      setTimerState((t) => ({ ...t, elapsed: Date.now() - t.startedAt }));
    }, 1000);
    setActiveBooking(bookingId);
  }

  function stopTimer(save = false) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const final = { ...timerState };
    setTimerState({});
    setActiveBooking(null);
    if (save && final.bookingId) {
      // log productivity in earningsSeries as demo: credit small earning equal to minutes * 50
      const minutes = Math.round((final.elapsed || 0) / 60000);
      if (minutes > 0) {
        const today = new Date().toLocaleDateString();
        setEarningsSeries((s) => {
          const idx = s.findIndex((d) => d.day === today);
          if (idx >= 0) {
            const ns = [...s];
            ns[idx] = { ...ns[idx], earnings: ns[idx].earnings + minutes * 50 };
            return ns;
          }
          return [{ day: today, earnings: minutes * 50 }, ...s];
        });
      }
    }
  }

  // ----------------- Route Optimizer (mock) -----------------
  function optimizeRoute(jobIds = []) {
    // very naive TSP-ish: sort jobs by lat then lng (mock)
    const jobs = bookings.filter((b) => jobIds.includes(b.id) || jobIds.length === 0);
    const sorted = jobs.slice().sort((a, b) => (a.location.lat + a.location.lng) - (b.location.lat + b.location.lng));
    // produce mock distances
    const route = sorted.map((j, i) => ({
      ...j,
      etaMinFromPrev: i === 0 ? 10 : 8 + Math.round(Math.random() * 12),
    }));
    return route;
  }

  // ----------------- Invoice generator -----------------
  function generateInvoiceForBooking(bookingId) {
    const b = bookings.find((x) => x.id === bookingId);
    if (!b) return null;
    const invoice = {
      id: uid("INV-"),
      bookingId,
      createdAt: Date.now(),
      items: [
        { desc: `${b.type} service`, qty: 1, rate: 1200 },
        ...(b.parts || []).map((p) => ({ desc: p.name, qty: p.qty || 1, rate: 150 })),
      ],
      taxesPct: 18,
      paid: false,
    };
    invoice.subtotal = invoice.items.reduce((s, it) => s + it.qty * it.rate, 0);
    invoice.tax = Math.round((invoice.subtotal * invoice.taxesPct) / 100);
    invoice.total = invoice.subtotal + invoice.tax;
    setInvoices((arr) => [invoice, ...arr]);
    updateBooking(bookingId, { invoiceId: invoice.id });
    return invoice;
  }

  function downloadInvoice(invoice) {
    const text = `Invoice ${invoice.id}\nBooking ${invoice.bookingId}\n\n${invoice.items.map((it)=>`${it.desc} x${it.qty} @ ${it.rate}`).join("\n")}\n\nSubtotal: ₹${invoice.subtotal}\nTax: ₹${invoice.tax}\nTotal: ₹${invoice.total}\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ----------------- AI Business Coach (mock) -----------------
  function runAiCoach() {
    // generate a few tips based on mock stats
    const tips = [];
    const avgEarnings = Math.round(totalEarnings / Math.max(1, earningsSeries.length));
    if (avgEarnings < 3000) tips.push("Try offering small add-ons (gaskets, filters) to increase average ticket.");
    else tips.push("Your average ticket looks healthy — promote monthly subscription deals for predictable income.");
    const urgentJobs = bookings.filter((b) => b.priority === "urgent").length;
    if (urgentJobs > 0) tips.push(`You have ${urgentJobs} urgent jobs — consider a quick reassign policy to avoid SLA breaches.`);
    tips.push("Reduce travel time by clustering bookings geographically — use Route Optimizer.");
    // mock earnings forecast
    tips.push(`Forecast: Next week projected earnings ₹${Math.round(totalEarnings * 1.08)} (8% growth)`);
    setAiTips(tips);
    return tips;
  }

  // ----------------- Support / Tickets -----------------
  function createTicket(subject, priority = "normal") {
    const t = { id: uid("TK-"), subject, status: "open", createdAt: Date.now(), priority };
    setTickets((arr) => [t, ...arr]);
    return t;
  }

  function closeTicket(id) {
    setTickets((arr) => arr.map((t) => (t.id === id ? { ...t, status: "closed" } : t)));
  }

  // ----------------- Team assignment -----------------
  function assignJobTo(bookingId, teamId) {
    const member = team.find((t) => t.id === teamId);
    if (!member) return;
    updateBooking(bookingId, { assignee: member.name });
  }

  // ----------------- Subscriptions / Recurring -----------------
  const [subscriptions, setSubscriptions] = useState(() => storage.get("sv_subs", [
    { id: "S-1", title: "Weekly House Cleaning", interval: "weekly", nextRun: Date.now() + 1000 * 60 * 60 * 24 * 3, price: 900, customer: "Rhea Sharma" },
  ]));
  useEffect(() => storage.set("sv_subs", subscriptions), [subscriptions]);

  function addSubscription(sub) {
    setSubscriptions((arr) => [{ id: uid("S-"), ...sub }, ...arr]);
  }

  function cancelSubscription(id) {
    setSubscriptions((arr) => arr.filter((s) => s.id !== id));
  }

  // ----------------- Gamification / Leaderboard -----------------
  const leaderboard = useMemo(() => {
    // mock scores from team + bookings
    return team
      .map((m) => ({
        ...m,
        score: (Math.round(Math.random() * 2000) + (Math.random() > 0.5 ? 200 : 0)),
      }))
      .sort((a, b) => b.score - a.score);
  }, [team, bookings]);

  // ----------------- Small UI components -----------------
  function TabsNav() {
    const tabs = [
      { id: "overview", label: "Overview", icon: TrendingUp },
      { id: "bookings", label: "Bookings", icon: Clipboard },
      { id: "route", label: "Route Optimizer", icon: Truck },
      { id: "inventory", label: "Inventory", icon: Box },
      { id: "invoices", label: "Invoices", icon: FileText },
      { id: "customers", label: "Customers", icon: Users },
      { id: "scheduler", label: "Subscriptions", icon: Calendar },
      { id: "productivity", label: "Productivity", icon: Clock },
      { id: "team", label: "Team & Support", icon: Users },
      { id: "ai", label: "AI Coach", icon: Zap },
    ];
    return (
      <nav className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap ${selectedTab === t.id ? "bg-agoraTeal text-black" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300"} shadow`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // ----------------- Render blocks for each tab -----------------
  function OverviewTab() {
    const ratingAvg = (customers.reduce((s, c) => s + c.rating, 0) / Math.max(1, customers.length)).toFixed(1);
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="text-xs text-gray-500">Total Earnings (week)</div>
            <div className="text-2xl font-semibold">₹{totalEarnings}</div>
            <div className="mt-2 text-sm text-gray-500">Payout insights and pending clears</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="text-xs text-gray-500">Open Bookings</div>
            <div className="text-2xl font-semibold">{bookings.filter(b => b.status !== "Completed").length}</div>
            <div className="mt-2 text-sm text-gray-500">Urgent: {bookings.filter(b => b.priority === "urgent").length}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="text-xs text-gray-500">Average Rating</div>
            <div className="text-2xl font-semibold">{ratingAvg} <span className="text-yellow-400"><Star className="inline w-5 h-5 ml-2" /></span></div>
            <div className="mt-2 text-sm text-gray-500">Based on customer feedback</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Earnings Trend</div>
              <div className="text-sm text-gray-500">Last 7 days</div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsSeries}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="#14b8a6" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-3">Top Services & Badges</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>Plumbing</div>
                <div className="text-sm font-medium">320 jobs</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Electrical</div>
                <div className="text-sm font-medium">210 jobs</div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-gray-500">Sustainability</div>
                <div className="mt-2 flex gap-2">
                  <div className="px-2 py-1 rounded bg-green-50 text-green-800">Green Certified</div>
                  <div className="px-2 py-1 rounded bg-yellow-50 text-yellow-800">Safety Star</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-2">Quick Actions</div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setSelectedTab("bookings")} className="px-3 py-2 rounded bg-agoraTeal text-black">Manage Bookings</button>
              <button onClick={() => setSelectedTab("route")} className="px-3 py-2 rounded bg-agoraPink text-white">Optimize Route</button>
              <button onClick={() => runAiCoach()} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Run AI Coach</button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-2">Leaderboard</div>
            <div className="space-y-2">
              {leaderboard.slice(0, 3).map((m) => (
                <div key={m.id} className="flex justify-between items-center">
                  <div>{m.name}</div>
                  <div className="text-sm text-gray-500">{m.score} pts</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-2">Support</div>
            <div className="text-sm text-gray-500">Open tickets: {tickets.filter(t => t.status === "open").length}</div>
            <div className="mt-3">
              <button onClick={() => setSelectedTab("team")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 w-full">Open Helpdesk</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function BookingsTab() {
    const [filter, setFilter] = useState("all");
    const filtered = bookings.filter((b) => {
      if (filter === "all") return true;
      if (filter === "urgent") return b.priority === "urgent";
      return b.status === filter;
    }).filter(b => b.customer.toLowerCase().includes(searchQ.toLowerCase()) || b.id.toLowerCase().includes(searchQ.toLowerCase()));

    return (
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <input value={searchQ} onChange={(e)=>setSearchQ(e.target.value)} placeholder="Search bookings or customers..." className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 flex-1" />
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="px-3 py-2 rounded bg-white dark:bg-gray-900">
            <option value="all">All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filtered.map((b) => (
            <div key={b.id} className={`bg-white dark:bg-gray-900 p-3 rounded-2xl shadow border ${b.priority === "urgent" ? "border-red-300" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{b.customer}</div>
                    <div className="text-xs text-gray-500">{b.type} • {new Date(b.time).toLocaleString()}</div>
                    {b.priority === "urgent" && <div className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">URGENT</div>}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{b.address} • {b.phone}</div>
                  <div className="text-xs text-gray-500 mt-2">Notes: {b.notes}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-sm font-semibold">₹{b.estimated ?? 1200}</div>
                  <div className="flex gap-2">
                    <button onClick={()=> { setActiveBooking(b.id); setSelectedTab("route"); }} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs">Map</button>
                    <button onClick={()=> { setActiveBooking(b.id); setSelectedTab("productivity"); }} className="px-2 py-1 rounded bg-agoraTeal text-black text-xs">Track</button>
                    <button onClick={()=> { const inv = generateInvoiceForBooking(b.id); if (inv) downloadInvoice(inv); }} className="px-2 py-1 rounded bg-agoraPink text-white text-xs">Invoice</button>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-2">Job Checklist</div>
                <div className="flex gap-2">
                  {b.checklist?.map((c) => (
                    <label key={c.id} className="text-sm inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      <input type="checkbox" checked={!!c.done} onChange={() => {
                        updateBooking(b.id, { checklist: b.checklist.map(cc => cc.id === c.id ? { ...cc, done: !cc.done } : cc) });
                      }} />
                      <span className={c.done ? "line-through text-gray-400" : ""}>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button onClick={() => {
            const id = addBooking({
              status: "Scheduled",
              priority: "normal",
              customer: "New Customer",
              phone: "77766xxxxx",
              address: "New Address",
              time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
              durationMin: 60,
              type: "Maintenance",
              notes: "Auto-created demo booking",
              checklist: [{ id: uid(), label: "Inspect", done: false }],
              tools: [],
              parts: [],
              location: { lat: 28.6 + Math.random(), lng: 77.0 + Math.random() }
            });
            alert(`Demo booking ${id} created`);
          }} className="px-3 py-2 rounded bg-agoraTeal text-black">Create Demo Booking</button>
        </div>
      </div>
    );
  }

  function RouteTab() {
    const [selectedJobs, setSelectedJobs] = useState(() => bookings.slice(0, 4).map(b => b.id));
    const route = optimizeRoute(selectedJobs);

    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Select Jobs to Optimize</div>
          <div className="flex gap-2 flex-wrap">
            {bookings.map((b) => (
              <button key={b.id} onClick={() => {
                setSelectedJobs((s) => s.includes(b.id) ? s.filter(x => x !== b.id) : [...s, b.id]);
              }} className={`px-3 py-2 rounded ${selectedJobs.includes(b.id) ? "bg-agoraTeal text-black" : "bg-gray-50 dark:bg-gray-800"}`}>
                {b.id} • {b.customer}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-3">Optimized Route</div>
            <ol className="space-y-2">
              {route.map((r, idx) => (
                <li key={r.id} className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <div>
                    <div className="font-medium">{idx+1}. {r.customer}</div>
                    <div className="text-xs text-gray-500">{r.address}</div>
                  </div>
                  <div className="text-sm text-gray-500">{r.etaMinFromPrev} min</div>
                </li>
              ))}
            </ol>
            <div className="mt-3 text-xs text-gray-500">Route estimated with mock distances.</div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-3">Map Preview</div>
            <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded flex items-center justify-center">
              <svg viewBox="0 0 300 160" className="w-full h-full">
                <rect width="300" height="160" fill="transparent" />
                {route.map((r, i) => (
                  <g key={r.id} transform={`translate(${20 + i*40}, ${30 + (i%3)*40})`}>
                    <circle r="8" fill={i === 0 ? "#14b8a6" : "#ec4899"} />
                    <text x="12" y="4" fontSize="10" fill="#111">{r.customer.split(" ")[0]}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function InventoryTab() {
    const [name, setName] = useState("");
    const [qty, setQty] = useState(1);

    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Inventory Items</div>
          <div className="space-y-2">
            {inventory.map((it) => (
              <div key={it.id} className="flex items-center justify-between gap-4 p-2 rounded bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">Threshold: {it.lowThreshold} {it.unit}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded ${it.qty <= it.lowThreshold ? "bg-red-100 text-red-700" : "bg-gray-100 dark:bg-gray-700"}`}>{it.qty} {it.unit}</div>
                  <button onClick={()=> adjustInventory(it.id, 1)} className="px-2 py-1 rounded bg-agoraTeal text-black text-sm">+1</button>
                  <button onClick={()=> adjustInventory(it.id, -1)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">-1</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input placeholder="Item name" value={name} onChange={(e)=>setName(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
            <input type="number" value={qty} onChange={(e)=>setQty(Number(e.target.value))} className="px-3 py-2 rounded w-28 bg-gray-50 dark:bg-gray-800" />
            <button onClick={()=> { if(!name) return alert("Enter name"); addInventoryItem({ name, qty, unit: "pcs", lowThreshold: 2 }); setName(""); setQty(1); }} className="px-3 py-2 rounded bg-agoraTeal text-black">Add</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Parts Usage (mock)</div>
          <div className="text-sm text-gray-500">Top used parts this month: Gaskets, Switches</div>
        </div>
      </div>
    );
  }

  function InvoicesTab() {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Outstanding Invoices</div>
          <div className="space-y-2">
            {invoices.length === 0 && <div className="text-gray-500">No invoices yet.</div>}
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium">{inv.id}</div>
                  <div className="text-xs text-gray-500">Booking {inv.bookingId} • {new Date(inv.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="font-semibold">₹{inv.total}</div>
                  <button onClick={()=> downloadInvoice(inv)} className="px-2 py-1 rounded bg-agoraTeal text-black text-sm">Download</button>
                  <button onClick={()=> setInvoices((arr)=> arr.map(i=> i.id === inv.id ? {...i, paid: true} : i))} className={`px-2 py-1 rounded text-sm ${inv.paid ? "bg-gray-100 dark:bg-gray-800" : "bg-agoraPink text-white"}`}>{inv.paid ? "Paid" : "Mark Paid"}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Payout Insights</div>
          <div className="text-sm text-gray-500">Next payout in 3 days • Pending ₹{Math.round(totalEarnings * 0.2)}</div>
        </div>
      </div>
    );
  }

  function CustomersTab() {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Customer List</div>
          <div className="space-y-2">
            {customers.map(c => (
              <div key={c.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">Last seen: {new Date(c.lastSeen).toLocaleDateString()} • {c.phone}</div>
                  <div className="text-xs text-gray-500">Notes: {c.notes.join(" • ")}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{c.rating}</div>
                  <div className="mt-2">
                    <button onClick={() => { setCustomers(cs => cs.map(x => x.id === c.id ? { ...x, notes: [...x.notes, "Followed up (demo)"] } : x)); alert("Follow-up noted (demo)"); }} className="px-2 py-1 rounded bg-agoraTeal text-black text-sm">Follow up</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-2">Property Notes</div>
            <div className="text-sm text-gray-500">Save recurring customer property notes for faster jobs.</div>
            <div className="mt-2">
              <button onClick={() => alert("Property note added (demo)")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Add note to customer</button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-2">Ratings Breakdown</div>
            <div className="text-sm text-gray-500">Plumbing: 4.6 • Electrical: 4.4 • Cleaning: 4.7</div>
          </div>
        </div>
      </div>
    );
  }

  function SchedulerTab() {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Recurring Subscriptions</div>
          <div className="space-y-2">
            {subscriptions.map(s => (
              <div key={s.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-gray-500">Customer: {s.customer} • {s.interval} • Next: {new Date(s.nextRun).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { cancelSubscription(s.id); }} className="px-2 py-1 rounded bg-red-100 text-red-700 text-sm">Cancel</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <button onClick={() => addSubscription({ title: "Monthly Pest Check", interval: "monthly", nextRun: Date.now() + 1000*60*60*24*30, price: 400, customer: "New Customer" })} className="px-3 py-2 rounded bg-agoraTeal text-black">Create Subscription (demo)</button>
          </div>
        </div>
      </div>
    );
  }

  function ProductivityTab() {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Job Timer & Productivity</div>
          <div className="flex gap-3 items-center">
            <select value={activeBooking || ""} onChange={(e)=> setActiveBooking(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">
              <option value="">Select Booking</option>
              {bookings.map(b => <option key={b.id} value={b.id}>{b.id} • {b.customer}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={()=> startTimer(activeBooking || bookings[0]?.id)} className="px-3 py-2 rounded bg-agoraTeal text-black">Start</button>
              <button onClick={()=> stopTimer(true)} className="px-3 py-2 rounded bg-agoraPink text-white">Stop & Save</button>
              <button onClick={()=> stopTimer(false)} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Stop</button>
            </div>
            <div className="ml-auto">
              <div className="text-xs text-gray-500">Current:</div>
              <div className="font-semibold">{timerState.running ? `${Math.floor((timerState.elapsed||0)/60000)}m ${(Math.floor((timerState.elapsed||0)/1000)%60)}s` : "Idle"}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Productivity Insights</div>
          <div className="text-sm text-gray-500">Average job time: {Math.round(bookings.reduce((s,b)=> s + (b.durationMin||60),0)/Math.max(1, bookings.length))} mins • Jobs completed today: {bookings.filter(b => b.status === "Completed").length}</div>
        </div>
      </div>
    );
  }

  function TeamSupportTab() {
    const [newTicket, setNewTicket] = useState("");
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-2">Team Members</div>
            <div className="space-y-2">
              {team.map(mem => (
                <div key={mem.id} className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <div><div className="font-medium">{mem.name}</div><div className="text-xs text-gray-500">{mem.role}</div></div>
                  <div className="flex gap-2">
                    <button onClick={()=> setTeam(ts => ts.map(t=> t.id === mem.id ? {...t, active: !t.active} : t))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">{mem.active ? "Deactivate" : "Activate"}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button onClick={()=> setTeam(ts => [{ id: uid("T-"), name: `New-${ts.length+1}`, role: "Field Tech", active: true }, ...ts])} className="px-3 py-2 rounded bg-agoraTeal text-black">Add Team Member</button>
            </div>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-2">Helpdesk Tickets</div>
            <div className="space-y-2">
              {tickets.map(t => (
                <div key={t.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{t.subject}</div>
                    <div className="text-xs text-gray-500">Status: {t.status} • {t.priority}</div>
                  </div>
                  <div className="flex gap-2">
                    {t.status === "open" && <button onClick={()=> closeTicket(t.id)} className="px-2 py-1 rounded bg-agoraTeal text-black text-sm">Close</button>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={newTicket} onChange={(e)=> setNewTicket(e.target.value)} placeholder="New ticket subject" className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
              <button onClick={()=> { if(!newTicket) return alert("enter subject"); createTicket(newTicket); setNewTicket(""); }} className="px-3 py-2 rounded bg-agoraPink text-white">Create Ticket</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function AiTab() {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold">AI Business Coach</div>
            <div>
              <button onClick={()=> runAiCoach()} className="px-3 py-2 rounded bg-agoraTeal text-black">Run Analysis</button>
            </div>
          </div>
          <div className="space-y-2">
            {aiTips.length === 0 && <div className="text-gray-500">No tips yet — run the coach.</div>}
            {aiTips.map((t, i) => <div key={i} className="p-2 rounded bg-gray-50 dark:bg-gray-800">{t}</div>)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="font-semibold mb-2">Marketing Tools (mock)</div>
          <div className="text-sm text-gray-500">Create quick social flyers or share promotions.</div>
          <div className="mt-3 flex gap-2">
            <button onClick={()=> alert("Generated flyer (demo)")} className="px-3 py-2 rounded bg-agoraTeal text-black">Generate Flyer</button>
            <button onClick={()=> alert("Shared promotion (demo)")} className="px-3 py-2 rounded bg-agoraPink text-white">Share Offer</button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------- Main render -----------------
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-agoraTeal to-agoraPink">🛠 Service Vendor — Admin Console</h1>
          <p className="text-sm text-gray-500">Manage bookings, team, inventory, invoices and growth tools.</p>
        </div>
        <div className="flex gap-2 items-center">
          <button className="px-3 py-2 rounded bg-agoraPink text-white">New Booking</button>
        </div>
      </motion.div>

      <TabsNav />

      <div className="bg-transparent">
        <div className="mt-4">
          {selectedTab === "overview" && <OverviewTab />}
          {selectedTab === "bookings" && <BookingsTab />}
          {selectedTab === "route" && <RouteTab />}
          {selectedTab === "inventory" && <InventoryTab />}
          {selectedTab === "invoices" && <InvoicesTab />}
          {selectedTab === "customers" && <CustomersTab />}
          {selectedTab === "scheduler" && <SchedulerTab />}
          {selectedTab === "productivity" && <ProductivityTab />}
          {selectedTab === "team" && <TeamSupportTab />}
          {selectedTab === "ai" && <AiTab />}
        </div>
      </div>
    </div>
  );
}
