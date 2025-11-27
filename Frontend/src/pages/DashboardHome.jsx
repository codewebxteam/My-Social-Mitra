import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  User,
  Package,
  Sparkles,
  Activity,
  Zap,
  Download,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import CreateOrderModal from "../components/CreateOrderModal";

// --- PIE CHART ---
const SimplePieChart = ({ segments }) => {
  let currentAngle = 0;
  const gradientParts = segments.map((seg) => {
    const start = currentAngle;
    const end = currentAngle + seg.percent;
    currentAngle = end;
    return `${seg.color} ${start}% ${end}%`;
  });

  const background =
    segments.length && segments.some((s) => s.percent > 0)
      ? `conic-gradient(${gradientParts.join(", ")})`
      : "conic-gradient(#f1f5f9 0% 100%)";

  const completedSeg = segments.find((s) => s.label === "Delivered");
  const successRate = completedSeg ? completedSeg.percent : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-full">
      <div
        className="relative w-48 h-48 rounded-full shrink-0 p-4 bg-slate-50 shadow-inner"
        style={{ background }}
      >
        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]">
          <span className="text-3xl font-bold text-slate-900">
            {successRate}%
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
            Success Rate
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full sm:w-auto">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className="flex items-center gap-3 group cursor-default"
          >
            <span
              className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex-1">
              {seg.label}
            </span>
            <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">
              {seg.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- BAR CHART ---
const SimpleBarChart = ({ data }) => {
  const maxVal = Math.max(...data.values, 1);

  return (
    <div className="h-64 flex items-end justify-between gap-2 sm:gap-3 pt-8 w-full px-2">
      {data.values.map((val, i) => {
        const heightPercent = (val / maxVal) * 100;
        return (
          <div
            key={i}
            className="group flex flex-col items-center gap-3 w-full h-full justify-end relative"
          >
            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
              {val} Orders
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${heightPercent}%`, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              className="w-full max-w-[40px] rounded-t-xl relative overflow-hidden bg-slate-100"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t transition-colors duration-300
                  ${
                    val > 0
                      ? "from-[#f7650b] to-orange-400"
                      : "from-slate-200 to-slate-100"
                  }
                `}
              />
            </motion.div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-[#f7650b] transition-colors">
              {data.labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DashboardHome = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const agencyName = user?.displayName || "Partner";

  const [performanceView, setPerformanceView] = useState("Weekly");
  const [greeting, setGreeting] = useState("Good Morning");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- GREETING ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // --- FETCH ORDERS (Fixed: Sorting Client Side to Avoid Index Issue) ---
  useEffect(() => {
    if (!user) return;

    // FIX: Removed 'orderBy' from query to prevent "Missing Index" error
    const q = query(
      collection(db, "orders"),
      where("partnerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => {
          const d = doc.data();
          // Robust Date Parsing
          let dateObj = new Date();
          if (d.createdAt?.toDate) {
            dateObj = d.createdAt.toDate();
          } else if (d.createdAt) {
            dateObj = new Date(d.createdAt);
          }

          return {
            id: doc.id,
            ...d,
            createdAtDate: dateObj,
            dateFormatted: dateObj.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });

        // Sort manually in JS (Newest first)
        fetchedOrders.sort((a, b) => b.createdAtDate - a.createdAtDate);

        setOrders(fetchedOrders);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // --- CALCULATE STATS (Live Dashboard Logic) ---
  const { statsData, chartData } = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();

    let totalRev = 0;
    let completed = 0;
    let inProgress = 0;
    let cancelled = 0;

    let revToday = 0;
    let completedToday = 0;
    let inProgressToday = 0;
    let cancelledToday = 0;

    const weeklyDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];

    const monthlyWeeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const monthlyCounts = [0, 0, 0, 0];

    orders.forEach((order) => {
      // 1. Get Amount
      let amt = 0;
      if (order.pricing && order.pricing.priceFromClient) {
        amt = Number(order.pricing.priceFromClient);
      } else if (order.amount) {
        amt = parseFloat(order.amount.toString().replace(/[₹,]/g, "")) || 0;
      }

      const orderDate = order.createdAtDate || new Date();
      const isToday = orderDate.toDateString() === today;

      // 2. Status Logic (Robust & Case Insensitive)
      const statusRaw = (order.status || "Pending").toLowerCase();
      let statusType = "in_progress";

      if (statusRaw.includes("delivered") || statusRaw.includes("completed")) {
        statusType = "completed";
      } else if (statusRaw.includes("cancel") || statusRaw.includes("reject")) {
        statusType = "cancelled";
      } else {
        // Includes "pending", "processing", "in_progress", "approval", etc.
        statusType = "in_progress";
      }

      // 3. Aggregation
      if (statusType === "completed") {
        completed++;
        if (isToday) completedToday++;
      } else if (statusType === "in_progress") {
        inProgress++;
        if (isToday) inProgressToday++;
      } else if (statusType === "cancelled") {
        cancelled++;
        if (isToday) cancelledToday++;
      }

      // Add to Revenue if NOT cancelled
      if (statusType !== "cancelled") {
        totalRev += amt;
        if (isToday) revToday += amt;
      }

      // 4. Charts (Weekly)
      const timeDiff = now.getTime() - orderDate.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      if (daysDiff < 7 && daysDiff >= 0) {
        weeklyCounts[orderDate.getDay()]++;
      }

      // 5. Charts (Monthly)
      if (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      ) {
        const date = orderDate.getDate();
        if (date <= 7) monthlyCounts[0]++;
        else if (date <= 14) monthlyCounts[1]++;
        else if (date <= 21) monthlyCounts[2]++;
        else monthlyCounts[3]++;
      }
    });

    const total = orders.length || 1;
    const pieSegments = [
      {
        color: "#22c55e",
        percent: Math.round((completed / total) * 100),
        label: "Delivered",
      },
      {
        color: "#f97316",
        percent: Math.round((inProgress / total) * 100),
        label: "Pending",
      },
      {
        color: "#ef4444",
        percent: Math.round((cancelled / total) * 100),
        label: "Cancelled",
      },
    ];

    return {
      statsData: {
        revenue: `₹${(totalRev / 1000).toFixed(1)}k`,
        completed,
        inProgress,
        cancelled,
        pieSegments,
        revToday: `+₹${revToday}`,
        completedToday: `+${completedToday}`,
        inProgressToday: `${inProgressToday} new`,
        cancelledToday: `${cancelledToday}`,
      },
      chartData: {
        Weekly: { values: weeklyCounts, labels: weeklyDays },
        Monthly: { values: monthlyCounts, labels: monthlyWeeks },
      },
    };
  }, [orders]);

  // --- HANDLE CREATE ORDER (Saves Full Data) ---
  const handleCreateOrder = async (orderPayload) => {
    if (!user) return;

    try {
      // Spread orderPayload to get ALL fields (client object, brief, pricing object, etc.)
      const fullOrderData = {
        ...orderPayload,

        partnerId: user.uid,
        partnerName: agencyName,
        partnerEmail: user.email,

        displayId: `#ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: serverTimestamp(),
        status: orderPayload.status || "PENDING_APPROVAL_FROM_ADMIN",

        // Helper fields for simple access if needed
        amount: `₹${orderPayload.pricing?.priceFromClient || 0}`,
        avatar: `https://ui-avatars.com/api/?name=${
          orderPayload.client?.name || "Client"
        }&background=random&color=fff`,
      };

      await addDoc(collection(db, "orders"), fullOrderData);
      setIsOrderModalOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to place order. Check console for details.");
    }
  };

  // --- UI STATS ARRAY ---
  const statsUI = [
    {
      id: 1,
      title: "Total Revenue",
      value: statsData.revenue,
      sub: `Total Orders: ${orders.length}`,
      icon: Sparkles,
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      trend: statsData.revToday,
      positive: true,
      trendLabel: "Today",
    },
    {
      id: 2,
      title: "Completed",
      value: statsData.completed,
      sub: "Orders Delivered",
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      trend: statsData.completedToday,
      positive: true,
      trendLabel: "Today",
    },
    {
      id: 3,
      title: "In Progress",
      value: statsData.inProgress,
      sub: "Active Projects",
      icon: Clock,
      color: "from-orange-500 to-amber-600",
      bg: "bg-orange-50",
      trend: statsData.inProgressToday,
      positive: true,
      trendLabel: "Today",
    },
    {
      id: 4,
      title: "Cancelled",
      value: statsData.cancelled,
      sub: "Refunded / Void",
      icon: XCircle,
      color: "from-red-500 to-rose-600",
      bg: "bg-red-50",
      trend: statsData.cancelledToday,
      positive: false,
      trendLabel: "Today",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans relative overflow-x-hidden pb-24">
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white via-slate-50 to-transparent" />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-40 -left-20 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-6">
        {/* --- 1. HERO & WELCOME --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#f7650b] animate-pulse"></span>
              Live Dashboard
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
            >
              {greeting},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7650b] to-orange-600">
                {agencyName.split(" ")[0]}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 mt-2 text-lg"
            >
              You have{" "}
              <span className="font-bold text-slate-900">
                {statsData.inProgress} pending tasks
              </span>{" "}
              requiring your attention today.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 p-1.5 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100/60 backdrop-blur-xl"
          >
            <button className="px-5 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Report
            </button>
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-[#f7650b] transition-all shadow-lg hover:shadow-orange-500/25 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Create Order
            </button>
          </motion.div>
        </div>

        {/* --- 2. STATS BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsUI.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group cursor-default"
            >
              <div
                className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`}
              />
              <div className="flex justify-between items-start mb-8">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>

                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    stat.positive
                      ? "bg-green-50 text-green-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {stat.trend}
                  <span className="text-[9px] opacity-70 ml-1 font-normal">
                    {stat.trendLabel}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                  {stat.title}
                </h3>
                <div className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <p className="text-slate-400 text-xs mt-2 font-medium">
                  {stat.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- 3. MAIN CONTENT GRID --- */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/30 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Sales Analytics
                </h3>
                <p className="text-slate-500 text-sm">Performance overview</p>
              </div>
              <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
                {["Weekly", "Monthly"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setPerformanceView(view)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      performanceView === view
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>
            <SimpleBarChart data={chartData[performanceView]} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/30 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Status</h3>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <SimplePieChart segments={statsData.pieSegments} />
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50">
              <p className="text-center text-sm text-slate-500">
                Your delivery rate is calculated based on{" "}
                <span className="text-green-500 font-bold">Completed</span> vs
                Total orders.
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- 4. BOTTOM GRID (ORDERS TABLE) --- */}
        <div className="grid lg:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden flex flex-col"
          >
            <div className="p-8 pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Recent Orders
                </h3>
                <p className="text-slate-500 text-sm">
                  Latest transaction history
                </p>
              </div>
              <button className="text-xs font-bold text-[#f7650b] hover:text-orange-700 flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Amount (Client)
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-slate-400"
                      >
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-slate-400"
                      >
                        No orders found. Click "Create Order" to get started.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      // FIX: Safely extract client name if it's an object or string
                      const displayClient =
                        typeof order.client === "object" &&
                        order.client !== null
                          ? order.client.name || "Client"
                          : order.client || "Client";

                      // FIX: Safely extract service name if it's an object or string
                      const displayService =
                        typeof order.service === "object" &&
                        order.service !== null
                          ? order.service.name || "Service"
                          : order.service || "Service";

                      // FIX: Display Price (Prefer numeric, fall back to string)
                      const displayPrice =
                        order.pricing && order.pricing.priceFromClient
                          ? `₹${order.pricing.priceFromClient}`
                          : order.amount;

                      // FIX: Status Formatting (Case Insensitive)
                      const statusRaw = (order.status || "Pending")
                        .replace(/_/g, " ")
                        .replace("FROM ADMIN", "")
                        .toLowerCase();

                      const statusFormatted =
                        statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

                      return (
                        <tr
                          key={order.id}
                          className="group hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  order.avatar ||
                                  `https://ui-avatars.com/api/?name=${displayClient}&background=random&color=fff`
                                }
                                alt={displayClient}
                                className="w-10 h-10 rounded-xl shadow-sm"
                              />
                              <div>
                                <div className="font-bold text-slate-900 text-sm">
                                  {displayClient}
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                  {order.displayId || order.id?.substring(0, 8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <Package className="w-4 h-4 text-slate-400" />{" "}
                              {displayService}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize
                                    ${
                                      statusRaw.includes("delivered") ||
                                      statusRaw.includes("completed")
                                        ? "bg-green-50 text-green-600 border-green-100"
                                        : statusRaw.includes("pending") ||
                                          statusRaw.includes("processing") ||
                                          statusRaw.includes("approval")
                                        ? "bg-orange-50 text-orange-600 border-orange-100"
                                        : "bg-blue-50 text-blue-600 border-blue-100"
                                    }
                                  `}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {statusFormatted}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900">
                              {displayPrice}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 rounded-lg text-slate-300 hover:bg-white hover:text-[#f7650b] hover:shadow-md transition-all">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* PREMIUM PLAN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-4 group perspective-1000"
          >
            <div className="relative h-full bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden text-white flex flex-col shadow-2xl shadow-slate-900/40 transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-[#f7650b] to-purple-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
                    <Activity className="w-6 h-6 text-[#f7650b]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#f7650b] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-900/40">
                    Pro Plan
                  </span>
                </div>

                <div className="mt-auto">
                  <h3 className="text-3xl font-bold mb-2 tracking-tight">
                    Supreme Master
                  </h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    Unlocking full potential with priority support & AI tools.
                  </p>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-400">Storage Used</span>
                      <span className="text-white">78%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "78%" }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="h-full bg-gradient-to-r from-[#f7650b] to-orange-500 rounded-full shadow-[0_0_15px_rgba(247,101,11,0.5)]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/dashboard/plans")}
                    className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    Upgrade Plan <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- CREATE ORDER MODAL --- */}
      <CreateOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleCreateOrder}
        partnerName={agencyName}
      />
    </main>
  );
};

export default DashboardHome;
