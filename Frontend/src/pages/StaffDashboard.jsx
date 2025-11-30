import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAuth, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  CheckCircle2,
  Clock,
  PenTool,
  Video,
  Users,
  Ticket,
  Loader2,
  Zap,
  Briefcase,
} from "lucide-react";
import GenerateCouponModal from "../components/GenerateCouponModal";

const StaffDashboard = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // Sales specific state
  const [referrals, setReferrals] = useState([]);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/staff/login");
        return;
      }

      // Fetch Staff Profile
      const docRef = doc(
        db,
        "artifacts",
        "default-app",
        "users",
        user.uid,
        "profile",
        "account_info"
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role === "Staff") {
        const data = docSnap.data();
        setUserProfile(data);

        // Load Role Specific Data
        if (data.staffRole === "Sales") {
          loadReferrals(data.referralCode);
        } else {
          loadOrders(data.staffRole);
        }
      } else {
        alert("Unauthorized Access");
        await signOut(auth);
        navigate("/staff/login");
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const loadOrders = (role) => {
    // Filter logic based on role
    // Designers see 'design' related, Editors see 'editing' related
    const designKeywords = [
      "poster",
      "logo",
      "brand",
      "social",
      "design",
      "website",
    ];
    const editKeywords = ["edit", "reel"];

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snap) => {
      const list = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((o) => {
          const svc = (o.service?.id || "").toLowerCase();
          if (role === "Designer")
            return designKeywords.some((k) => svc.includes(k));
          if (role === "Editor")
            return editKeywords.some((k) => svc.includes(k));
          return false;
        });
      setOrders(list);
    });
  };

  const loadReferrals = (code) => {
    if (!code) return;
    // Fetch users who used this referral code
    // NOTE: This requires a collectionGroup index on 'referralCode' usually,
    // or we query the specific users collection structure if possible.
    // For simplicity, let's query 'orders' made by partners who used this code
    // (Wait, 'sales' refer partners. Partners place orders. So we track partners)

    // Simplified: We just track orders that might be tagged (if we had a direct link),
    // OR we query Profiles for the referral code match.
    // Due to complexity of Firestore structure, let's just show a placeholder logic or
    // if you implemented `referralCode` in partner profiles, we query that.
    // Assuming we implemented it:
    // const q = query(collectionGroup(db, "profile"), where("referralCodeUsed", "==", code));

    // For now, let's show Orders with a specific tag if available, else dummy empty state
    // unless we add 'referredBy' to user profiles.
    // Let's assume Sales can see ALL partners they referred.
    // RE-USING logic from AdminDashboard to fetch profiles:
    // (This might be heavy for a simple staff dashboard but it's the only way without a dedicated collection)
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/staff/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Briefcase size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none">
              Staff Portal
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium uppercase tracking-wider">
              {userProfile?.staffRole} Dashboard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-900">
              {userProfile?.fullName}
            </p>
            <p className="text-[10px] text-slate-400">{userProfile?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* --- SALES VIEW --- */}
        {userProfile?.staffRole === "Sales" && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-600/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Ticket size={20} />
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">
                    ID
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  {userProfile.referralCode}
                </h3>
                <p className="text-blue-100 text-xs opacity-80">
                  Your Unique Referral Code
                </p>
              </div>
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">0</h3>
                <p className="text-slate-400 text-xs font-bold uppercase mt-1">
                  Total Referrals
                </p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl hover:scale-[1.02] transition-transform flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <span className="font-bold">Create New Coupon</span>
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-10 text-center">
              <div className="opacity-40 flex flex-col items-center">
                <Users size={48} className="mb-4 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-900">
                  Referral list coming soon
                </h3>
                <p className="text-slate-500 text-sm">
                  Your registered partners will appear here.
                </p>
              </div>
            </div>
            <GenerateCouponModal
              isOpen={isCouponModalOpen}
              onClose={() => setIsCouponModalOpen(false)}
            />
          </div>
        )}

        {/* --- DESIGNER & EDITOR VIEW (Kanban-ish List) --- */}
        {(userProfile?.staffRole === "Designer" ||
          userProfile?.staffRole === "Editor") && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="text-blue-600" /> Active Orders
              </h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                {orders.length} Tasks
              </span>
            </div>

            <div className="grid gap-4">
              {orders.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <p>No active orders assigned to your category.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
                        {order.client?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">
                          {order.service?.name}
                        </h4>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                          <span className="font-medium text-slate-700">
                            {order.client?.name}
                          </span>{" "}
                          •
                          <span className="font-mono text-xs">
                            {order.displayId}
                          </span>
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              order.status.includes("progress")
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : order.status.includes("completed")
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                          >
                            {order.status.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock size={10} /> {order.Duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(order.id, "In_Progress")
                        }
                        className="px-4 py-2 rounded-lg border border-blue-200 text-blue-600 font-bold text-xs hover:bg-blue-50 transition-colors flex items-center gap-2"
                      >
                        <PenTool size={14} /> Start
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(order.id, "Completed")
                        }
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 size={14} /> Mark Done
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
