// src/pages/delivery/DeliveryDashboard.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MapPin,
  DollarSign,
  ShieldCheck,
  Zap,
  Gift,
  BarChart2,
  Phone,
  Star,
  Play,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  Settings,
  Heart,
  AlertTriangle,
  Download,
} from "lucide-react";
import { useDelivery } from "../../utils/DeliveryContext";

/**
 * DeliveryDashboard.jsx (Upgraded)
 *
 * Full, responsive, and improved UI/UX version of the Delivery Dashboard you
 * provided. Includes the original mock-driven features plus added layout,
 * tabs, accordions, better responsiveness, and small UX touches:
 *
 * - Preserves all original mocks & core logic
 * - Adds Tabs for Orders / Productivity / Notes
 * - Adds an AI Coach panel, Drawer-style
 * - Adds improved Leaderboard card with progress bars
 * - Adds accessibility improvements to interactive elements
 * - Uses framer-motion for subtle transitions
 * - Fully responsive using Tailwind-style classes
 *
 * NOTE: All business logic is mock/demo. Replace with production APIs.
 */

/* ----------------------------- Mock Data ----------------------------- */
function daysAgoLabel(n) {
  const d = new Date(Date.now() - n * 86400000);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const pastDeliveries = [
  { id: "D1001", date: daysAgoLabel(0), earnings: 520, distanceKm: 6 },
  { id: "D1000", date: daysAgoLabel(1), earnings: 430, distanceKm: 4.2 },
  { id: "D0999", date: daysAgoLabel(2), earnings: 610, distanceKm: 8.1 },
  { id: "D0998", date: daysAgoLabel(3), earnings: 290, distanceKm: 3.2 },
  { id: "D0997", date: daysAgoLabel(4), earnings: 480, distanceKm: 5.6 },
  { id: "D0996", date: daysAgoLabel(5), earnings: 370, distanceKm: 4.9 },
  { id: "D0995", date: daysAgoLabel(6), earnings: 640, distanceKm: 9.0 },
];

const mockOrdersNearby = [
  { id: "O-801", pickup: "A Street", drop: "B Avenue", distance: 2.1, value: 120 },
  { id: "O-802", pickup: "C Lane", drop: "D Road", distance: 4.5, value: 220 },
  { id: "O-803", pickup: "E Plaza", drop: "F Park", distance: 1.2, value: 80 },
  { id: "O-804", pickup: "G Market", drop: "H Square", distance: 6.0, value: 360 },
];

const leaderboardMock = [
  { id: "p1", name: "Ravi", deliveries: 430, city: "Mumbai", xp: 12400 },
  { id: "p2", name: "Sana", deliveries: 402, city: "Pune", xp: 11800 },
  { id: "p3", name: "Aman", deliveries: 378, city: "Bengaluru", xp: 11150 },
  { id: "you", name: "You", deliveries: 365, city: "Your City", xp: 10900 },
];

const perks = [
  { title: "Fuel Discount 5%", desc: "Shown at partner pumps" },
  { title: "Phone Recharge Offer", desc: "₹50 off on ₹300 recharge" },
  { title: "Free Health Checkup", desc: "Quarterly partner clinics" },
];

const trainingModules = [
  { id: "t1", title: "Safe Night Deliveries", minutes: 8 },
  { id: "t2", title: "Customer Service Best Practices", minutes: 6 },
  { id: "t3", title: "Bike Maintenance 101", minutes: 10 },
];

function sum(arr, key) {
  return arr.reduce((s, a) => s + (a[key] || 0), 0);
}

/* ----------------------------- Component ----------------------------- */
export default function DeliveryDashboard() {
  // Core user
  const [user] = useState({
    id: "DP001",
    name: "Prasath",
    role: "Delivery Partner",
    verified: true,
    city: "Salem",
  });

  const { online, setOnline } = useDelivery();
  const [currentOrders, setCurrentOrders] = useState([]);
  const [nearbyOrders, setNearbyOrders] = useState(mockOrdersNearby);
  const [xp, setXp] = useState(10900);
  const [level, setLevel] = useState(levelFromXp(10900));
  const [stepCount, setStepCount] = useState(3200);

  const [monthlyExpenses, setMonthlyExpenses] = useState({
    fuel: 3000,
    maintenance: 500,
    tolls: 200,
  });

  const earningsSeries = useMemo(
    () => pastDeliveries.map((d) => ({ name: d.date, earnings: d.earnings })),
    []
  );
  const totalEarnings7 = useMemo(() => sum(pastDeliveries, "earnings"), []);

  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [spinSpinning, setSpinSpinning] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [sosActive, setSosActive] = useState(false);

  // UX state
  const [ordersTab, setOrdersTab] = useState("orders"); // orders | productivity | notes
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filterHighValue, setFilterHighValue] = useState(false);

  // Calculations
  const monthlyExpenseTotal = Object.values(monthlyExpenses).reduce((s, v) => s + v, 0);
  const estimatedTax = Math.round(
    Math.max(0, (totalEarnings7 * 12 - monthlyExpenseTotal * 12) * 0.05)
  );
  const shiftSuggestion = useMemo(() => suggestShift(pastDeliveries, monthlyExpenses), [
    monthlyExpenses,
  ]);
  const predictedNextHours = useMemo(() => {
    const avgPerDelivery = totalEarnings7 / Math.max(1, pastDeliveries.length);
    const expected = Math.round(2 + Math.random() * 4);
    return Math.round(avgPerDelivery * expected);
  }, [totalEarnings7]);

  const leaderboard = useMemo(() => leaderboardMock.slice().sort((a, b) => b.xp - a.xp), []);

  /* Effects */
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepCount((s) => s + Math.floor(Math.random() * 6));
    }, 4000);
    const xpTimer = setInterval(() => {
      setXp((x) => x + Math.floor(Math.random() * 12));
    }, 6000);
    return () => {
      clearInterval(stepTimer);
      clearInterval(xpTimer);
    };
  }, []);

  useEffect(() => {
    setLevel(levelFromXp(xp));
  }, [xp]);

  /* Actions */
  function acceptOrder(order) {
    setCurrentOrders((cur) => [...cur, order]);
    setNearbyOrders((n) => n.filter((o) => o.id !== order.id));
    setXp((x) => x + Math.round(order.value / 10));
  }
  function dropOrder(orderId) {
    setCurrentOrders((cur) => cur.filter((o) => o.id !== orderId));
  }
  function flagCustomer(orderId) {
    alert(`Reported order ${orderId} to support (mock).`);
  }
  function toggleOnline() {
    setOnline(!online);
  }
  function requestSOS() {
    setSosActive(true);
    setTimeout(() => {
      setSosActive(false);
      alert("SOS cleared (mock). Emergency contacts notified (mock).");
    }, 7000);
  }
  function spinWheel() {
    if (spinSpinning) return;
    setSpinSpinning(true);
    setSpinResult(null);
    setTimeout(() => {
      const outcomes = [
        { label: "₹50 Fuel", type: "cash", value: 50 },
        { label: "Extra XP 200", type: "xp", value: 200 },
        { label: "Free Coffee", type: "perk", value: null },
        { label: "Surge Booster", type: "surge", value: 1.25 },
      ];
      const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
      setSpinResult(pick);
      if (pick.type === "xp") setXp((x) => x + pick.value);
      setSpinSpinning(false);
    }, 1600);
  }
  function askAi() {
    if (!aiQuery.trim()) return;
    let resp = "Not sure — check high-demand areas at 6pm.";
    if (aiQuery.toLowerCase().includes("earn")) {
      resp = `Work 3 more hours from ${shiftSuggestion.suggestHour} to earn ~₹${predictedNextHours}.`;
    } else if (aiQuery.toLowerCase().includes("safe")) {
      resp = "Prefer lit areas, share live location, avoid isolated spots.";
    } else if (aiQuery.toLowerCase().includes("routes")) {
      resp = "Take the 2-stop stacking route — pick highest value per km first.";
    }
    // small simulated delay for feel
    setAiResponse("Thinking...");
    setTimeout(() => setAiResponse(resp), 700);
  }
  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().catch(() => {});
      setPlaying(true);
    }
  }

  /* Route optimizer (mock) */
  const optimizedRoute = useMemo(() => {
    const list = nearbyOrders.slice();
    if (filterHighValue) list.sort((a, b) => b.value - a.value);
    else list.sort((a, b) => b.value / b.distance - a.value / a.distance);
    return list.map((o, idx) => ({ ...o, seq: idx + 1 }));
  }, [nearbyOrders, filterHighValue]);

  /* Small helper UX: percent progress for leaderboard */
  function xpPercent(xpValue) {
    const nextLevelXp = Math.pow((Math.floor(Math.sqrt(xpValue / 100)) + 1) * 1, 2) * 100;
    return Math.round((xpValue / Math.max(1, nextLevelXp)) * 100);
  }

  /* Render helpers */
  function OrderCard({ o }) {
    return (
      <div className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-800">
        <div>
          <div className="font-medium">#{o.id} • ₹{o.value}</div>
          <div className="text-xs text-gray-500">{o.pickup} → {o.drop} • {o.distance} km</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-gray-500">Seq {o.seq}</div>
          <div className="flex gap-2">
            <button onClick={() => acceptOrder(o)} className="px-2 py-1 rounded bg-agoraTeal text-black text-sm">Accept</button>
            <button onClick={() => setNearbyOrders((s) => s.filter(x => x.id !== o.id))} className="px-2 py-1 rounded bg-red-400   text-sm">Ignore</button>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Hey, <span className="text-agoraTeal">{user.name}</span> — Delivery Hub
            {user.verified && (
              <span className="ml-3 inline-flex items-center gap-1 text-sm text-green-600">
                <ShieldCheck className="w-4 h-4" /> Verified
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500">Your live dashboard — check safety, earnings & growth.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-right text-gray-500">
            <div>Level {level} • XP {xp}</div>
            <div className="text-xs">Deliveries: {leaderboard.find((p) => p.id === "you")?.deliveries ?? 0}</div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setAiDrawerOpen(true)} aria-label="Open AI Coach" className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 flex items-center gap-2">
              <Users className="w-4 h-4" /> AI Coach
            </button>
            <button onClick={toggleOnline} className={`px-4 py-2 rounded-full font-semibold shadow ${online ? "bg-green-400 text-black" : "bg-red-600"}`}>
              {online ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Earnings chart */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold flex items-center gap-2"><BarChart2 className="w-5 h-5 text-agoraTeal" /> Weekly Earnings</h2>
            <div className="text-sm text-gray-500">Last 7 days</div>
          </div>

          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line dataKey="earnings" stroke="#14b8a6" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
              <div className="text-xs text-gray-500">This Week</div>
              <div className="font-bold text-lg">₹{totalEarnings7}</div>
              <div className="text-xs text-gray-400 mt-1">Deliveries: {pastDeliveries.length}</div>
            </div>

            <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
              <div className="text-xs text-gray-500">Predicted 4hrs</div>
              <div className="font-bold text-lg">₹{predictedNextHours}</div>
              <div className="text-xs text-gray-400 mt-1">Estimate based on recent run rate</div>
            </div>

            <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
              <div className="text-xs text-gray-500">Shift Suggestion</div>
              <div className="font-bold text-lg">{shiftSuggestion.note}</div>
              <div className="text-xs text-gray-400 mt-1">Suggested: {shiftSuggestion.suggestHour}</div>
            </div>
          </div>
        </motion.div>

        {/* Route + Finance */}
        <aside className="space-y-3">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-agoraPink" /> Route Assistant</h3>
              <div className="text-xs text-gray-500">Optimized</div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setFilterHighValue((s) => !s)} className={`px-2 py-1 rounded text-sm ${filterHighValue ? 'bg-green-400' : 'bg-gray-100 dark:bg-gray-800'}`}>
                {filterHighValue ? 'High value' : 'Value/km'}
              </button>
              <button onClick={() => setNearbyOrders(mockOrdersNearby)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">Refresh</button>
            </div>

            <div className="space-y-2">
              {optimizedRoute.slice(0, 6).map((o) => (
                <OrderCard key={o.id} o={o} />
              ))}

              {optimizedRoute.length === 0 && <div className="text-gray-500">No nearby orders.</div>}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <h3 className="font-semibold flex items-center gap-2"><DollarSign className="w-4 h-4 text-yellow-500" /> Finance</h3>
            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <div className="text-xs text-gray-500">Expenses</div>
                <div className="font-semibold">₹{monthlyExpenseTotal}</div>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-xs text-gray-500">Tax Est. (yr)</div>
                <div className="font-semibold">₹{estimatedTax}</div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setLoanModalOpen(true)} className="col-span-2 w-full px-3 py-2 rounded bg-agoraPink text-white text-sm">Loan & Insurance</button>
                <button className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-sm flex items-center gap-2"><Download className="w-4 h-4"/> Download Report</button>
                <button className="px-3 py-2 rounded bg-agoraTeal text-black text-sm">Payout Schedule</button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Work Section - Orders / Productivity / Notes */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Work</h3>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">Tab</div>
            <div className="flex items-stretch bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
              <button onClick={() => setOrdersTab('orders')} className={`px-3 py-1 ${ordersTab === 'orders' ? 'bg-white dark:bg-gray-900' : ''}`}>Orders</button>
              <button onClick={() => setOrdersTab('productivity')} className={`px-3 py-1 ${ordersTab === 'productivity' ? 'bg-white dark:bg-gray-900' : ''}`}>Productivity</button>
              <button onClick={() => setOrdersTab('notes')} className={`px-3 py-1 ${ordersTab === 'notes' ? 'bg-white dark:bg-gray-900' : ''}`}>Notes</button>
            </div>
          </div>
        </div>

        <div>
          {ordersTab === 'orders' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3">
                <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold">Current Orders ({currentOrders.length})</div>
                      <div className="text-xs text-gray-400">Manage your active deliveries</div>
                    </div>
                    <div className="text-sm text-gray-500">Auto-stack</div>
                  </div>

                  {currentOrders.length === 0 ? (
                    <div className="text-gray-500">No active orders — accept one from the route assistant.</div>
                  ) : (
                    <div className="space-y-2">
                      {currentOrders.map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-900">
                          <div>
                            <div className="font-medium">#{o.id} • ₹{o.value}</div>
                            <div className="text-xs text-gray-500">{o.pickup} → {o.drop}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => dropOrder(o.id)} className="text-xs underline text-gray-500">Drop</button>
                            <button onClick={() => flagCustomer(o.id)} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">Flag</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Nearby Offers</div>
                    <div className="text-xs text-gray-500">Tap to accept</div>
                  </div>
                  <div className="space-y-2">
                    {nearbyOrders.map((o) => (
                      <div key={o.id} className="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-900">
                        <div>
                          <div className="font-medium">#{o.id} • ₹{o.value}</div>
                          <div className="text-xs text-gray-500">{o.pickup} → {o.drop} • {o.distance} km</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => acceptOrder(o)} className="px-3 py-1 rounded bg-agoraTeal text-black text-sm">Accept</button>
                          <button onClick={() => setNearbyOrders((s) => s.filter(x => x.id !== o.id))} className="px-3 py-1 rounded bg-red-400 text-sm">Ignore</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold mb-2">Order Stacking Controls</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Auto stack: ON</button>
                    <button className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Max stops: 3</button>
                    <button className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Max detour: 6 km</button>
                    <button className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800">Preferred shops</button>
                  </div>
                </div>
              </div>

              <aside className="space-y-3">
                <div className="p-3 rounded bg-gray-50 dark:bg-gray-800 text-sm">
                  <div className="font-semibold">Steps</div>
                  <div className="text-2xl font-bold">{stepCount}</div>
                  <div className="text-xs text-gray-400">Active pedometer (mock)</div>
                </div>

                <div className="p-3 rounded bg-gray-50 dark:bg-gray-800 text-sm">
                  <div className="font-semibold">SOS</div>
                  <div className="mt-2">
                    <button onClick={requestSOS} className="px-3 py-2 rounded bg-red-500 text-white w-full">Send SOS</button>
                    {sosActive && <div className="text-xs text-red-400 mt-2">SOS active — sending location...</div>}
                  </div>
                </div>

                <div className="p-3 rounded bg-gray-50 dark:bg-gray-800 text-sm">
                  <div className="font-semibold">Night Tips</div>
                  <div className="text-xs text-gray-400 mt-2">Prefer lit drop points, stay in public places, share live location.</div>
                </div>
              </aside>
            </div>
          )}

          {ordersTab === 'productivity' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-3 rounded bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">Productivity</div>
                    <div className="text-xs text-gray-400">Track your focus & runs</div>
                  </div>
                  <div className="text-xs text-gray-500">Live</div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded bg-white dark:bg-gray-900">
                      <div className="text-xs text-gray-400">Avg delivery time</div>
                      <div className="font-bold">18 min</div>
                    </div>
                    <div className="p-3 rounded bg-white dark:bg-gray-900">
                      <div className="text-xs text-gray-400">Average rating</div>
                      <div className="font-bold">4.8 ★</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-white dark:bg-gray-900">
                    <div className="text-xs text-gray-400">Pace this session</div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="font-bold">{Math.round(Math.random()*10)+1}</div>
                        <div className="text-xs text-gray-400">Orders/hr</div>
                      </div>
                      <div>
                        <div className="font-bold">{Math.round(Math.random()*5)+1} km</div>
                        <div className="text-xs text-gray-400">Avg trip</div>
                      </div>
                      <div>
                        <div className="font-bold">{Math.round(Math.random()*60)+20}m</div>
                        <div className="text-xs text-gray-400">Idle</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                <div className="font-semibold">Streaks & Rewards</div>
                <div className="mt-2 text-xs text-gray-400">Deliver 10 orders in 2 days to unlock</div>
                <div className="mt-3">
                  <button className="px-3 py-2 rounded bg-agoraPink text-white w-full">View Challenges</button>
                </div>
              </div>
            </div>
          )}

          {ordersTab === 'notes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-3 rounded bg-gray-50 dark:bg-gray-800">
                <div className="font-semibold mb-2">Notes</div>
                <textarea className="w-full p-2 rounded bg-white dark:bg-gray-900" rows={6} placeholder="Jot morning notes, preferred shops, etc."></textarea>
                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-2 rounded bg-agoraTeal text-black">Save</button>
                  <button className="px-3 py-2 rounded bg-red-400">Clear</button>
                </div>
              </div>

              <aside className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                <div className="font-semibold">Pinned</div>
                <ul className="mt-2 text-sm space-y-2">
                  <li className="p-2 rounded bg-white dark:bg-gray-900">Remember to check bike lights</li>
                  <li className="p-2 rounded bg-white dark:bg-gray-900">Customer note: gate code 1122</li>
                </ul>
              </aside>
            </div>
          )}
        </div>
      </div>

      {/* Community & Training */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-agoraPink" /> Community Feed</h3>
            <div className="text-sm text-gray-500">Live</div>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">New surge in downtown tonight — extra ₹60/order</li>
            <li className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">Partner meetup on Saturday — free meal for attendees</li>
            <li className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">Safety guidelines updated — check training module</li>
          </ul>
        </div>

        <aside className="space-y-3">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Play className="w-4 h-4 text-yellow-500" /> Micro Training</h3>
            <div className="space-y-2">
              {trainingModules.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-gray-500">{t.minutes} min</div>
                  </div>
                  <button className="px-2 py-1 rounded bg-agoraTeal text-black text-sm">Start</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
            <h3 className="font-semibold mb-2">Perks & Discounts</h3>
            <ul className="text-sm space-y-2">
              {perks.map((p, i) => (
                <li key={i} className="px-3 py-2 rounded bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.desc}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Leaderboard + Spin + Extras */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Leaderboard — {user.city}</h3>
            <div className="text-xs text-gray-500">Updated</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {leaderboard.slice(0, 4).map((p) => (
              <div key={p.id} className={`p-3 rounded ${p.id === 'you' ? 'bg-gradient-to-r from-agoraTeal to-agoraPink text-white' : 'bg-gray-50 dark:bg-gray-800'}`}>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{p.name}{p.id === 'you' ? ' (You)' : ''}</div>
                  <div className="text-xs">XP {p.xp}</div>
                </div>
                <div className="text-xs">{p.deliveries} deliveries • {p.city}</div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mt-2 overflow-hidden">
                  <div style={{ width: `${xpPercent(p.xp)}%` }} className="h-full bg-agoraTeal" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow flex flex-col items-center">
          <h3 className="font-semibold mb-3">Spin & Win</h3>
          <div className="w-36 h-36 rounded-full border flex items-center justify-center text-sm font-bold">
            {spinSpinning ? "Spinning..." : spinResult ? spinResult.label : "Try your luck"}
          </div>
          <button onClick={spinWheel} className="mt-3 px-3 py-2 rounded bg-agoraPink text-white">Spin</button>
          <div className="text-xs text-gray-400 mt-3">Daily free spin</div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow">
          <h3 className="font-semibold mb-2">Extras</h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">Verification badge: {user.verified ? 'Active' : 'Not verified'}</div>
            <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">Mini Audio Player</div>
            <div className="p-2 rounded bg-gray-50 dark:bg-gray-800">Invoice Generator (mock)</div>
          </div>
        </div>
      </div>

      {/* AI + Player + Expense */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI */}
        <div>
          <h3 className="font-semibold mb-2">AI Assistant</h3>
          <textarea value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} className="w-full p-2 rounded bg-gray-50 dark:bg-gray-800" rows={3} placeholder="Ask: how do I increase earnings?" />
          <div className="flex gap-2 mt-2">
            <button onClick={askAi} className="px-3 py-2 rounded bg-agoraTeal text-black">Ask</button>
            <button onClick={() => { setAiQuery(""); setAiResponse(""); }} className="px-3 py-2 rounded bg-agoraBlue">Clear</button>
          </div>
          {aiResponse && <div className="mt-2 text-sm text-gray-600">{aiResponse}</div>}
        </div>

        {/* Player + Expenses */}
        <div>
          <h3 className="font-semibold mb-2">Mini Player</h3>
          <div className="flex items-center gap-3">
            <audio ref={audioRef} src="" />
            <button onClick={togglePlay} className="px-3 py-2 rounded bg-agoraBlue">{playing ? "Pause" : "Play"}</button>
            <div className="text-sm text-gray-500">Playlist: Focus Beats</div>
          </div>

          <h3 className="font-semibold mt-4 mb-2">Expenses</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">Fuel</label>
            <input type="number" value={monthlyExpenses.fuel} onChange={(e) => setMonthlyExpenses((s) => ({ ...s, fuel: Number(e.target.value) }))} className="p-1 rounded bg-gray-50 dark:bg-gray-800" />
            <label className="text-xs">Maintenance</label>
            <input type="number" value={monthlyExpenses.maintenance} onChange={(e) => setMonthlyExpenses((s) => ({ ...s, maintenance: Number(e.target.value) }))} className="p-1 rounded bg-gray-50 dark:bg-gray-800" />
            <label className="text-xs">Tolls</label>
            <input type="number" value={monthlyExpenses.tolls} onChange={(e) => setMonthlyExpenses((s) => ({ ...s, tolls: Number(e.target.value) }))} className="p-1 rounded bg-gray-50 dark:bg-gray-800" />
          </div>

          <div className="mt-2 text-sm">Total: <strong>₹{monthlyExpenseTotal}</strong></div>
          <div className="text-xs text-gray-500">Yearly Tax est: ₹{estimatedTax}</div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <button className="px-3 py-2 rounded bg-blue-500 text-white"><Phone className="w-4 h-4 inline"/> Contact Support</button>
            <button className="px-3 py-2 rounded bg-agoraTeal">Request Verification</button>
            <button className="px-3 py-2 rounded bg-agoraAmber">Download Report</button>
            <button className="px-3 py-2 rounded bg-agoraPink text-white">Invite & Earn</button>
          </div>
        </div>
      </div>

      {/* Loan Modal */}
      <AnimatePresence>
        {loanModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setLoanModalOpen(false)} />
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow z-10 w-full max-w-md">
              <h3 className="font-semibold mb-2">Loan & Insurance Offers</h3>
              <p className="text-sm text-gray-500 mb-3">Mock offers.</p>
              <div className="space-y-3">
                <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium">Micro Loan ₹5,000</div>
                  <div className="text-xs text-gray-500">EMI ₹550 / month</div>
                  <button className="mt-2 px-3 py-1 rounded bg-agoraTeal text-black">Apply</button>
                </div>
                <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium">Accident Insurance</div>
                  <div className="text-xs text-gray-500">₹50 / month</div>
                  <button className="mt-2 px-3 py-1 rounded bg-agoraPink text-white">Enroll</button>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setLoanModalOpen(false)} className="px-3 py-2 rounded bg-red-4 00">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Drawer */}
      <AnimatePresence>
        {aiDrawerOpen && (
          <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 z-40 shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">AI Coach</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowSettings((s) => !s)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"><Settings className="w-4 h-4"/></button>
                <button onClick={() => setAiDrawerOpen(false)} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">Close</button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Ask for quick tips</div>
                <textarea value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} rows={3} className="w-full p-2 rounded bg-gray-50 dark:bg-gray-800 mt-1" placeholder="What area should I focus on?" />
                <div className="mt-2 flex gap-2">
                  <button onClick={askAi} className="px-3 py-2 rounded bg-agoraTeal text-black">Ask Coach</button>
                  <button onClick={() => { setAiQuery(''); setAiResponse(''); }} className="px-3 py-2 rounded bg-red-400">Clear</button>
                </div>
                {aiResponse && <div className="mt-2 text-sm text-gray-600">{aiResponse}</div>}
              </div>

              <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                <div className="font-semibold">Smart Shift Planner</div>
                <div className="text-xs text-gray-400 mt-1">{shiftSuggestion.note} • {shiftSuggestion.suggestHour}</div>
                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-2 rounded bg-agoraPink text-white">Plan Shift</button>
                  <button className="px-3 py-2 rounded bg-blue-400">Export</button>
                </div>
              </div>

              <div className="p-3 rounded bg-gray-50 dark:bg-gray-800">
                <div className="font-semibold">Safety Checklist</div>
                <ul className="text-sm mt-2 space-y-2">
                  <li className="flex items-center justify-between"><span>Helmet & Reflectors</span><span className="text-xs text-gray-400">Done</span></li>
                  <li className="flex items-center justify-between"><span>Phone charged</span><span className="text-xs text-gray-400">Done</span></li>
                  <li className="flex items-center justify-between"><span>Emergency contacts</span><span className="text-xs text-gray-400">Set</span></li>
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ----------------------------- Helpers ----------------------------- */
function levelFromXp(xp) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)));
}
function suggestShift(pastDeliveries, monthlyExpenses) {
  const avg = sum(pastDeliveries, "earnings") / Math.max(1, pastDeliveries.length);
  if (avg > 450) return { note: "Evening 5PM — weekend focus", suggestHour: "17:00" };
  return { note: "Mornings 8-11 steady demand", suggestHour: "08:00" };
}

/* End of DeliveryDashboard.jsx */
