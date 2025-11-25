//  // AdminDashboard.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import {
//   Users,
//   CheckCircle2,
//   Clock,
//   XCircle,
//   TrendingUp,
//   MoreHorizontal,
//   Zap,
//   Download,
//   ChevronRight,
//   Activity,
//   Package,
//   Sparkles,
// } from "lucide-react";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   collection,
//   onSnapshot,
//   query,
//   orderBy,
// } from "firebase/firestore";

// // ---------- SIMPLE PIE CHART (STATUS DISTRIBUTION) ----------
// const AdminPieChart = ({ segments }) => {
//   // expected: [{ label, percent, color }]
//   let currentAngle = 0;
//   const gradientParts = segments.map((seg) => {
//     const start = currentAngle;
//     const end = currentAngle + seg.percent;
//     currentAngle = end;
//     return `${seg.color} ${start}% ${end}%`;
//   });
//   const gradient = `conic-gradient(${gradientParts.join(", ")})`;

//   const successSeg = segments.find((s) => s.label === "Completed");
//   const successPercent = successSeg ? successSeg.percent : 0;

//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-center gap-8 h-full">
//       <div
//         className="relative w-48 h-48 rounded-full shrink-0 p-4 bg-slate-900/70 shadow-inner border border-slate-700/70"
//         style={{ background: gradient }}
//       >
//         <div className="absolute inset-3 bg-slate-950/90 rounded-full flex items-center justify-center flex-col shadow-[inset_0_0_25px_rgba(0,0,0,0.6)]">
//           <span className="text-3xl font-bold text-slate-50">
//             {successPercent}%
//           </span>
//           <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
//             Completion
//           </span>
//         </div>
//       </div>
//       <div className="flex flex-col gap-3 w-full sm:w-auto">
//         {segments.map((seg) => (
//           <div
//             key={seg.label}
//             className="flex items-center gap-3 group cursor-default"
//           >
//             <span
//               className="w-3 h-3 rounded-full shadow-sm ring-2 ring-slate-900"
//               style={{ backgroundColor: seg.color }}
//             />
//             <span className="text-sm font-medium text-slate-300 group-hover:text-slate-50 transition-colors flex-1">
//               {seg.label}
//             </span>
//             <span className="text-xs font-bold bg-slate-800/70 px-2 py-0.5 rounded-md text-slate-200">
//               {seg.percent}%
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ---------- SIMPLE BAR CHART (ORDERS VS DAYS) ----------
// const AdminBarChart = ({ labels, values }) => {
//   // labels: ["Mon","Tue",...], values: [0-100]
//   return (
//     <div className="h-64 flex items-end justify-between gap-3 pt-8 w-full px-2">
//       {values.map((h, i) => (
//         <div
//           key={`${labels[i]}-${i}`}
//           className="group flex flex-col items-center gap-3 w-full h-full justify-end relative"
//         >
//           {/* Tooltip */}
//           <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-xl z-20 whitespace-nowrap">
//             {h} Orders
//             <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
//           </div>

//           {/* Bar */}
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: `${h}%`, opacity: 1 }}
//             transition={{
//               duration: 0.6,
//               delay: i * 0.05,
//               type: "spring",
//               stiffness: 100,
//             }}
//             className="w-full max-w-[40px] rounded-t-xl relative overflow-hidden"
//           >
//             <div
//               className={`absolute inset-0 bg-gradient-to-t ${
//                 h > 80
//                   ? "from-violet-500 to-fuchsia-400"
//                   : "from-slate-700 to-slate-500 group-hover:from-violet-400 group-hover:to-fuchsia-300"
//               } transition-colors duration-300`}
//             ></div>
//             <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40"></div>
//           </motion.div>

//           {/* Label */}
//           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-violet-300 transition-colors">
//             {labels[i]}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const AdminDashboard = () => {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const adminName = user?.displayName || "Admin";

//   const [greeting, setGreeting] = useState("Good Morning");
//   const [orders, setOrders] = useState([]);
//   const [partners, setPartners] = useState([]);
//   const [performanceView, setPerformanceView] = useState("Weekly");

