import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Award,
  UserCheck,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  Filter,
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

const StaffPerformance = () => {
  const [staffList, setStaffList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]); // Maps PartnerUID -> ReferralCode
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // 'all', 'month', 'week'

  // --- REAL-TIME DATA FETCHING ---
  useEffect(() => {
    // 1. Fetch Staff Members
    const qStaff = query(
      collection(db, "staff_referrals"),
      orderBy("createdAt", "desc")
    );
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      const staffData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        joinedDate:
          doc.data().createdAt?.toDate().toLocaleDateString() || "N/A",
      }));
      setStaffList(staffData);
    });

    // 2. Fetch Orders (To calculate sales)
    const qOrders = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Normalize amount
        parsedAmount: parseFloat(
          (doc.data().amount || "0").toString().replace(/[₹,]/g, "")
        ),
        // Normalize status
        status: (doc.data().status || "").toLowerCase(),
        createdAtDate: doc.data().createdAt?.toDate
          ? doc.data().createdAt.toDate()
          : new Date(),
      }));
      setOrders(ordersData);
    });

    // 3. Fetch Partners (To link Orders to Staff via Referral Code)
    // We use collectionGroup to find all 'account_info' docs in 'profile' collections
    const qPartners = query(collectionGroup(db, "profile"));
    const unsubPartners = onSnapshot(qPartners, (snapshot) => {
      const partnerMap = [];
      snapshot.docs.forEach((doc) => {
        if (doc.id === "account_info") {
          const data = doc.data();
          // We need the parent UID (User ID) to link to orders
          // Firestore path: artifacts/{appId}/users/{uid}/profile/account_info
          // doc.ref.parent.parent.id gives us {uid}
          const uid = doc.ref.parent.parent?.id;
          if (uid && data.referralCode) {
            partnerMap.push({
              uid: uid,
              referralCode: data.referralCode.toUpperCase(),
              name: data.fullName || "Unknown",
            });
          }
        }
      });
      setPartners(partnerMap);
    });

    // Cleanup
    return () => {
      unsubStaff();
      unsubOrders();
      unsubPartners();
    };
  }, []);

  // --- CALCULATE METRICS ---
  const processedStaff = useMemo(() => {
    // Wait for data
    if (!staffList.length) return [];

    const now = new Date();

    return staffList.map((member) => {
      const myRefCode = member.referralId?.toUpperCase();

      // 1. Find all partners referred by this staff
      const myPartners = partners.filter((p) => p.referralCode === myRefCode);
      const myPartnerIds = myPartners.map((p) => p.uid);

      // 2. Find all orders from these partners
      const myOrders = orders.filter((o) => {
        const isMyPartner = myPartnerIds.includes(o.partnerId);

        // Status Check (Completed/Delivered count as sales)
        const isSale =
          o.status.includes("completed") || o.status.includes("delivered");

        // Time Filter
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

      // 3. Aggregate Stats
      const totalRevenue = myOrders.reduce((sum, o) => sum + o.parsedAmount, 0);
      const salesCount = myOrders.length;
      const activePartnersCount = myPartners.length; // Total partners signed up

      return {
        ...member,
        calculatedSales: salesCount,
        calculatedRevenue: totalRevenue,
        calculatedPartners: activePartnersCount,
      };
    });
  }, [staffList, orders, partners, timeFilter]);

  // --- FILTER FOR SEARCH ---
  const filteredStaff = processedStaff.filter(
    (s) =>
      (s.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (s.referralId?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Hide loading when we have at least the staff list (metrics might pop in a split second later)
  useEffect(() => {
    if (staffList.length > 0 || orders.length > 0) setLoading(false);
  }, [staffList, orders]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Staff Performance
          </h1>
          <p className="text-slate-500">
            Real-time tracking of sales, referrals, and revenue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full sm:w-64"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {["all", "month", "week"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  timeFilter === filter
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {filter === "all" ? "All Time" : `This ${filter}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading && staffList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading live data...</p>
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
              {/* Decorative Background Icon */}
              <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12">
                <Award className="w-40 h-40 text-blue-600" />
              </div>

              <div className="relative z-10">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-200 shadow-inner flex items-center justify-center text-xl font-bold text-blue-600">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {member.referralId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          member.status === "Active"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}
                      >
                        {member.status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
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
                        Revenue
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{(member.calculatedRevenue / 1000).toFixed(1)}k
                    </p>
                  </div>
                </div>

                {/* Footer Stats */}
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Partners Referred
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {member.calculatedPartners}
                    </span>
                  </div>
                  <div className="ml-auto text-[10px] text-slate-400 font-medium">
                    Joined {member.joinedDate}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredStaff.length === 0 && (
        <div className="text-center py-12 bg-white rounded-[2rem] border border-slate-200 border-dashed mt-8">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-slate-900 font-bold">No staff members found</h3>
          <p className="text-slate-500 text-sm">
            Try adding a new staff member or changing your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default StaffPerformance;
