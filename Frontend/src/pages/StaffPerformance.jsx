import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  Plus,
} from "lucide-react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  collectionGroup,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";
import AddStaffModal from "../components/AddStaffModal"; // Import the updated modal

const StaffPerformance = () => {
  const [staffList, setStaffList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  // State for Modal
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  // --- REAL-TIME DATA FETCHING ---
  useEffect(() => {
    // Fetch Staff from 'users' collection where role is 'Staff'
    // Note: We need a way to distinguish staff.
    // Option 1: Fetch all users and filter client side (easiest for now given complexity of subcollections)
    // Option 2: Keep a separate 'staff_referrals' collection? The modal now writes to 'users'.
    // Let's use collectionGroup "profile" and filter for role == 'Staff' to get all staff.

    const qProfiles = query(collectionGroup(db, "profile"));
    const unsubProfiles = onSnapshot(qProfiles, (snapshot) => {
      const staff = [];
      const allPartners = [];

      snapshot.docs.forEach((doc) => {
        if (doc.id === "account_info") {
          const data = doc.data();
          const uid = doc.ref.parent.parent?.id;

          if (data.role === "Staff") {
            staff.push({ id: uid, ...data });
          } else if (data.referralCode) {
            allPartners.push({
              uid: uid,
              referralCode: data.referralCode.toUpperCase(),
              name: data.fullName || "Unknown",
            });
          }
        }
      });

      setStaffList(staff);
      setPartners(allPartners);
      setLoading(false);
    });

    // Fetch Orders
    const qOrders = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        parsedAmount: parseFloat(
          (doc.data().amount || "0").toString().replace(/[₹,]/g, "")
        ),
        status: (doc.data().status || "").toLowerCase(),
        createdAtDate: doc.data().createdAt?.toDate
          ? doc.data().createdAt.toDate()
          : new Date(),
      }));
      setOrders(ordersData);
    });

    return () => {
      unsubProfiles();
      unsubOrders();
    };
  }, []);

  // --- CALCULATE METRICS ---
  const processedStaff = useMemo(() => {
    const now = new Date();

    return staffList.map((member) => {
      const myRefCode = member.referralCode?.toUpperCase();

      // Only calculate sales metrics for Sales staff or those with codes
      if (!myRefCode)
        return {
          ...member,
          calculatedSales: 0,
          calculatedRevenue: 0,
          calculatedPartners: 0,
        };

      const myPartners = partners.filter((p) => p.referralCode === myRefCode);
      const myPartnerIds = myPartners.map((p) => p.uid);

      const myOrders = orders.filter((o) => {
        const isMyPartner = myPartnerIds.includes(o.partnerId);
        const isSale =
          o.status.includes("completed") || o.status.includes("delivered");

        let isTimeMatch = true;
        if (timeFilter === "month") {
          isTimeMatch =
            o.createdAtDate.getMonth() === now.getMonth() &&
            o.createdAtDate.getFullYear() === now.getFullYear();
        } else if (timeFilter === "week") {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          isTimeMatch = o.createdAtDate >= oneWeekAgo;
        }

        return isMyPartner && isSale && isTimeMatch;
      });

      const totalRevenue = myOrders.reduce((sum, o) => sum + o.parsedAmount, 0);

      return {
        ...member,
        calculatedSales: myOrders.length,
        calculatedRevenue: totalRevenue,
        calculatedPartners: myPartners.length,
      };
    });
  }, [staffList, orders, partners, timeFilter]);

  const filteredStaff = processedStaff.filter(
    (s) =>
      (s.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (s.staffRole?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Staff Performance
          </h1>
          <p className="text-slate-500">
            Manage your team and track their impact.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full sm:w-64 shadow-sm"
            />
          </div>

          {/* ADD STAFF BUTTON */}
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
          >
            <Plus className="w-4 h-4" /> Add New Staff
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredStaff.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          {loading ? (
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          ) : (
            <Search className="w-10 h-10 mb-3 opacity-50" />
          )}
          <p>{loading ? "Loading team..." : "No staff members found."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group"
            >
              <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12">
                <Award className="w-40 h-40 text-blue-600" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-200 shadow-inner flex items-center justify-center text-xl font-bold text-blue-600">
                    {member.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">
                      {member.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-500">
                        {member.staffRole || "Staff"}
                      </span>
                      {member.referralCode && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {member.referralCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Show stats mainly for Sales, maybe simplified for others */}
                {member.staffRole === "Sales" ? (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">
                          Sales
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        {member.calculatedSales}
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                          <DollarSign className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                          Rev
                        </p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        ₹{(member.calculatedRevenue / 1000).toFixed(1)}k
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 text-center">
                    <p className="text-xs text-slate-500 font-medium italic">
                      Operational Role
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Contact
                    </span>
                    <span className="text-xs font-bold text-slate-700 truncate w-32">
                      {member.phone || member.email}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
      />
    </div>
  );
};

export default StaffPerformance;