//   // ---------- GREETING ----------
//   useEffect(() => {
//     const hour = new Date().getHours();
//     if (hour < 12) setGreeting("Good Morning");
//     else if (hour < 18) setGreeting("Good Afternoon");
//     else setGreeting("Good Evening");
//   }, []);

//   // ---------- FIREBASE REALTIME DATA (FIRESTORE) ----------
//   useEffect(() => {
//     const db = getFirestore();
//     let unsubOrders = () => {};
//     let unsubPartners = () => {};

//     try {
//       // Orders collection
//       const ordersRef = collection(db, "orders");
//       const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"));
//       unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
//         const list = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setOrders(list);
//       });

//       // Partners collection
//       const partnersRef = collection(db, "partners");
//       unsubPartners = onSnapshot(partnersRef, (snapshot) => {
//         const list = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setPartners(list);
//       });
//     } catch (err) {
//       console.error("Firestore error (admin dashboard):", err);
//     }

//     return () => {
//       unsubOrders();
//       unsubPartners();
//     };
//   }, []);

//   // ---------- DERIVED STATS ----------
//   const {
//     totalRevenue,
//     completedCount,
//     inProgressCount,
//     cancelledCount,
//     newTodayCount,
//     weeklyLabels,
//     weeklyValues,
//     statusSegments,
//     recentOrders,
//   } = useMemo(() => {
//     if (!orders || orders.length === 0) {
//       const fallbackLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//       const fallbackValues = [30, 50, 40, 80, 65, 90, 55];
//       const total = 120000;
//       return {
//         totalRevenue: total,
//         completedCount: 110,
//         inProgressCount: 20,
//         cancelledCount: 5,
//         newTodayCount: 12,
//         weeklyLabels: fallbackLabels,
//         weeklyValues: fallbackValues,
//         statusSegments: [
//           { label: "Completed", percent: 78, color: "#22c55e" },
//           { label: "In Progress", percent: 17, color: "#f97316" },
//           { label: "Cancelled", percent: 5, color: "#ef4444" },
//         ],
//         recentOrders: [
//           {
//             id: "#ADM-1001",
//             client: "Rahul Kumar",
//             partnerName: "Partner P1",
//             service: "Video Editing",
//             status: "Completed",
//             amountToAdmin: 3000,
//             amountFromClient: 4500,
//             createdAt: new Date().toISOString(),
//           },
//           {
//             id: "#ADM-1000",
//             client: "Design Co.",
//             partnerName: "Partner P2",
//             service: "Thumbnail Pack",
//             status: "Pending_Approval_From_Admin",
//             amountToAdmin: 800,
//             amountFromClient: 1200,
//             createdAt: new Date().toISOString(),
//           },
//         ],
//       };
//     }

//     let revenueForAdmin = 0;
//     let completed = 0;
//     let inProgress = 0;
//     let cancelled = 0;
//     let newToday = 0;

//     const now = new Date();
//     const todayStr = now.toDateString();

//     const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     const dayCounts = Array(7).fill(0);

//     orders.forEach((order) => {
//       const priceToAdmin = Number(
//         order?.pricing?.priceToAdmin ?? order?.priceToAdmin ?? 0
//       );
//       revenueForAdmin += priceToAdmin;

//       const rawStatus = (order.status || "").toUpperCase();

//       if (rawStatus === "COMPLETED" || rawStatus === "DELIVERED") {
//         completed++;
//       } else if (
//         rawStatus === "IN_PROGRESS" ||
//         rawStatus === "PROCESSING" ||
//         rawStatus === "UNDER_REVIEW" ||
//         rawStatus === "PENDING_APPROVAL_FROM_ADMIN"
//       ) {
//         inProgress++;
//       } else if (rawStatus === "CANCELLED") {
//         cancelled++;
//       }

//       // createdAt can be ISO string OR Firestore Timestamp
//       let created;
//       if (order.createdAt?.seconds) {
//         created = new Date(order.createdAt.seconds * 1000);
//       } else {
//         created = new Date(order.createdAt || Date.now());
//       }

