// src/pages/customer/CustomerDashboard.jsx
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
} from "recharts";
import {
  Search,
  ShoppingCart,
  Clock,
  MapPin,
  Bell,
  Gift,
  Wallet,
  DollarSign,
  Star,
  User,
  Play,
  Mic,
  CheckSquare,
  Calendar,
  ShieldCheck,
  Repeat,
  Layers,
  Leaf,
  Settings,
} from "lucide-react";

/**
 * CustomerDashboard.jsx
 *
 * Full-featured demo customer dashboard.
 * - Preserves the demo/mock logic from your original file
 * - Improves alignment, spacing and responsiveness
 * - Keeps all panels, charts, voice assistant, scheduling, offline queue, etc.
 *
 * Drop into your project replacing the previous file. No external API calls.
 */

/* ---------------------------
   Mock / initial data
   --------------------------- */
const MOCK_ORDERS = [
  {
    id: "ORD-1005",
    status: "On the way",
    etaMinutes: 18,
    vendor: "Spice Hub",
    total: 420,
    items: [
      { name: "Chicken Biryani", qty: 1, kcal: 950 },
      { name: "Raita", qty: 1, kcal: 60 },
    ],
    location: { x: 140, y: 70 }, // mock svg coords
    placedAt: Date.now() - 1000 * 60 * 28,
  },
  {
    id: "ORD-1004",
    status: "Delivered",
    etaMinutes: 0,
    vendor: "Green Salads",
    total: 320,
    items: [{ name: "Caesar Salad", qty: 1, kcal: 420 }],
    location: { x: 40, y: 90 },
    placedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];

const SPENDING_SERIES = [
  { date: "Aug 1", spend: 450 },
  { date: "Aug 5", spend: 320 },
  { date: "Aug 9", spend: 600 },
  { date: "Aug 13", spend: 280 },
  { date: "Aug 17", spend: 720 },
  { date: "Aug 21", spend: 540 },
  { date: "Aug 25", spend: 330 },
];

const RECOMMENDATIONS = [
  { id: "r1", title: "Paneer Butter Masala", vendor: "HomeChef", price: 220, kcal: 650 },
  { id: "r2", title: "Organic Detergent (2kg)", vendor: "CleanCo", price: 420, kcal: 0 },
  { id: "r3", title: "Electrician - 1 hr", vendor: "QuickFix", price: 600, kcal: 0 },
  { id: "r4", title: "Protein Smoothie", vendor: "FitBar", price: 180, kcal: 320 },
];

const REWARDS = { points: 1240, cashback: 210.5, tier: "Gold" };

const PIE_COLORS = ["#14b8a6", "#f472b6", "#f59e0b", "#60a5fa"];

/* ---------------------------
   Helpers & Storage wrapper
   --------------------------- */
const formatCurrency = (n) => `₹${Math.round(n)}`;

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {}
  },
};

/* ---------------------------
   Main Component
   --------------------------- */
