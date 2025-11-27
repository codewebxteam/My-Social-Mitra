import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Clock,
  Search,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  Check,
  X,
  DollarSign,
  UserPlus,
  Ticket,
  Briefcase,
  Eye,
  Calendar,
  Award,
  Zap,
} from "lucide-react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  getDoc, // Added getDoc for partner details
} from "firebase/firestore";
import { db } from "../firebase.js";
import AddStaffModal from "../components/AddStaffModal";
import GenerateCouponModal from "../components/GenerateCouponModal";

// --- Helper: Format Price Safe ---
const formatPrice = (value) => {
  if (!value) return "₹0";
  const stringVal = value.toString();
  // If it already contains ₹, return as is, else add it
  if (stringVal.includes("₹")) return stringVal;
  return `₹${stringVal}`;
};

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING_APPROVAL_FROM_ADMIN:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    In_Progress: "bg-orange-100 text-orange-700 border-orange-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };

  const label = status
    ? status.replace(/_/g, " ").replace("FROM ADMIN", "")
    : "Unknown";
  const style =
    styles[status] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${style}`}
    >
      {label}
    </span>
  );
};

// --- Stat Card Component ---
const StatCard = ({ title, value, icon, trend, trendUp, bg, border }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-6 rounded-[2rem] border ${border} bg-white shadow-xl shadow-slate-200/40 relative overflow-hidden group`}
  >
    <div
      className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${bg} opacity-50 group-hover:scale-110 transition-transform duration-500`}
    />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center transition-transform group-hover:rotate-12`}
        >
          {React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
        {trend && (
          <span
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
              trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}
          >
            {trendUp ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
        {title}
      </h3>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  </motion.div>
);

// --- Order Details Modal ---
const OrderDetailsModal = ({ isOpen, onClose, order, allOrders }) => {
  const [partnerDetails, setPartnerDetails] = useState(null);
  const [loadingPartner, setLoadingPartner] = useState(false);

  // Fetch Partner Details (Join Date / Expiry)
  useEffect(() => {
    if (isOpen && order?.partnerId) {
      const fetchPartner = async () => {
        setLoadingPartner(true);
        try {
          // ASSUMPTION: You have a 'users' collection for partners
          const partnerRef = doc(db, "users", order.partnerId);
          const snap = await getDoc(partnerRef);

          if (snap.exists()) {
            setPartnerDetails(snap.data());
          } else {
            setPartnerDetails(null);
          }
        } catch (error) {
          console.error("Error fetching partner details:", error);
        }
        setLoadingPartner(false);
      };
      fetchPartner();
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  // Calculate Total Orders for this specific partner
  const totalPartnerOrders = allOrders.filter(
    (o) => o.partnerId === order.partnerId
  ).length;

  // Format Dates Helper
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    // Handle Firestore Timestamp or standard date string
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-900">
                  Order Details
                </h2>
                {/* Priority Badge */}
                {order.priority && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                      order.priority.toLowerCase() === "urgent" ||
                      order.priority.toLowerCase() === "high"
                        ? "bg-red-100 text-red-600 border-red-200"
                        : "bg-blue-100 text-blue-600 border-blue-200"
                    }`}
                  >
                    {order.priority}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 font-mono">
                {order.displayId || order.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* --- Financial Overview (Top for visibility) --- */}
              <div className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 mb-1 font-bold uppercase">
                    To Admin
                  </p>
                  <p className="text-xl font-bold text-emerald-700">
                    {order.adminDisplayAmount}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 mb-1 font-bold uppercase">
                    Total Value
                  </p>
                  {/* Fix: Use safe formatPrice */}
                  <p className="text-xl font-bold text-blue-700">
                    {formatPrice(
                      order.pricing?.priceFromClient || order.amount
                    )}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 col-span-2 md:col-span-1">
                  <p className="text-xs text-purple-600 mb-1 font-bold uppercase">
                    Plan Type
                  </p>
                  <p className="text-lg font-bold text-purple-700 truncate">
                    {order.planLabel || "Standard"}
                  </p>
                </div>
              </div>

              {/* --- Partner Detailed Insights --- */}
              <div className="col-span-full border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4" /> Partner Insights
                  </h3>
                </div>
                <div className="p-4 bg-white grid grid-cols-2 gap-y-4 gap-x-8">
                  {/* Basic Partner Info */}
                  <div>
                    <p className="text-xs text-slate-400">Partner Name</p>
                    <p className="font-semibold text-slate-900">
                      {order.partnerName || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Total Orders (All Time)
                    </p>
                    <p className="font-semibold text-slate-900 flex items-center gap-1">
                      {totalPartnerOrders}{" "}
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                        orders
                      </span>
                    </p>
                  </div>

                  {/* Fetched Data */}
                  <div>
                    <p className="text-xs text-slate-400">Joined On</p>
                    <p className="font-medium text-slate-700 text-sm">
                      {loadingPartner ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        formatDate(
                          partnerDetails?.createdAt ||
                            partnerDetails?.joiningDate
                        )
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Subscription Expiry
                    </p>
                    <p
                      className={`font-medium text-sm ${
                        // Optional: Red text if expired logic could go here
                        "text-slate-700"
                      }`}
                    >
                      {loadingPartner ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        formatDate(
                          partnerDetails?.subscriptionExpiry ||
                            partnerDetails?.expiryDate
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* --- Basic Info --- */}
              <div className="col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100 h-fit">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Order Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                      Current Status
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Created At</span>
                    <span className="text-sm font-medium text-slate-900">
                      {order.dateFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* --- Client Info --- */}
              <div className="col-span-1 bg-slate-50 p-4 rounded-xl border border-slate-100 h-fit">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Client Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {order.avatar && (
                      <img
                        src={order.avatar}
                        alt="av"
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="font-semibold text-slate-900">
                      {order.client?.name || order.client || "Guest"}
                    </span>
                  </div>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Email:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {order.client?.email || order.email || "N/A"}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {order.client?.phone || order.phone || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              {/* --- Project Brief / Notes --- */}
              <div className="col-span-full">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-amber-500" /> Project Brief /
                  Notes
                </h3>
                <div className="bg-amber-50 text-slate-700 p-4 rounded-xl border border-amber-100 text-sm leading-relaxed whitespace-pre-wrap">
                  {order.brief ||
                    order.requirements ||
                    order.description ||
                    "No project brief provided."}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Close View
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Main Admin Dashboard ---
const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    total: 0,
    pending: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Modals State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- Real-time Data Fetch ---
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => {
        const d = doc.data();

        // Calculate Admin Price Display
        let adminAmount = "₹0";
        if (d.pricing && d.pricing.priceToAdmin) {
          adminAmount = formatPrice(d.pricing.priceToAdmin);
        } else if (d.amount) {
          adminAmount = formatPrice(d.amount);
        }

        return {
          id: doc.id,
          ...d,
          adminDisplayAmount: adminAmount,
          dateFormatted: d.createdAt?.toDate
            ? d.createdAt.toDate().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
        };
      });

      setOrders(fetchedOrders);

      // Stats Calculation
      let rev = 0;
      let pen = 0;
      fetchedOrders.forEach((o) => {
        let amt = 0;
        if (o.pricing && o.pricing.priceToAdmin) {
          // Ensure we handle numbers or strings correctly
          amt = Number(o.pricing.priceToAdmin) || 0;
        } else {
          // Clean string currency
          amt = parseFloat(o.amount?.toString().replace(/[₹,]/g, "") || 0);
        }

        if (o.status === "Completed" || o.status === "Delivered") rev += amt;
        if (o.status && o.status.includes("PENDING")) pen++;
      });

      setStats({
        revenue: rev,
        total: fetchedOrders.length,
        pending: pen,
        active: new Set(fetchedOrders.map((o) => o.partnerName)).size,
      });

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Actions ---
  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "orders", id), { status });
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- Filter ---
  const filteredOrders = orders.filter((o) => {
    const client =
      (typeof o.client === "string" ? o.client : o.client?.name) || "";
    const partner = o.partnerName || "";
    const orderId = o.displayId || o.id || ""; // Check displayId too
    const term = searchTerm.toLowerCase();
    return (
      client.toLowerCase().includes(term) ||
      partner.toLowerCase().includes(term) ||
      orderId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-500">
            Overview of platform performance and real-time orders.
          </p>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <button
            onClick={() => setIsStaffModalOpen(true)}
            className="flex-1 lg:flex-none px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Add Staff
          </button>
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="flex-1 lg:flex-none px-5 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${(stats.revenue / 1000).toFixed(1)}k`}
          icon={<DollarSign className="text-emerald-600" />}
          trend="Live"
          trendUp={true}
          bg="bg-emerald-50"
          border="border-emerald-100"
        />
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon={<ShoppingBag className="text-blue-600" />}
          trend="+ New"
          trendUp={true}
          bg="bg-blue-50"
          border="border-blue-100"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pending}
          icon={<Clock className="text-orange-600" />}
          trend="Needs Action"
          trendUp={false}
          bg="bg-orange-50"
          border="border-orange-100"
        />
        <StatCard
          title="Active Partners"
          value={stats.active}
          icon={<Users className="text-purple-600" />}
          trend="Stable"
          trendUp={true}
          bg="bg-purple-50"
          border="border-purple-100"
        />
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-[700px]">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Order Management
            <span className="px-2.5 py-0.5 bg-slate-100 rounded-full text-xs text-slate-500 font-medium">
              {orders.length}
            </span>
          </h2>

          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by ID, Client or Partner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-hidden flex-1 relative">
          <div className="absolute inset-0 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 md:px-8 py-4 bg-slate-50">
                    Order Details
                  </th>
                  <th className="px-6 md:px-8 py-4 bg-slate-50">
                    Client & Partner
                  </th>
                  <th className="px-6 md:px-8 py-4 bg-slate-50">
                    Admin Amount
                  </th>
                  <th className="px-6 md:px-8 py-4 bg-slate-50">Status</th>
                  <th className="px-6 md:px-8 py-4 text-right bg-slate-50">
                    Quick Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const clientName =
                      (typeof order.client === "string"
                        ? order.client
                        : order.client?.name) || "Client";
                    const serviceName =
                      (typeof order.service === "string"
                        ? order.service
                        : order.service?.name) || "Service";

                    return (
                      <tr
                        key={order.id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 md:px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">
                                {order.displayId || order.id.slice(0, 8)}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {serviceName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 md:px-8 py-4">
                          <div className="text-sm font-medium text-slate-900">
                            {clientName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            via {order.partnerName || "Unknown"}
                          </div>
                        </td>

                        <td className="px-6 md:px-8 py-4">
                          <div className="font-bold text-slate-900">
                            {order.adminDisplayAmount}
                          </div>
                          <div className="text-[10px] font-medium text-slate-400">
                            {order.dateFormatted}
                          </div>
                        </td>

                        <td className="px-6 md:px-8 py-4">
                          <StatusBadge status={order.status} />
                        </td>

                        <td className="px-6 md:px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* VIEW DETAILS BUTTON */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {order.status === "PENDING_APPROVAL_FROM_ADMIN" ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "In_Progress")
                                  }
                                  disabled={updatingId === order.id}
                                  className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
                                  title="Approve"
                                >
                                  {updatingId === order.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "Rejected")
                                  }
                                  disabled={updatingId === order.id}
                                  className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                                  title="Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : order.status === "In_Progress" ? (
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order.id, "Completed")
                                }
                                disabled={updatingId === order.id}
                                className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                              >
                                {updatingId === order.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                ) : (
                                  "Complete"
                                )}
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />
      <GenerateCouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        allOrders={orders} // Passing all orders for aggregation
      />
    </div>
  );
};

export default AdminDashboard;