//       if (created.toDateString() === todayStr) {
//         newToday++;
//       }

//       const dayIdx = created.getDay();
//       dayCounts[dayIdx] += 1;
//     });

//     const totalOrders = orders.length || 1;

//     const statusSegments = [
//       {
//         label: "Completed",
//         percent: Math.round((completed / totalOrders) * 100),
//         color: "#22c55e",
//       },
//       {
//         label: "In Progress",
//         percent: Math.round((inProgress / totalOrders) * 100),
//         color: "#f97316",
//       },
//       {
//         label: "Cancelled",
//         percent: Math.round((cancelled / totalOrders) * 100),
//         color: "#ef4444",
//       },
//     ];

//     const maxCount = Math.max(...dayCounts, 1);
//     const barValues = dayCounts.map((c) =>
//       Math.round((c / maxCount) * 100)
//     );

//     const recent = orders.slice(0, 5).map((o) => {
//       const statusUpper = (o.status || "PENDING").toUpperCase();
//       let prettyStatus = statusUpper
//         .toLowerCase()
//         .split("_")
//         .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
//         .join(" ");

//       return {
//         id: o.displayId || o.id,
//         client: o.client?.name || "Client",
//         partnerName: o.partnerName || o.partnerId || "Partner",
//         service: o.service?.name || o.serviceName || "Service",
//         status: prettyStatus,
//         amountToAdmin:
//           o.pricing?.priceToAdmin ??
//           o.priceToAdmin ??
//           0,
//         amountFromClient:
//           o.pricing?.priceFromClient ??
//           o.priceFromClient ??
//           0,
//         createdAt: o.createdAt || new Date().toISOString(),
//       };
//     });

//     return {
//       totalRevenue: revenueForAdmin,
//       completedCount: completed,
//       inProgressCount: inProgress,
//       cancelledCount: cancelled,
//       newTodayCount: newToday,
//       weeklyLabels: dayLabels,
//       weeklyValues: barValues,
//       statusSegments,
//       recentOrders: recent,
//     };
//   }, [orders]);