export default function CustomerDashboard() {
  // user
  const [user] = useState(() => storage.get("demo_profile", { name: "Deepak", id: "u-1001" }));

  // state slices (persisted)
  const [orders, setOrders] = useState(() => storage.get("demo_orders", MOCK_ORDERS));
  const [offlineQueue, setOfflineQueue] = useState(() => storage.get("demo_offline_queue", []));
  const [schedules, setSchedules] = useState(() => storage.get("demo_schedules", []));
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS);
  const [rewards, setRewards] = useState(() => storage.get("demo_rewards", REWARDS));
  const [chat, setChat] = useState(() =>
    storage.get("demo_chat", [{ from: "assistant", text: "Hi Deepak 👋 — I can help re-order favorites, set reminders, or find deals. Try: 'Reorder biryani'." }])
  );
  const [chatInput, setChatInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const [spendSeries] = useState(SPENDING_SERIES);
  const [wallet, setWallet] = useState(() => storage.get("demo_wallet", { balance: 4239.5, bnplActive: false, bnplAmount: 0 }));
  const [greenMode, setGreenMode] = useState(() => storage.get("demo_green", true));
  const [friends] = useState([{ id: "f1", name: "Prsath" }, { id: "f2", name: "Dharaneesh" }]);
  const [livestreamActive, setLivestreamActive] = useState(false);

  // UI states
  const [selectedTab, setSelectedTab] = useState("overview");
  const [filterMood, setFilterMood] = useState("Hungry");
  const [insightIndex, setInsightIndex] = useState(0);

  // persist
  useEffect(() => storage.set("demo_orders", orders), [orders]);
  useEffect(() => storage.set("demo_offline_queue", offlineQueue), [offlineQueue]);
  useEffect(() => storage.set("demo_schedules", schedules), [schedules]);
  useEffect(() => storage.set("demo_rewards", rewards), [rewards]);
  useEffect(() => storage.set("demo_chat", chat), [chat]);
  useEffect(() => storage.set("demo_wallet", wallet), [wallet]);
  useEffect(() => storage.set("demo_green", greenMode), [greenMode]);

  // rotating insights
  const INSIGHTS = [
    "You save ₹320 this month using cashback — keep choosing eco packaging for bonus rewards.",
    "Your average delivery ETA is 22 minutes. Try orders after 8 pm for faster delivery.",
    "Repeat rate for Paneer dishes is 34% — add to favorites for one-tap reorder.",
    "You avoided 2.1kg CO₂ by choosing a shared delivery last month.",
  ];
  useEffect(() => {
    const t = setInterval(() => setInsightIndex((i) => (i + 1) % INSIGHTS.length), 7000);
    return () => clearInterval(t);
  }, []);

  // computed
  const lifetimeSpend = useMemo(() => spendSeries.reduce((s, p) => s + p.spend, 0), [spendSeries]);
  const totalOrders = orders.length;

  /* ---------------------------
     Demo order placement (keeps existing behavior)
     --------------------------- */
  function placeOrderMock(order) {
    if (!navigator.onLine) {
      const q = [{ ...order, id: uid("Q-"), queuedAt: Date.now() }, ...offlineQueue];
      setOfflineQueue(q);
      alert("You're offline — order queued and will submit when back online (demo)");
      return;
    }

    const newOrder = {
      id: uid("ORD-"),
      status: "Preparing",
      etaMinutes: Math.round(20 + Math.random() * 25),
      vendor: order.vendor || "DemoVendor",
      total: order.total || 199,
      items: order.items || [{ name: "Demo Item", qty: 1, kcal: 400 }],
      location: { x: 20 + Math.random() * 260, y: 20 + Math.random() * 110 },
      placedAt: Date.now(),
    };
    setOrders((o) => [newOrder, ...o]);
    setRewards((r) => ({ ...r, cashback: (r.cashback || 0) + Math.round(newOrder.total * 0.03) }));
  }

  // flush offline queue when back online (demo)
  useEffect(() => {
    function tryFlush() {
      if (navigator.onLine && offlineQueue.length) {
        setOrders((o) => [
          ...offlineQueue.map((q) => ({ ...q, id: uid("ORD-"), status: "Preparing", etaMinutes: 30 })),
          ...o,
        ]);
        setOfflineQueue([]);
        alert("Offline orders submitted (demo).");
      }
    }
    window.addEventListener("online", tryFlush);
    tryFlush();
    return () => window.removeEventListener("online", tryFlush);
  }, [offlineQueue]);

  // auto-reorder scheduler runner (demo)
  useEffect(() => {
    if (!schedules || !schedules.length) return;
    const id = setInterval(() => {
      const now = new Date();
      schedules.forEach((s) => {
        const [h, m] = s.time.split(":").map(Number);
        if (now.getHours() === h && now.getMinutes() === m && !s.lastTriggeredAt) {
          placeOrderMock({ vendor: s.vendor, total: s.total, items: s.items });
          setSchedules((arr) => arr.map((x) => (x.id === s.id ? { ...x, lastTriggeredAt: Date.now() } : x)));
        }
      });
    }, 30 * 1000);
    return () => clearInterval(id);
  }, [schedules]);

  /* ---------------------------
     Voice recognition (demo)
     --------------------------- */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.lang = "en-IN";
    recog.interimResults = false;
    recog.onresult = (e) => {
      const text = e.results[0][0].transcript;
      handleChatSubmit(text, { fromVoice: true });
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    recognitionRef.current = recog;

    return () => {
      try {
        recog.onresult = null;
        recog.onend = null;
      } catch {}
    };
  }, []);

  function toggleVoiceListen() {
    if (!recognitionRef.current) {
      alert("Voice recognition not supported in this browser (demo).");
      return;
    }
    if (!listening) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    } else {
      recognitionRef.current.stop();
      setListening(false);
    }
  }

  /* ---------------------------
     Simple "AI" assistant (mock)
     --------------------------- */
  function handleChatSubmit(text, opts = {}) {
    if (!text || !text.trim()) return;
    const userMsg = { from: "user", text, ts: Date.now() };
    setChat((c) => [...c, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const lc = text.toLowerCase();
      let reply = "Sorry, I didn't get that. Try 'reorder', 'schedule', or 'find biryani'.";
      if (lc.includes("reorder") || lc.includes("order again") || lc.includes("one-tap")) {
        const last = orders[0];
        if (last) {
          placeOrderMock({ vendor: last.vendor, total: last.total, items: last.items });
          reply = `Placed a reorder for your last order (${last.id}) — ETA ~${last.etaMinutes || 30} mins (demo).`;
        } else {
          reply = "You have no previous orders to reorder (demo).";
        }
      } else if (lc.includes("recommend") || lc.includes("what should i")) {
        reply = `I recommend: ${recommendations.slice(0, 3).map((r) => r.title).join(", ")}. Want me to add any to cart?`;
      } else if (lc.includes("schedule") || lc.includes("remind")) {
        const sched = {
          id: uid("S-"),
          vendor: "HomeChef",
          items: [{ name: "Paneer Butter Masala", qty: 1 }],
          time: "12:30",
        };
        setSchedules((s) => [sched, ...s]);
        reply = "Scheduled a weekly reorder at 12:30 (demo). You can edit schedules in the Scheduler panel.";
      } else if (lc.includes("balance") || lc.includes("wallet")) {
        reply = `Your wallet balance is ${formatCurrency(wallet.balance)} and cashback ₹${Math.round(rewards.cashback)}.`;
      } else if (lc.includes("eco") || lc.includes("green")) {
        setGreenMode((g) => !g);
        reply = `Eco mode toggled ${!greenMode ? "ON" : "OFF"} (demo).`;
      } else if (lc.includes("apply coupon") || lc.includes("coupon")) {
        reply = "Applied best coupon: SAVE50 (demo). ₹50 saved on next order.";
      } else if (lc.includes("live") || lc.includes("stream")) {
        setLivestreamActive(true);
        reply = "Tuned into the vendor livestream (demo).";
      } else if (lc.includes("help")) {
        reply = "I can reorder, schedule, find deals, toggle eco mode, or show wallet. Try: 'Reorder biryani'.";
      } else {
        const matchFood = ["biryani", "paneer", "salad", "cake", "smoothie"].find((f) => lc.includes(f));
        if (matchFood) {
          reply = `Found ${matchFood} deals near you — average delivery 20-35 mins. Want to order?`;
        } else {
          reply = "Nice! I saved this note to your assistant logs (demo).";
        }
      }

      const replyMsg = { from: "assistant", text: reply, ts: Date.now() };
      setChat((c) => [...c, replyMsg]);

      if (lc.includes("reorder")) {
        setRewards((r) => ({ ...r, points: (r.points || 0) + 5 }));
      }
    }, 800 + Math.random() * 600);
  }

  function toggleBNPL() {
    setWallet((w) => {
      const next = { ...w, bnplActive: !w.bnplActive, bnplAmount: !w.bnplActive ? 1200 : 0 };
      return next;
    });
  }

  function addSchedule({ vendor, time = "12:00", total = 250, items = [] }) {
    const s = { id: uid("S-"), vendor, time, total, items };
    setSchedules((arr) => [s, ...arr]);
  }

  function removeSchedule(id) {
    setSchedules((arr) => arr.filter((s) => s.id !== id));
  }

  function createGroupOrder(friendIds = []) {
    const invite = { id: uid("G-"), host: user.name, friends: friendIds, createdAt: Date.now() };
    alert(`Group order created with ${friendIds.length} friends (demo) — id ${invite.id}`);
  }

  function donateRoundup() {
    const last = orders[0];
    if (!last) {
      alert("No last order to round up (demo).");
      return;
    }
    const roundup = Math.ceil(last.total / 10) * 10 - last.total;
    if (roundup <= 0) {
      alert("No roundup needed.");
      return;
    }
    alert(`Donated ₹${roundup} to charity (demo). Thank you!`);
  }

  function reorder(orderId) {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;
    placeOrderMock({ vendor: ord.vendor, total: ord.total, items: ord.items });
  }

  const caloriesWeek = useMemo(() => {
    const last7 = orders.slice(0, 7);
    return last7.reduce((s, o) => s + (o.items?.reduce((a, it) => a + (it.kcal || 0) * (it.qty || 1), 0) || 0), 0);
  }, [orders]);

  /* ---------------------------
     Small subcomponents (kept inside file for single-file ease)
     - These render panels used in the dashboard
     - Responsive tweaks applied
     --------------------------- */

  function HeaderBar() {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">
            Welcome back, <span className="text-agoraTeal">{user.name}</span>
          </h1>
          <p className="text-sm text-gray-500">Check you dashboard for current trends & updates</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-2">
            <Wallet className="w-4 h-4" /> <div className="text-sm font-medium">{formatCurrency(wallet.balance)}</div>
          </div>

          <div className="flex gap-2 ml-auto md:ml-0">
            <button onClick={() => setSelectedTab("chat")} className="px-3 py-2 rounded-full bg-agoraPink text-white flex items-center gap-2 text-sm">
              <Mic className="w-4 h-4" /> Voice Assistant
            </button>

            <div className="hidden sm:flex items-center px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-sm gap-2">
              <Gift className="w-4 h-4 text-yellow-500" /> <span>{rewards.points} pts</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function OverviewCards() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Next Delivery</div>
              <div className="font-semibold">{orders[0]?.status || "No active orders"}</div>
              <div className="text-sm text-gray-500">{orders[0] ? `ETA ~${orders[0].etaMinutes} mins` : ""}</div>
            </div>
            <MapPin className="w-6 h-6 text-agoraPink" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="text-xs text-gray-500">Rewards</div>
          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="font-semibold text-lg">{rewards.points} pts</div>
              <div className="text-sm text-gray-500">Tier: {rewards.tier}</div>
            </div>
            <Gift className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={() => alert("Redeem flow (demo)")} className="px-3 py-1 rounded bg-agoraTeal text-black text-sm">Redeem</button>
            <button onClick={() => setRewards((r) => ({ ...r, points: r.points + 50 }))} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">+50 pts (demo)</button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="text-xs text-gray-500">Spending (last 30 days)</div>
          <div className="font-semibold text-lg mt-1">{formatCurrency(lifetimeSpend)}</div>
          <div className="text-sm text-gray-500 mt-2">You saved ₹{Math.round(rewards.cashback)} via cashback</div>
        </div>
      </div>
    );
  }

  function SpendingChart() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Spending Overview</div>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendSeries}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="spend" stroke="#14b8a6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  function RecommendationsPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Recommended for you</div>
          <div className="text-xs text-gray-500">Mood: <strong>{filterMood}</strong></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((r) => (
            <div key={r.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-start justify-between">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-gray-500">{r.vendor} • {r.kcal ? `${r.kcal} kcal` : "service"}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(r.price)}</div>
                <div className="mt-2 flex flex-col gap-2">
                  <button onClick={() => placeOrderMock({ vendor: r.vendor, total: r.price, items: [{ name: r.title, qty: 1, kcal: r.kcal }] })} className="px-3 py-1 rounded bg-agoraPink text-black text-sm">Order</button>
                  <button onClick={() => alert("Saved to wishlist (demo)")} className="text-xs text-gray-500">Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function OrdersPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Recent Orders</div>
          <div className="text-xs text-gray-500">{totalOrders} total</div>
        </div>

        {orders.length === 0 ? (
          <div className="text-gray-500">No orders yet — explore the shop.</div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 6).map((o) => (
              <div key={o.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-full sm:w-2/3">
                  <div className="font-medium">{o.vendor} • <span className="text-xs text-gray-500">{o.status}</span></div>
                  <div className="text-xs text-gray-500">{o.items.map((it) => `${it.name} x${it.qty || 1}`).join(", ")}</div>
                  <div className="text-xs text-gray-400 mt-1">Placed: {new Date(o.placedAt).toLocaleString()}</div>
                </div>

                <div className="w-full sm:w-auto text-right mt-3 sm:mt-0">
                  <div className="font-semibold">{formatCurrency(o.total)}</div>
                  <div className="mt-2 flex gap-2 justify-end">
                    <button onClick={() => reorder(o.id)} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Reorder</button>
                    <button onClick={() => alert("Track page (demo)")} className="text-xs underline text-gray-500">Track</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function LiveMap() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Live Orders Map</div>
          <div className="text-xs text-gray-500">Mock locations</div>
        </div>
        <div className="w-full h-48 rounded overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <svg viewBox="0 0 300 150" className="w-full h-full">
            <rect x="0" y="0" width="300" height="150" fill="transparent" />
            {orders.slice(0, 6).map((o, idx) => (
              <g key={o.id} transform={`translate(${o.location?.x || (30 + idx * 40)}, ${(o.location?.y) || (30 + (idx % 3) * 30)})`}>
                <circle r="6" fill={o.status === "Delivered" ? "#a3e635" : "#f472b6"} />
                <text x="10" y="4" fontSize="9" fill="#111">{o.id}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="text-xs text-gray-500 mt-2">ETA predictions use historical data (demo).</div>
      </div>
    );
  }

  function SchedulerPanel() {
    const [vendor, setVendor] = useState("");
    const [time, setTime] = useState("12:30");
    const [total, setTotal] = useState(250);

    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Auto-Reorder Scheduler</div>
          <div className="text-xs text-gray-500">Never run out</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input placeholder="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 flex-1" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800" />
          <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800 w-28" />
          <button onClick={() => { addSchedule({ vendor: vendor || "HomeChef", time, total }); setVendor(""); }} className="px-3 py-2 rounded bg-agoraTeal text-black">Add</button>
        </div>

        <div className="mt-3 space-y-2">
          {schedules.length === 0 ? <div className="text-xs text-gray-500">No schedules yet.</div> : schedules.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">
              <div>
                <div className="font-medium">{s.vendor}</div>
                <div className="text-xs text-gray-500">{s.time} • {formatCurrency(s.total)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => removeSchedule(s.id)} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function WalletPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Wallet & Payments</div>
          <div className="text-xs text-gray-500">{wallet.bnplActive ? `BNPL ₹${wallet.bnplAmount}` : "No BNPL"}</div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-gray-500">Balance</div>
            <div className="font-semibold text-lg">{formatCurrency(wallet.balance)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Cashback</div>
            <div className="font-semibold">{formatCurrency(rewards.cashback)}</div>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => setWallet((w) => ({ ...w, balance: w.balance + 100 }))} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-sm">Top-up</button>
            <button onClick={toggleBNPL} className="px-3 py-1 rounded bg-agoraPink text-white text-sm">{wallet.bnplActive ? "Disable BNPL" : "Enable BNPL"}</button>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">BNPL here is demo only — never enable in production without proper checks.</div>
      </div>
    );
  }

  function ChatPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4 flex flex-col h-[420px]">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Smart Assistant</div>
          <div className="text-xs text-gray-500">AI-powered suggestions (demo)</div>
        </div>

        <div className="flex-1 overflow-auto p-2 space-y-2">
          {chat.map((m, i) => (
            <div key={i} className={`max-w-[80%] p-2 rounded ${m.from === "assistant" ? "bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 self-start" : "bg-agoraTeal text-black self-end"}`}>
              <div className="text-sm">{m.text}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(m.ts || Date.now()).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex gap-2">
          <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask assistant to reorder, schedule, or find deals..." className="flex-1 px-3 py-2 rounded bg-gray-50 dark:bg-gray-800" />
          <button onClick={() => handleChatSubmit(chatInput)} className="px-3 py-2 rounded bg-agoraTeal text-black"><Search className="w-4 h-4 inline" /></button>
          <button onClick={toggleVoiceListen} className={`px-3 py-2 rounded ${listening ? "bg-agoraPink text-white" : "bg-gray-100 dark:bg-gray-800"}`}><Mic className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  function HealthPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Health & Nutrition</div>
          <div className="text-xs text-gray-500">Calories tracked this week</div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-gray-500">Estimated calories</div>
            <div className="text-2xl font-semibold">{caloriesWeek} kcal</div>
            <div className="text-sm text-gray-500">Based on orders (demo)</div>
          </div>
          <div className="ml-auto">
            <button onClick={() => alert("Nutrition plans (demo)")} className="px-3 py-1 rounded bg-agoraTeal text-black">Personal meal plan</button>
          </div>
        </div>
      </div>
    );
  }

  function CommunityPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Social & Group Orders</div>
          <div className="text-xs text-gray-500">Invite friends • Split bills</div>
        </div>
        <div className="flex gap-2 items-center">
          {friends.map((f) => <div key={f.id} className="px-3 py-1 rounded bg-gray-50 dark:bg-gray-800">{f.name}</div>)}
          <div className="ml-auto flex gap-2">
            <button onClick={() => createGroupOrder(friends.map((f) => f.id))} className="px-2 py-1 rounded bg-agoraPink text-white">Start group order</button>
            <button onClick={() => alert("Shared wishlist (demo)")} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700">Wishlist</button>
          </div>
        </div>
      </div>
    );
  }

  function SecurityPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Security & Privacy</div>
          <div className="text-xs text-gray-500">Control sensitive actions</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Two-factor authentication</div>
              <div className="text-xs text-gray-500">Protects your account</div>
            </div>
            <button onClick={() => alert("2FA setup demo")} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700">Setup</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Face/Fingerprint unlock</div>
              <div className="text-xs text-gray-500">Use biometrics for checkout</div>
            </div>
            <button onClick={() => alert("Biometrics demo")} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700">Enable</button>
          </div>
        </div>
      </div>
    );
  }

  function LivestreamPanel() {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Vendor Livestream</div>
          <div className="text-xs text-gray-500">Watch & buy live</div>
        </div>
        {!livestreamActive ? (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 flex items-center justify-between">
            <div>
              <div className="font-medium">No active stream</div>
              <div className="text-xs text-gray-500">When vendors go live you can buy items directly</div>
            </div>
            <div>
              <button onClick={() => setLivestreamActive(true)} className="px-3 py-1 rounded bg-agoraTeal text-black">Mock go live</button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-black text-white p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Chef Live — Tonight 7:00 PM</div>
              <div className="text-xs text-gray-300">Cooking paneer specials • Tap to buy</div>
            </div>
            <div>
              <button onClick={() => alert("Join stream (demo)")} className="px-3 py-1 rounded bg-yellow-400 text-black">Join</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---------------------------
     Main render layout
     - responsive grid: content first, sidebar collapses on small screens
     --------------------------- */
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <HeaderBar />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <OverviewCards />
          <SpendingChart />
          <RecommendationsPanel />
          <SchedulerPanel />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OrdersPanel />
            <LiveMap />
          </div>

          <div className=" grid-cols-1 lg:grid-cols-3 gap-4">
            <ChatPanel />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow  top-6">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Quick Actions</div>
              <Settings className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setSelectedTab("overview")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-left flex items-center gap-2"> <Play className="w-4 h-4" /> Quick reorder</button>
              <button onClick={() => donateRoundup()} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-left flex items-center gap-2"> <Leaf className="w-4 h-4" /> Donate roundup</button>
              <button onClick={() => setGreenMode((g) => !g)} className={`px-3 py-2 rounded ${greenMode ? "bg-agoraTeal text-black" : "bg-gray-100 dark:bg-gray-800 text-left"} flex items-center gap-2`}> <Layers className="w-4 h-4" /> Eco mode</button>
              <button onClick={() => alert("Share app (demo)")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-left flex items-center gap-2"> <User className="w-4 h-4" /> Refer & earn</button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-3">Rewards Summary</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Points</div>
                <div className="font-semibold">{rewards.points}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Cashback</div>
                <div className="font-semibold">{formatCurrency(rewards.cashback)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Tier</div>
                <div className="font-semibold">{rewards.tier}</div>
              </div>
            </div>
            <div className="mt-3">
              <button onClick={() => alert("Redeem flow (demo)")} className="px-3 py-2 rounded bg-agoraTeal text-black w-full">Redeem rewards</button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-3">Eco & Impact</div>
            <div className="text-sm text-gray-500">Carbon saved (month)</div>
            <div className="text-2xl font-semibold mt-1">2.1 kg CO₂</div>
            <div className="mt-3 text-xs text-gray-500">Choose shared delivery & reusable packaging to increase savings.</div>
            <div className="mt-3">
              <button onClick={() => alert("Green choices (demo)")} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 w-full">View green options</button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="font-semibold mb-3">Leaderboard</div>
            <div className="text-xs text-gray-500">Top savers & contributors</div>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between items-center">
                <div>Rhea</div>
                <div className="text-sm text-gray-500">2300 pts</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Vikram</div>
                <div className="text-sm text-gray-500">1800 pts</div>
              </div>
              <div className="flex justify-between items-center">
                <div>{user.name} (you)</div>
                <div className="text-sm text-gray-500">{rewards.points} pts</div>
              </div>
            </div>
          </div>
          <div className=" grid-cols-1 md:grid-cols-3 gap-4">
            <WalletPanel />
            <HealthPanel />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <CommunityPanel />
            <SecurityPanel />
            <LivestreamPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
