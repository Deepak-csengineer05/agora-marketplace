import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Star,
  AlertTriangle,
  PlusCircle,
  Clock,
  Truck,
  Package,
  Calendar,
  Bell,
  Image,
  Camera,
  DollarSign,
  ShoppingCart,
  Users,
  ClipboardList,
  Settings,
  ShieldCheck,
  Sprout,
  MessageCircle,
  Trophy,
  HelpCircle,
  CalendarCheck,
  Check,
} from "lucide-react";

/**
 * ProductVendorDashboard.jsx
 *
 * Extended, tabbed single-file admin/dashboard for product vendors (chefs/food merchants).
 * - All features from the prior demo are preserved and expanded into dedicated tabs.
 * - Local state persists to localStorage to make the demo feel persistent.
 * - Uses Tailwind classes with Agora color tokens: `agoraTeal`, `agoraPink`.
 *
 * Ready to paste into src/pages/vendor/ProductVendorDashboard.jsx
 */

// ---------- Mock/demo data ----------
const salesSeries = [
  { day: "Mon", sales: 120 },
  { day: "Tue", sales: 200 },
  { day: "Wed", sales: 180 },
  { day: "Thu", sales: 220 },
  { day: "Fri", sales: 380 },
  { day: "Sat", sales: 540 },
  { day: "Sun", sales: 420 },
];

const dishTrends = [
  { name: "Paneer Butter Masala", orders: 320, price: 220, cost: 80 },
  { name: "Chicken Biryani", orders: 280, price: 260, cost: 110 },
  { name: "Veg Momos", orders: 200, price: 120, cost: 45 },
  { name: "Chocolate Cake (slice)", orders: 150, price: 140, cost: 40 },
];

const competitorDelivery = [
  { name: "You", avgMins: 28 },
  { name: "Competitor A", avgMins: 32 },
  { name: "Competitor B", avgMins: 26 },
  { name: "Competitor C", avgMins: 35 },
];

const suppliersMock = [
  { id: "s1", name: "Fresh Farms", leadDays: 2, contact: "98765 11111", preferred: true },
  { id: "s2", name: "Spice Suppliers Co.", leadDays: 3, contact: "98765 22222", preferred: false },
  { id: "s3", name: "Dairy Delights", leadDays: 1, contact: "98765 33333", preferred: true },
];

const eventOrdersMock = [
  { id: "EV-1001", client: "Naman Weddings", date: "2025-10-11", items: 120, status: "Confirmed", estRevenue: 42000 },
  { id: "EV-1002", client: "Office Meetup - ByteCorp", date: "2025-09-05", items: 45, status: "Quote sent", estRevenue: 9000 },
];

const hygieneChecklistTemplate = [
  { id: "h1", title: "Fridge temp check (≤5°C)", mandatory: true },
  { id: "h2", title: "Handwashing station stocked", mandatory: true },
  { id: "h3", title: "Sanitize counters", mandatory: true },
  { id: "h4", title: "Pest control last 30 days", mandatory: false },
];

// ---------- Helpers ----------
const currency = (n) => `₹${Math.round(n).toLocaleString()}`;
const uid = (p = "") => `${p}${Math.random().toString(36).slice(2, 9)}`;

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