//   // ---------- STATS CARDS CONFIG ----------
//   const stats = [
//     {
//       id: 1,
//       title: "Total Revenue",
//       value: `₹${(totalRevenue / 1000).toFixed(1)}K`,
//       sub: `Orders: ${orders.length}`,
//       icon: Sparkles,
//       color: "from-violet-500 to-fuchsia-500",
//       positive: true,
//       trend: "+12%",
//     },
//     {
//       id: 2,
//       title: "Partners",
//       value: partners.length.toString(),
//       sub: "Active network",
//       icon: Users,
//       color: "from-emerald-400 to-lime-400",
//       positive: true,
//       trend: "+5%",
//     },
//     {
//       id: 3,
//       title: "In Progress",
//       value: inProgressCount.toString(),
//       sub: "Currently in production",
//       icon: Clock,
//       color: "from-sky-400 to-cyan-400",
//       positive: inProgressCount < 100,
//       trend: inProgressCount < 100 ? "-3%" : "+10%",
//     },
//     {
//       id: 4,
//       title: "Cancelled",
//       value: cancelledCount.toString(),
//       sub: "Refunded / void orders",
//       icon: XCircle,
//       color: "from-rose-500 to-red-500",
//       positive: cancelledCount <= 5,
//       trend: cancelledCount <= 5 ? "0%" : "+15%",
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-[#020617] text-slate-100 font-sans relative overflow-x-hidden pb-24">
//       {/* Ambient Background */}
//       <div className="fixed inset-0 w-full h-full pointer-events-none">
//         {/* Dark gradient base */}
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#020617] to-slate-900" />
//         {/* Neon blobs */}
//         <motion.div
//           animate={{ x: [0, 60, 0], y: [0, 40, 0], rotate: [0, 10, 0] }}
//           transition={{ duration: 22, repeat: Infinity }}
//           className="absolute -top-40 -right-32 w-[700px] h-[700px] bg-violet-600/25 rounded-full blur-[130px]"
//         />
//         <motion.div
//           animate={{ x: [0, -40, 0], y: [0, 60, 0], rotate: [0, -8, 0] }}
//           transition={{ duration: 26, repeat: Infinity }}
//           className="absolute top-40 -left-32 w-[600px] h-[600px] bg-fuchsia-500/20 rounded-full blur-[120px]"
//         />
//         <motion.div
//           animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
//           transition={{ duration: 30, repeat: Infinity }}
//           className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]"
//         />
//       </div>

//       <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-6">
//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
//           <div>
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.25em] mb-3 bg-slate-900/60 border border-slate-700/70 rounded-full px-4 py-1 shadow-[0_0_0_1px_rgba(148,163,184,0.25)]"
//             >
//               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
//               Admin Control Panel
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-4xl md:text-5xl font-bold text-slate-50 leading-tight tracking-tight"
//             >
//               {greeting},{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400">
//                 {adminName.split(" ")[0]}
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="text-slate-400 mt-3 text-sm md:text-base max-w-xl"
//             >
//               You have{" "}
//               <span className="font-semibold text-slate-100">
//                 {newTodayCount} new orders
//               </span>{" "}
//               from partners today. Stay on top of approvals and delivery status
//               in real time.
//             </motion.p>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//             className="flex items-center gap-3 p-1.5 bg-slate-900/80 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.9)] border border-slate-700/70 backdrop-blur-xl"
//           >
//             <button className="px-5 py-3 rounded-xl font-semibold text-xs md:text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2">
//               <Download className="w-4 h-4" /> Export Report
//             </button>
//             <div className="w-px h-8 bg-slate-700 mx-1" />
//             <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400 text-slate-900 font-semibold text-xs md:text-sm shadow-[0_0_20px_rgba(129,140,248,0.6)] hover:brightness-110 transition-all flex items-center gap-2">
//               <Zap className="w-4 h-4" /> Assign Orders
//             </button>
//           </motion.div>
//         </div>

//         {/* STATS CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {stats.map((stat, index) => (
//             <motion.div
//               key={stat.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 + index * 0.1 }}
//               whileHover={{ y: -4, scale: 1.01 }}
//               className="bg-slate-900/80 rounded-3xl p-6 border border-slate-700/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)] relative overflow-hidden group cursor-default"
//             >
//               {/* Glow */}
//               <div
//                 className={`pointer-events-none absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-40 rounded-full blur-3xl transition-opacity duration-500`}
//               />
//               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.07)_0,_transparent_55%)]" />

//               <div className="flex justify-between items-start mb-8 relative z-10">
//                 <div
//                   className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-slate-950 shadow-lg shadow-violet-500/40`}
//                 >
//                   <stat.icon className="w-6 h-6" />
//                 </div>
//                 <div
//                   className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
//                     stat.positive
//                       ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
//                       : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
//                   }`}
//                 >
//                   {stat.trend}
//                   <TrendingUp
//                     className={`w-3 h-3 ${
//                       stat.positive ? "" : "rotate-180"
//                     }`}
//                   />
//                 </div>
//               </div>

//               <div className="relative z-10">
//                 <h3 className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.22em] mb-2">
//                   {stat.title}
//                 </h3>
//                 <div className="text-3xl font-bold text-slate-50">
//                   {stat.value}
//                 </div>
//                 <p className="text-slate-500 text-xs mt-3 font-medium">
//                   {stat.sub}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* MAIN GRID: ANALYTICS + STATUS */}
//         <div className="grid lg:grid-cols-12 gap-8 mb-12">
//           {/* Orders Analytics */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="lg:col-span-8 bg-slate-900/80 rounded-[2.5rem] p-8 border border-slate-700/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)] relative overflow-hidden"
//           >
//             <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.14)_0,_transparent_60%)]" />
//             <div className="relative flex justify-between items-center mb-2">
//               <div>
//                 <h3 className="text-xl font-semibold text-slate-50">
//                   Orders from Partners
//                 </h3>
//                 <p className="text-slate-500 text-xs md:text-sm">
//                   Weekly performance overview
//                 </p>
//               </div>
//               <div className="flex p-1 bg-slate-900/70 rounded-xl border border-slate-700/70">
//                 {["Weekly", "Monthly"].map((view) => (
//                   <button
//                     key={view}
//                     onClick={() => setPerformanceView(view)}
//                     className={`px-4 py-2 rounded-lg text-[11px] font-semibold transition-all ${
//                       performanceView === view
//                         ? "bg-slate-800 text-slate-50 shadow-sm"
//                         : "text-slate-400 hover:text-slate-100"
//                     }`}
//                   >
//                     {view}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="relative mt-2">
//               <AdminBarChart labels={weeklyLabels} values={weeklyValues} />
//             </div>
//           </motion.div>

//           {/* Status Pie */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="lg:col-span-4 bg-slate-900/80 rounded-[2.5rem] p-8 border border-slate-700/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)] flex flex-col relative overflow-hidden"
//           >
//             <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.14)_0,_transparent_60%)]" />
//             <div className="relative flex justify-between items-center mb-6">
//               <h3 className="text-xl font-semibold text-slate-50">
//                 Order Status
//               </h3>
//               <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400">
//                 <MoreHorizontal className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="relative flex-grow flex items-center justify-center">
//               <AdminPieChart segments={statusSegments} />
//             </div>

//             <div className="relative mt-6 pt-6 border-t border-slate-800/80">
//               <p className="text-center text-sm text-slate-400">
//                 Your completion rate is{" "}
//                 <span className="text-emerald-300 font-semibold">
//                   above average
//                 </span>{" "}
//                 across all partners.
//               </p>
//             </div>
//           </motion.div>
//         </div>

//         {/* BOTTOM GRID: RECENT ORDERS + TOP PARTNERS CARD */}
//         <div className="grid lg:grid-cols-12 gap-8">
//           {/* Recent Partner Orders */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7 }}
//             className="lg:col-span-8 bg-slate-900/80 rounded-[2.5rem] border border-slate-700/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)] overflow-hidden flex flex-col"
//           >
//             <div className="flex justify-between items-center px-8 pt-8 pb-4">
//               <div>
//                 <h3 className="text-xl font-semibold text-slate-50">
//                   Recent Partner Orders
//                 </h3>
//                 <p className="text-slate-500 text-xs md:text-sm">
//                   Latest orders coming from your partners
//                 </p>
//               </div>
//               <button className="text-[11px] font-semibold text-violet-300 hover:text-violet-200 flex items-center gap-1">
//                 View All <ChevronRight className="w-3 h-3" />
//               </button>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-slate-900/90 border-b border-slate-800/80">
//                   <tr>
//                     <th className="px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
//                       Client
//                     </th>
//                     <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
//                       Partner
//                     </th>
//                     <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
//                       Service
//                     </th>
//                     <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
//                       Amount
//                     </th>
//                     <th className="px-6 py-4" />
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-800/80">
//                   {recentOrders.map((order) => (
//                     <tr
//                       key={order.id}
//                       className="group hover:bg-slate-800/70 transition-colors"
//                     >
//                       <td className="px-8 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-xl shadow-sm bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-slate-50 border border-slate-500/60">
//                             {order.client?.charAt(0) || "C"}
//                           </div>
//                           <div>
//                             <div className="font-semibold text-slate-50 text-sm">
//                               {order.client}
//                             </div>
//                             <div className="text-[11px] text-slate-500 font-medium">
//                               {order.id}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium text-slate-300">
//                         {order.partnerName}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
//                           <Package className="w-4 h-4 text-slate-400" />{" "}
//                           {order.service}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border
//                             ${
//                               order.status.startsWith("Completed")
//                                 ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
//                                 : order.status
//                                     .toLowerCase()
//                                     .includes("pending") ||
//                                   order.status
//                                     .toLowerCase()
//                                     .includes("approval") ||
//                                   order.status
//                                     .toLowerCase()
//                                     .includes("progress")
//                                 ? "bg-amber-500/10 text-amber-300 border-amber-500/40"
//                                 : order.status
//                                     .toLowerCase()
//                                     .includes("cancel")
//                                 ? "bg-rose-500/10 text-rose-300 border-rose-500/40"
//                                 : "bg-sky-500/10 text-sky-300 border-sky-500/40"
//                             }`}
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col text-[11px]">
//                           <span className="font-semibold text-slate-50">
//                             ₹{order.amountToAdmin}
//                             <span className="text-[10px] text-slate-400 font-medium ml-1">
//                               (Admin)
//                             </span>
//                           </span>
//                           <span className="text-[11px] text-slate-500">
//                             ₹{order.amountFromClient} from client
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-violet-300 hover:shadow-md transition-all">
//                           <MoreHorizontal className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                   {recentOrders.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={6}
//                         className="px-8 py-8 text-center text-sm text-slate-500"
//                       >
//                         No orders available yet.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </motion.div>