// ---------- Main Component ----------
export default function ProductVendorDashboard() {
  // vendor basic profile
  const [vendor] = useState(() => storage.get("vendor_profile", { name: "Spice Hub", id: "v-2001", city: "Mumbai" }));

  // menu & inventory
  const [menu, setMenu] = useState(() => storage.get("vendor_menu", [
    { id: "d1", name: "Paneer Butter Masala", price: 220, cost: 80, available: true, photo: null },
    { id: "d2", name: "Chicken Biryani", price: 260, cost: 110, available: true, photo: null },
    { id: "d3", name: "Veg Momos", price: 120, cost: 45, available: true, photo: null },
  ]));
  const [newDishName, setNewDishName] = useState("");
  const [newDishPrice, setNewDishPrice] = useState(150);

  // sales & financials
  const [sales] = useState(salesSeries);
  const [dishes] = useState(dishTrends);
  const [expenses, setExpenses] = useState(() => storage.get("vendor_expenses", [
    { id: uid("e-"), date: "2025-08-01", type: "Groceries", amount: 8200 },
    { id: uid("e-"), date: "2025-08-10", type: "Rent", amount: 12000 },
    { id: uid("e-"), date: "2025-08-20", type: "Packaging", amount: 2400 },
  ]));

  // kitchen schedule
  const [prepSchedule, setPrepSchedule] = useState(() => storage.get("vendor_prep_schedule", [
    { id: uid("s-"), task: "Prep paneer masala base", time: "09:00", durationMins: 40 },
    { id: uid("s-"), task: "Bake chocolate cake (slices)", time: "10:30", durationMins: 50 },
    { id: uid("s-"), task: "Stock momos steamers", time: "11:30", durationMins: 20 },
  ]));

  // suppliers & auto-reorder
  const [suppliers, setSuppliers] = useState(() => storage.get("vendor_suppliers", suppliersMock));
  const [autoReorderRules, setAutoReorderRules] = useState(() => storage.get("vendor_auto_reorder", [
    { id: uid("ar-"), ingredient: "Paneer", threshold: 3, unit: "kg", supplierId: "s3", qty: 10 },
  ]));

  // food photography Hub (mock)
  const [photoQueue, setPhotoQueue] = useState(() => storage.get("vendor_photos", [
    { id: uid("p-"), dishId: "d1", filename: "paneer_raw.jpg", enhanced: false },
  ]));
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // event / bulk orders management
  const [eventOrders, setEventOrders] = useState(() => storage.get("vendor_events", eventOrdersMock));

  // hygiene & safety
  const [hygiene, setHygiene] = useState(() => storage.get("vendor_hygiene", hygieneChecklistTemplate.map((t) => ({ ...t, checked: t.mandatory ? true : false }))));

  // marketing & flyers (mock)
  const [flyers, setFlyers] = useState(() => storage.get("vendor_flyers", [
    { id: uid("f-"), title: "Weekend Paneer Fest", createdAt: Date.now() - 1000 * 60 * 60 * 24, active: true },
  ]));

  // quick support messages (demo)
  const [messages, setMessages] = useState(() => storage.get("vendor_messages", [
    { id: uid("m-"), from: "Support", text: "Welcome to Agora Vendor Portal — need help setting payouts?", at: Date.now() - 1000 * 60 * 60 * 24 },
  ]));

  // leaderboard & health-score
  const [leaderboard] = useState([
    { name: "Spice Hub", score: 92 },
    { name: "Tasty Corner", score: 88 },
    { name: "Green Salads", score: 84 },
  ]);
  const vendorHealth = useMemo(() => {
    const hygieneScore = Math.round((hygiene.filter(h => h.checked).length / hygiene.length) * 100);
    const salesScore = Math.min(100, dishes.reduce((s, d) => s + d.orders / 10, 0));
    return Math.round((hygieneScore * 0.5) + (salesScore * 0.5));
  }, [hygiene, dishes]);

  // UI states
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDishId, setSelectedDishId] = useState(null);

  // persist demo state to localStorage
  useEffect(() => storage.set("vendor_menu", menu), [menu]);
  useEffect(() => storage.set("vendor_expenses", expenses), [expenses]);
  useEffect(() => storage.set("vendor_prep_schedule", prepSchedule), [prepSchedule]);
  useEffect(() => storage.set("vendor_suppliers", suppliers), [suppliers]);
  useEffect(() => storage.set("vendor_auto_reorder", autoReorderRules), [autoReorderRules]);
  useEffect(() => storage.set("vendor_photos", photoQueue), [photoQueue]);
  useEffect(() => storage.set("vendor_events", eventOrders), [eventOrders]);
  useEffect(() => storage.set("vendor_hygiene", hygiene), [hygiene]);
  useEffect(() => storage.set("vendor_flyers", flyers), [flyers]);
  useEffect(() => storage.set("vendor_messages", messages), [messages]);

  // derived financials
  const revenue = useMemo(() => sales.reduce((s, p) => s + (p.sales || 0), 0), [sales]);
  const totalCosts = useMemo(() => menu.reduce((s, m) => s + (m.cost || 0), 0) + expenses.reduce((s, e) => s + e.amount, 0), [menu, expenses]);
  const grossProfit = revenue - totalCosts;

  // ---------- Actions & small features ----------

  // Add new menu dish
  function addDish() {
    if (!newDishName.trim()) return;
    const newDish = { id: uid("d-"), name: newDishName.trim(), price: Number(newDishPrice || 150), cost: Math.round((Number(newDishPrice || 150) * 0.4)), available: true, photo: null };
    setMenu((m) => [newDish, ...m]);
    setNewDishName("");
    setNewDishPrice(150);
  }

  // Toggle availability
  function toggleDishAvailability(id) {
    setMenu((m) => m.map((d) => d.id === id ? { ...d, available: !d.available } : d));
  }

  // Suggest price for a dish based on demand/cost (smart pricing demo)
  function smartPriceSuggestion(dish) {
    // mock: suggested price = cost * markup + demand premium
    const markup = 1.6;
    const demandPremium = (dish.orders || 100) > 250 ? 1.08 : 1.0;
    const suggested = Math.round((dish.cost || 50) * markup * demandPremium);
    return suggested;
  }

  // Add expense
  function addExpense(type, amount) {
    const e = { id: uid("e-"), date: new Date().toISOString().slice(0, 10), type, amount: Number(amount) };
    setExpenses((arr) => [e, ...arr]);
  }

  // Add prep schedule item
  function addPrepTask(task, time, durationMins) {
    if (!task) return;
    setPrepSchedule((s) => [{ id: uid("s-"), task, time, durationMins: Number(durationMins) }, ...s]);
  }

  // Toggle hygiene checklist
  function toggleHygiene(id) {
    setHygiene((h) => h.map((x) => x.id === id ? { ...x, checked: !x.checked } : x));
  }

  // Mock "enhance" photo
  function enhancePhoto(photoId) {
    setPhotoQueue((q) => q.map((p) => p.id === photoId ? { ...p, enhanced: true } : p));
    setSelectedPhoto(null);
    alert("Photo enhanced with demo AI filters (mock).");
  }

  // Create flyer
  function createFlyer(title) {
    const f = { id: uid("f-"), title, createdAt: Date.now(), active: true };
    setFlyers((arr) => [f, ...arr]);
  }

  // Send message (support)
  function sendMessage(text) {
    if (!text || !text.trim()) return;
    setMessages((m) => [{ id: uid("m-"), from: vendor.name, text: text.trim(), at: Date.now() }, ...m]);
  }

  // Add auto reorder rule
  function addAutoReorder(ingredient, threshold, unit, supplierId, qty) {
    setAutoReorderRules((r) => [{ id: uid("ar-"), ingredient, threshold: Number(threshold), unit, supplierId, qty: Number(qty) }, ...r]);
  }

  // Create event order
  function addEventOrder(client, date, items, estRevenue) {
    const e = { id: uid("EV-"), client, date, items: Number(items), status: "Quote sent", estRevenue: Number(estRevenue) };
    setEventOrders((arr) => [e, ...arr]);
  }

  // Quick payout mock
  function requestPayout(amount) {
    alert(`Payout of ${currency(amount)} requested (demo).`);
  }

  // Add supplier
  function addSupplier(name, leadDays, contact, preferred = false) {
    setSuppliers(s => [{ id: uid("s-"), name, leadDays: Number(leadDays), contact, preferred }, ...s]);
  }

  // Delete flyer
  function deleteFlyer(id) {
    setFlyers(prev => prev.filter(f => f.id !== id));
  }

  // Delete photo
  function deletePhoto(id) {
    setPhotoQueue(prev => prev.filter(p => p.id !== id));
    if (selectedPhoto?.id === id) setSelectedPhoto(null);
  }

  // ---------- Small UI components ----------
  function Header() {
    return (
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">🍳 {vendor.name} — Product Vendor Dashboard</h1>
          <p className="text-sm text-gray-500">Manage menu, orders, suppliers & analytics</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> <div className="text-sm font-medium">{currency(revenue)}</div>
          </div>
          <button onClick={() => setActiveTab("support")} className="px-3 py-2 rounded-full bg-agoraPink text-white font-medium shadow">Support</button>
        </div>
      </motion.div>
    );
  }

  function TabBar() {
    const tabs = [
      { id: "overview", label: "Overview" },
      { id: "menu", label: "Menu" },
      { id: "kitchen", label: "Kitchen" },
      { id: "suppliers", label: "Suppliers" },
      { id: "photos", label: "Photos" },
      { id: "events", label: "Events" },
      { id: "financials", label: "Financials" },
      { id: "hygiene", label: "Hygiene" },
      { id: "marketing", label: "Marketing" },
      { id: "support", label: "Support" },
      { id: "settings", label: "Settings" },
    ];
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium ${activeTab === t.id ? "bg-agoraTeal text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}>
            {t.label}
          </button>
        ))}
      </div>
    );
  }

  function KPIcards() {
    // quick KPIs
    const totalOrders = dishes.reduce((s, d) => s + (d.orders || 0), 0);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="text-xs text-gray-500">This week sales</div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-lg font-semibold">{currency(revenue)}</div>
              <div className="text-sm text-gray-500">Net revenue</div>
            </div>
            <TrendingUp className="w-6 h-6 text-agoraTeal" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="text-xs text-gray-500">Orders</div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-lg font-semibold">{totalOrders}</div>
              <div className="text-sm text-gray-500">Total items sold</div>
            </div>
            <ShoppingCart className="w-6 h-6 text-agoraPink" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="text-xs text-gray-500">Vendor Health</div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-lg font-semibold">{vendorHealth}%</div>
              <div className="text-sm text-gray-500">Hygiene & performance</div>
            </div>
            <ShieldCheck className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>
    );
  }

  function SalesChartCard() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Sales this week</div>
          <div className="text-xs text-gray-500">Trends & peak hours</div>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sales}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  function TopDishesCard() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Top dishes & suggestions</div>
          <div className="text-xs text-gray-500">Smart pricing & stock</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={dishes} dataKey="orders" nameKey="name" outerRadius={60} innerRadius={30}>
                  {dishes.map((_, i) => <Cell key={i} fill={["#14b8a6", "#f472b6", "#f59e0b", "#60a5fa"][i % 4]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {dishes.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-gray-500">Orders: {d.orders} • Cost: {currency(d.cost)}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{currency(d.price)}</div>
                  <div className="text-xs text-gray-500 mt-1">Suggested: <span className="font-medium">{currency(smartPriceSuggestion(d))}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function KitchenScheduleCard() {
    const [task, setTask] = useState("");
    const [time, setTime] = useState("09:00");
    const [duration, setDuration] = useState(30);

    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Kitchen Timetable & Prep Scheduler</div>
          <div className="text-xs text-gray-500">Keep cooks in sync</div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input placeholder="Task (e.g. Prep base)" value={task} onChange={(e) => setTask(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-28" />
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-28" />
            <button onClick={() => { addPrepTask(task || "General prep", time, duration || 30); setTask(""); }} className="px-3 py-2 rounded bg-agoraTeal text-black">Add</button>
          </div>

          <div className="space-y-1">
            {prepSchedule.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium">{p.task}</div>
                  <div className="text-xs text-gray-500">{p.time} • {p.durationMins} mins</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPrepSchedule(prev => prev.filter(x => x.id !== p.id))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function SuppliersCard() {
    const [ingredient, setIngredient] = useState("");
    const [threshold, setThreshold] = useState(2);
    const [qty, setQty] = useState(10);
    const [unit, setUnit] = useState("kg");
    const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
    const [sName, setSName] = useState("");
    const [sLead, setSLead] = useState(2);
    const [sContact, setSContact] = useState("");
    const [sPreferred, setSPreferred] = useState(false);

    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Suppliers & Auto-Reorder</div>
          <div className="text-xs text-gray-500">Manage procurement</div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-500">Suppliers</div>
              <div className="space-y-2 mt-2">
                {suppliers.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">Lead {s.leadDays}d • {s.contact}</div>
                    </div>
                    <div className="text-sm">{s.preferred ? "Preferred" : ""}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-2">
                <div className="text-xs text-gray-500">Add supplier</div>
                <div className="flex gap-2 mt-2">
                  <input value={sName} onChange={e => setSName(e.target.value)} placeholder="Name" className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
                  <input type="number" value={sLead} onChange={e => setSLead(Number(e.target.value))} placeholder="Lead days" className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-28" />
                </div>
                <div className="flex gap-2 mt-2">
                  <input value={sContact} onChange={e => setSContact(e.target.value)} placeholder="Contact" className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={sPreferred} onChange={e => setSPreferred(e.target.checked)} />
                    Preferred
                  </label>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { if (!sName) return alert("Enter name"); addSupplier(sName, sLead, sContact, sPreferred); setSName(""); setSContact(""); setSPreferred(false); }} className="px-3 py-2 rounded bg-agoraTeal text-black">Add supplier</button>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Auto Reorder Rule</div>
              <div className="flex gap-2 items-center mt-2">
                <input placeholder="Ingredient" value={ingredient} onChange={e => setIngredient(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
                <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-24" />
                <select value={unit} onChange={e => setUnit(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">
                  <option>kg</option>
                  <option>pcs</option>
                  <option>L</option>
                </select>
              </div>
              <div className="flex gap-2 items-center mt-2">
                <select value={supplierId} onChange={e => setSupplierId(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1">
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input type="number" value={qty} onChange={e => setQty(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-28" />
                <button onClick={() => { addAutoReorder(ingredient || "Ingredient", threshold, unit, supplierId, qty); setIngredient(""); }} className="px-3 py-2 rounded bg-agoraTeal text-black">Add</button>
              </div>

              <div className="mt-3 space-y-2">
                {autoReorderRules.map(r => {
                  const s = suppliers.find(x => x.id === r.supplierId) || {};
                  return (
                    <div key={r.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <div>
                        <div className="font-medium">{r.ingredient} • {r.qty}{r.unit}</div>
                        <div className="text-xs text-gray-500">Threshold: {r.threshold}{r.unit} • Supplier: {s.name || "—"}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setAutoReorderRules(prev => prev.filter(x => x.id !== r.id))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Remove</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function FoodPhotoHub() {
    const [newFileName, setNewFileName] = useState("");
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Food Photography Hub</div>
          <div className="text-xs text-gray-500">Mock AI enhancer</div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input placeholder="Filename (e.g. biryani.jpg)" value={newFileName} onChange={(e) => setNewFileName(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
            <button onClick={() => { if (!newFileName) return alert("Enter filename (demo)"); setPhotoQueue(q => [{ id: uid("p-"), dishId: menu[0]?.id || null, filename: newFileName, enhanced: false }, ...q]); setNewFileName(""); }} className="px-3 py-2 rounded bg-agoraPink text-white">Upload</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {photoQueue.map(p => (
              <div key={p.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center">
                <div className="w-full h-20 rounded bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xs">
                  {p.enhanced ? "Enhanced preview" : p.filename}
                </div>
                <div className="mt-2 w-full flex justify-between text-xs">
                  <button onClick={() => setSelectedPhoto(p)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Preview</button>
                  <button onClick={() => enhancePhoto(p.id)} className={`px-2 py-1 rounded ${p.enhanced ? "bg-gray-100 dark:bg-gray-700" : "bg-agoraTeal text-black"}`}>Enhance</button>
                </div>
                <div className="mt-2 w-full text-xs flex justify-between">
                  <button onClick={() => deletePhoto(p.id)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Delete</button>
                  <button onClick={() => alert("Download (demo)")} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Download</button>
                </div>
              </div>
            ))}
          </div>

          {selectedPhoto && (
            <div className="mt-3 p-3 rounded bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Preview: {selectedPhoto.filename}</div>
                  <div className="text-xs text-gray-500">Dish: {menu.find(m => m.id === selectedPhoto.dishId)?.name || "—"}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => enhancePhoto(selectedPhoto.id)} className="px-3 py-1 rounded bg-agoraTeal text-black">Enhance</button>
                  <button onClick={() => setSelectedPhoto(null)} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function EventsManager() {
    const [client, setClient] = useState("");
    const [date, setDate] = useState("");
    const [items, setItems] = useState(10);
    const [estRevenue, setEstRevenue] = useState(10000);

    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Bulk & Event Order Manager</div>
          <div className="text-xs text-gray-500">Quotes & booking status</div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <input placeholder="Client name" value={client} onChange={e => setClient(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800" />
            <input type="number" value={items} onChange={e => setItems(Number(e.target.value))} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-28" />
            <input type="number" value={estRevenue} onChange={e => setEstRevenue(Number(e.target.value))} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-36" />
            <button onClick={() => { addEventOrder(client || "Client", date || new Date().toISOString().slice(0, 10), items, estRevenue); setClient(""); setDate(""); }} className="px-3 py-2 rounded bg-agoraPink text-white">Create</button>
          </div>

          <div className="space-y-2 mt-3">
            {eventOrders.map(ev => (
              <div key={ev.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                <div>
                  <div className="font-medium">{ev.client} • {ev.items} items</div>
                  <div className="text-xs text-gray-500">{ev.date} • {ev.status}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{currency(ev.estRevenue)}</div>
                  <div className="mt-2 flex gap-2 justify-end">
                    <button onClick={() => setEventOrders(prev => prev.map(x => x.id === ev.id ? { ...x, status: ev.status === "Confirmed" ? "Completed" : "Confirmed" } : x))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Toggle</button>
                    <button onClick={() => setEventOrders(prev => prev.filter(x => x.id !== ev.id))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function FinancialsCard() {
    const [eType, setEType] = useState("");
    const [eAmount, setEAmount] = useState(0);
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Expense vs Profit Analytics</div>
          <div className="text-xs text-gray-500">Track & manage costs</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sales}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="sales" stroke="#14b8a6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Total revenue</div>
                <div className="font-semibold">{currency(revenue)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Total costs (menu + expenses)</div>
                <div className="font-semibold">{currency(totalCosts)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Gross profit</div>
                <div className={`font-semibold ${grossProfit < 0 ? "text-red-500" : "text-green-600"}`}>{currency(grossProfit)}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-2">Expenses history</div>
              <div className="space-y-2 max-h-48 overflow-auto">
                {expenses.map(ex => (
                  <div key={ex.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-medium">{ex.type}</div>
                      <div className="text-xs text-gray-500">{ex.date}</div>
                    </div>
                    <div className="font-semibold">{currency(ex.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Add expense</div>
            <div className="mt-2 space-y-2">
              <input placeholder="Type (Groceries)" value={eType} onChange={e => setEType(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-full" />
              <input type="number" placeholder="Amount" value={eAmount} onChange={e => setEAmount(Number(e.target.value))} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-full" />
              <button onClick={() => { addExpense(eType || "Misc", eAmount || 0); setEType(""); setEAmount(0); }} className="px-3 py-2 rounded bg-agoraTeal text-black w-full">Add expense</button>
              <button onClick={() => alert("Export finances (demo)")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 w-full">Export CSV</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function DeliveryBenchmarkCard() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Delivery Time Tracking vs Competitors</div>
          <div className="text-xs text-gray-500">Improve dispatch</div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competitorDelivery}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgMins" fill="#f472b6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-sm text-gray-500">Aim for under 30 minutes to stay competitive.</div>
      </div>
    );
  }

  function HygieneCard() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Food Safety & Hygiene</div>
          <div className="text-xs text-gray-500">Daily checklist</div>
        </div>

        <div className="space-y-2">
          {hygiene.map(h => (
            <div key={h.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
              <div>
                <div className="font-medium">{h.title}</div>
                <div className="text-xs text-gray-500">{h.mandatory ? "Mandatory" : "Recommended"}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className={`px-2 py-1 rounded ${h.checked ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{h.checked ? "Checked" : "Pending"}</div>
                <button onClick={() => toggleHygiene(h.id)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Toggle</button>
              </div>
            </div>
          ))}
          <div className="text-xs text-gray-500">Last audit: 2025-07-12 (demo)</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => alert("Export checklist (demo)")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Export</button>
            <button onClick={() => alert("Open compliance docs (demo)")} className="px-3 py-2 rounded bg-agoraPink text-white">View docs</button>
          </div>
        </div>
      </div>
    );
  }

  function MarketingPanel() {
    const [title, setTitle] = useState("");
    const [campaignName, setCampaignName] = useState("");
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Marketing Tools</div>
          <div className="text-xs text-gray-500">Create flyers & promos</div>
        </div>

        <div className="flex gap-2">
          <input placeholder="Promo title" value={title} onChange={e => setTitle(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
          <button onClick={() => { createFlyer(title || "Untitled Promo"); setTitle(""); }} className="px-3 py-2 rounded bg-agoraTeal text-black">Create</button>
        </div>

        <div className="mt-3 space-y-2">
          {flyers.map(f => (
            <div key={f.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
              <div>
                <div className="font-medium">{f.title}</div>
                <div className="text-xs text-gray-500">Created: {new Date(f.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setFlyers(prev => prev.map(x => x.id === f.id ? { ...x, active: !x.active } : x))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">{f.active ? "Deactivate" : "Activate"}</button>
                <button onClick={() => alert("Share promo (demo)")} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Share</button>
                <button onClick={() => deleteFlyer(f.id)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2">Campaign (mock AI generator)</div>
          <div className="flex gap-2">
            <input placeholder="Campaign name" value={campaignName} onChange={e => setCampaignName(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
            <button onClick={() => { alert(`Campaign "${campaignName || "Weekend Promo"}" generated (demo)`); setCampaignName(""); }} className="px-3 py-2 rounded bg-agoraPink text-white">Generate</button>
          </div>
        </div>
      </div>
    );
  }

  function SupportPanel() {
    const [text, setText] = useState("");
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Vendor Support Helpdesk</div>
          <div className="text-xs text-gray-500">Raise issues • Chat</div>
        </div>

        <div className="space-y-2">
          <div className="max-h-48 overflow-auto space-y-2">
            {messages.map(m => (
              <div key={m.id} className="p-2 rounded bg-gray-50 dark:bg-gray-800">
                <div className="text-xs text-gray-500">{m.from} • {new Date(m.at || Date.now()).toLocaleString()}</div>
                <div className="mt-1">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write to support..." className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
            <button onClick={() => { sendMessage(text); setText(""); }} className="px-3 py-2 rounded bg-agoraPink text-white">Send</button>
          </div>
        </div>
      </div>
    );
  }

  function QuickActions() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="font-semibold mb-3">Quick Actions</div>
        <div className="flex flex-col gap-2">
          <button onClick={() => requestPayout(2500)} className="px-3 py-2 rounded bg-agoraTeal text-black flex items-center justify-between"><span>Request Payout</span> <span className="text-sm font-semibold">{currency(2500)}</span></button>
          <button onClick={() => alert("Open orders list (demo)")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">View live orders</button>
          <button onClick={() => alert("Open reports (demo)")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Download report</button>
          <button onClick={() => alert("Open settings (demo)")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Profile & payout settings</button>
        </div>
      </div>
    );
  }

  function LeaderboardCard() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="font-semibold mb-3">Vendor Leaderboard</div>
        <div className="space-y-2">
          {leaderboard.map((l, idx) => (
            <div key={l.name} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-agoraTeal flex items-center justify-center text-white font-bold">{idx + 1}</div>
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs text-gray-500">Score {l.score}</div>
                </div>
              </div>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------- Layout render (Tabbed) ----------
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Header />
      <TabBar />

      {/* Overview: main dashboard */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2 space-y-4">
            <KPIcards />
            <SalesChartCard />
            <div className="grid-cols-1 md:grid-cols-2 gap-4">
              <TopDishesCard />
              <DeliveryBenchmarkCard />
            </div>

            <div className=" grid-cols-1 lg:grid-cols-3 gap-4">
              <KitchenScheduleCard />
              <SuppliersCard />
              <FoodPhotoHub />
            </div>

            <div className=" grid-cols-1 lg:grid-cols-2 gap-4">
              <EventsManager />
              <FinancialsCard />
            </div>
          </main>

          <aside className="space-y-4">
            <QuickActions />
            <LeaderboardCard />
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Payout Insights</div>
              <div className="text-sm text-gray-500">Last payout: 2025-08-25 • Next: 2025-09-01</div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Pending payouts</div>
                  <div className="font-semibold">{currency(12500)}</div>
                </div>
                <div>
                  <button onClick={() => requestPayout(12500)} className="px-3 py-2 rounded bg-agoraPink text-white">Request</button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Sustainability</div>
              <div className="text-xs text-gray-500">Badges & eco score</div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Reusable Packaging</div>
                    <div className="text-xs text-gray-500">Active • Bonus rewards</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Support & Docs</div>
              <div className="text-xs text-gray-500">Guides and training</div>
              <div className="mt-2 space-y-2">
                <button onClick={() => alert("Open food safety guide (demo)")} className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-left">Food safety guide</button>
                <button onClick={() => alert("Open marketing guide (demo)")} className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-left">Marketing tips</button>
                <button onClick={() => alert("Open payouts docs (demo)")} className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-left">Payout docs</button>
              </div>
            </div>
            <HygieneCard />
            <MarketingPanel />
            <SupportPanel />
          </aside>
        </div>
      )}

      {/* Menu tab: expanded menu manager */}
      {activeTab === "menu" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">Menu & Pricing</div>
                  <div className="text-xs text-gray-500">Manage dishes, photos & pricing</div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input value={newDishName} onChange={e => setNewDishName(e.target.value)} placeholder="New dish name" className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
                    <input type="number" value={newDishPrice} onChange={e => setNewDishPrice(Number(e.target.value))} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-36" />
                    <button onClick={addDish} className="px-3 py-2 rounded bg-agoraTeal text-black">Add dish</button>
                  </div>

                  <div className="max-h-96 overflow-auto space-y-2">
                    {menu.map(d => (
                      <div key={d.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                        <div>
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-gray-500">Price: {currency(d.price)} • Cost: {currency(d.cost)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">{d.available ? <span className="text-green-600">Available</span> : <span className="text-red-500">Hidden</span>}</div>
                          <button onClick={() => toggleDishAvailability(d.id)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Toggle</button>
                          <button onClick={() => { setSelectedDishId(d.id); setActiveTab("photos"); }} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Photos</button>
                          <button onClick={() => { const suggested = smartPriceSuggestion(d); setMenu(prev => prev.map(md => md.id === d.id ? { ...md, price: suggested } : md)); }} className="px-2 py-1 rounded bg-agoraPink text-white text-xs">Apply suggested</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
                <div className="font-semibold mb-2">Pricing Insights</div>
                <div className="text-xs text-gray-500">Smart suggestions based on demand (mock)</div>
                <div className="mt-3 space-y-2">
                  {dishes.map(d => (
                    <div key={d.name} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                      <div>
                        <div className="font-medium">{d.name}</div>
                        <div className="text-xs text-gray-500">Orders: {d.orders}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{currency(d.price)}</div>
                        <div className="text-xs">Suggested: {currency(smartPriceSuggestion(d))}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <button onClick={() => alert("Bulk price update (demo)")} className="px-3 py-2 rounded bg-agoraTeal text-black w-full">Bulk update</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Kitchen tab */}
      {activeTab === "kitchen" && (
        <div>
          <KitchenScheduleCard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-3">Open tasks</div>
              <div className="space-y-2">
                {prepSchedule.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-medium">{p.task}</div>
                      <div className="text-xs text-gray-500">{p.time} • {p.durationMins} mins</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setPrepSchedule(prev => prev.filter(x => x.id !== p.id))} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Mark done</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-3">Kitchen notes</div>
              <div className="text-xs text-gray-500">Share with your team (demo)</div>
              <textarea className="w-full mt-2 p-2 rounded bg-gray-50 dark:bg-gray-800 h-32" placeholder="Notes for the day..."></textarea>
              <div className="mt-2 flex gap-2">
                <button onClick={() => alert("Saved (demo)")} className="px-3 py-2 rounded bg-agoraTeal text-black">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers tab */}
      {activeTab === "suppliers" && (
        <div>
          <SuppliersCard />
        </div>
      )}

      {/* Photos tab */}
      {activeTab === "photos" && (
        <div>
          <FoodPhotoHub />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Photo Queue</div>
              <div className="text-xs text-gray-500">Manage and enhance food photos</div>
              <div className="mt-3 space-y-2">
                {photoQueue.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-medium">{p.filename}</div>
                      <div className="text-xs text-gray-500">{p.enhanced ? "Enhanced" : "Raw"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => enhancePhoto(p.id)} className="px-2 py-1 rounded bg-agoraTeal text-black text-xs">Enhance</button>
                      <button onClick={() => deletePhoto(p.id)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Selected Dish</div>
              <div className="text-xs text-gray-500">Quick link to dish photos</div>
              <div className="mt-3">
                <div className="text-sm">{menu.find(m => m.id === selectedDishId)?.name || "Select a dish from Menu to link photos"}</div>
                <div className="mt-3">
                  <button onClick={() => alert("Batch enhance (demo)")} className="px-3 py-2 rounded bg-agoraPink text-white">Batch enhance</button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
              <div className="font-semibold mb-2">Photo Tips</div>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Use natural light where possible</li>
                <li>• Show portion size in the frame</li>
                <li>• Use simple backgrounds</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Events tab */}
      {activeTab === "events" && (
        <div>
          <EventsManager />
        </div>
      )}

      {/* Financials tab */}
      {activeTab === "financials" && (
        <div>
          <FinancialsCard />
        </div>
      )}

      {/* Hygiene tab */}
      {activeTab === "hygiene" && (
        <div>
          <HygieneCard />
        </div>
      )}

      {/* Marketing tab */}
      {activeTab === "marketing" && (
        <div>
          <MarketingPanel />
        </div>
      )}

      {/* Support tab */}
      {activeTab === "support" && (
        <div>
          <SupportPanel />
        </div>
      )}

      {/* Settings tab */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-2">Profile</div>
            <div className="text-sm">{vendor.name} • {vendor.city}</div>
            <div className="mt-3">
              <button onClick={() => alert("Update profile (demo)")} className="px-3 py-2 rounded bg-agoraTeal text-black">Edit profile</button>
            </div>
          </div>

          <div className="space-y-4">
            <QuickActions />
            <LeaderboardCard />
          </div>
        </div>
      )}
    </div>
  );
}