//           {/* Top Partners / Plan Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.8 }}
//             className="lg:col-span-4 group perspective-1000"
//           >
//             <div className="relative h-full bg-slate-950 rounded-[2.5rem] p-8 overflow-hidden text-white flex flex-col shadow-[0_22px_60px_rgba(15,23,42,1)] border border-slate-800/80 transition-transform duration-500 hover:scale-[1.02]">
//               <div className="pointer-events-none absolute inset-0 opacity-60 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
//               <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-emerald-400 rounded-full blur-[90px] opacity-40 group-hover:opacity-70 transition-opacity duration-700" />

//               <div className="relative z-10 flex flex-col h-full">
//                 <div className="flex justify-between items-start mb-8">
//                   <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
//                     <Activity className="w-6 h-6 text-violet-300" />
//                   </div>
//                   <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400 text-slate-950 text-[10px] font-bold uppercase tracking-[0.22em] shadow-lg shadow-violet-900/50">
//                     Top Partners
//                   </span>
//                 </div>

//                 <div className="space-y-4 mb-6">
//                   {partners.slice(0, 3).map((p, idx) => (
//                     <div
//                       key={p.id}
//                       className="flex items-center justify-between gap-3 text-sm"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[11px] font-bold border border-white/20">
//                           {idx + 1}
//                         </div>
//                         <div>
//                           <p className="font-semibold">
//                             {p.name || p.displayName || "Partner"}
//                           </p>
//                           <p className="text-[11px] text-slate-300/80">
//                             Plan: {p.planLabel || p.planKey || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <span className="text-xs font-bold text-amber-300">
//                         {p.totalOrders || 0} orders
//                       </span>
//                     </div>
//                   ))}
//                   {partners.length === 0 && (
//                     <p className="text-xs text-slate-300/80">
//                       No partners connected yet. Invite your first partner to
//                       start receiving orders.
//                     </p>
//                   )}
//                 </div>

//                 <div className="mt-auto">
//                   <h3 className="text-3xl font-bold mb-2 tracking-tight">
//                     Partner Network
//                   </h3>
//                   <p className="text-slate-300/80 text-sm mb-8 leading-relaxed">
//                     Manage and scale all partner orders from one powerful admin
//                     panel with live insights, capacity tracking and performance
//                     analytics.
//                   </p>

//                   <div className="mb-6">
//                     <div className="flex justify-between text-xs font-bold mb-2">
//                       <span className="text-slate-300/80">
//                         Capacity Utilization
//                       </span>
//                       <span className="text-slate-50">78%</span>
//                     </div>
//                     <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         whileInView={{ width: "78%" }}
//                         transition={{ duration: 1.5, delay: 0.7 }}
//                         className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400 rounded-full shadow-[0_0_25px_rgba(129,140,248,0.8)]"
//                       />
//                     </div>
//                   </div>

//                   <button className="w-full py-4 bg-white text-slate-950 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-950/70">
//                     View Partner Management
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default AdminDashboard;
