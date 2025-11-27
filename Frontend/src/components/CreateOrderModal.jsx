import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react"; // <--- IMPORT LENIS HOOK
import {
  X,
  User,
  Phone,
  Mail,
  Briefcase,
  IndianRupee,
  Zap,
  Layers,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";

// --- PLAN CONFIGURATION (Preserved) ---
export const PLAN_CONFIG = {
  PLAN_1: {
    label: "Starter Plan",
    maxTasks: 4,
    services: [
      { id: "editing", label: "Video Editing" },
      { id: "poster_design", label: "Poster Design" },
      { id: "content_writing", label: "Content Writing" },
      { id: "thumbnail_design", label: "Thumbnail Design" },
    ],
  },
  PLAN_2: {
    label: "Growth Plan",
    maxTasks: 8,
    services: [
      { id: "editing", label: "Video Editing" },
      { id: "poster_design", label: "Poster Design" },
      { id: "content_writing", label: "Content Writing" },
      { id: "thumbnail_design", label: "Thumbnail Design" },
      { id: "reel_editing", label: "Reel / Short Editing" },
      { id: "logo_design", label: "Logo Design" },
      { id: "social_media_post", label: "Social Media Post Design" },
      { id: "basic_website", label: "Basic One-Page Website" },
    ],
  },
  PLAN_3: {
    label: "Agency Plan",
    maxTasks: 20,
    services: [
      { id: "editing", label: "Video Editing" },
      { id: "poster_design", label: "Poster Design" },
      { id: "content_writing", label: "Content Writing" },
      { id: "thumbnail_design", label: "Thumbnail Design" },
      { id: "reel_editing", label: "Reel / Short Editing" },
      { id: "logo_design", label: "Logo Design" },
      { id: "social_media_post", label: "Social Media Post Design" },
      { id: "basic_website", label: "Basic One-Page Website" },
      { id: "landing_page", label: "Landing Page Design" },
      { id: "blog_writing", label: "Blog Article Writing" },
      { id: "ppt_design", label: "Presentation / PPT Design" },
      { id: "brand_kit", label: "Basic Brand Kit" },
      { id: "ad_creative", label: "Ad Creative Design" },
      { id: "script_writing", label: "Script Writing" },
      { id: "email_copy", label: "Email Copywriting" },
      { id: "newsletter", label: "Newsletter Content" },
      { id: "seo_content", label: "SEO Content Writing" },
      { id: "carousel_post", label: "Carousel Post Design" },
      { id: "profile_banner", label: "Profile / Banner Design" },
      { id: "custom", label: "Custom Service (Other)" },
    ],
  },
};

const CreateOrderModal = ({
  isOpen,
  onClose,
  planKey = "PLAN_1",
  partnerName = "Partner",
  onSubmit,
}) => {
  const planConfig = PLAN_CONFIG[planKey];

  // --- LENIS SCROLL LOCK FIX ---
  const lenis = useLenis(); // Get the Lenis instance

  useEffect(() => {
    if (isOpen) {
      lenis?.stop(); // Stop main page scrolling
      document.body.style.overflow = "hidden"; // Fallback for standard scrolling
    } else {
      lenis?.start(); // Resume main page scrolling
      document.body.style.overflow = "unset";
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "unset";
    };
  }, [isOpen, lenis]);

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    service: "",
    priority: "normal",
    clientPrice: "",
    adminPrice: "",
    brief: "",
    
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Profit Calculation
  const profit = useMemo(() => {
    const cPrice = parseFloat(formData.clientPrice) || 0;
    const aPrice = parseFloat(formData.adminPrice) || 0;
    return cPrice - aPrice;
  }, [formData.clientPrice, formData.adminPrice]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.clientName ||
      !formData.service ||
      !formData.clientPrice ||
      !formData.adminPrice
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (profit < 0) {
      const confirmLoss = window.confirm(
        "Warning: You are making a loss on this order. Continue?"
      );
      if (!confirmLoss) return;
    }

    const serviceLabel =
      planConfig.services.find((s) => s.id === formData.service)?.label ||
      formData.service;

    const payload = {
      partnerName,
      planKey,
      planLabel: planConfig.label,
      client: {
        name: formData.clientName,
        phone: formData.clientPhone,
        email: formData.clientEmail,
      },
      service: {
        id: formData.service,
        name: serviceLabel,
      },
      pricing: {
        priceFromClient: parseFloat(formData.clientPrice),
        priceToAdmin: parseFloat(formData.adminPrice),
        profit: profit,
      },
      brief: formData.brief,
      priority: formData.priority,
      createdAt: new Date().toISOString(),
      status: "PENDING_APPROVAL_FROM_ADMIN",
    };

    setIsLoading(true);
    try {
      if (onSubmit) await onSubmit(payload);
      onClose();
      // Reset form
      setFormData({
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        service: "",
        priority: "normal",
        clientPrice: "",
        adminPrice: "",
        brief: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Priorities Configuration
  const priorities = [
    {
      id: "low",
      label: "Low",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: "normal",
      label: "Normal",
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    {
      id: "urgent",
      label: "Urgent 🔥",
      color: "bg-red-100 text-red-700 border-red-200",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal Wrapper */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* --- Header --- */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Create Order
                    <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#f7650b] text-[10px] font-bold uppercase tracking-wider border border-orange-100">
                      {planConfig?.label || "Plan"}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Partner:{" "}
                    <span className="font-medium text-slate-700">
                      {partnerName}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Margin
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        profit >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      ₹{profit.toFixed(0)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* --- Scrollable Content (With Lenis Prevent) --- */}
              <div
                className="p-6 overflow-y-auto custom-scrollbar space-y-8 overscroll-contain"
                data-lenis-prevent // <--- THIS TELLS LENIS TO IGNORE THIS SCROLL AREA
              >
                {/* 1. Client Details */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Client Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        Client Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleChange}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          name="clientPhone"
                          value={formData.clientPhone}
                          onChange={handleChange}
                          placeholder="+91 987..."
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          name="clientEmail"
                          value={formData.clientEmail}
                          onChange={handleChange}
                          placeholder="client@mail.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* 2. Service & Cost */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Service & Cost
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        Service Type *
                      </label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select a service...</option>
                          {planConfig?.services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L5 5L9 1"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        Priority
                      </label>
                      <div className="flex gap-2">
                        {priorities.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                priority: p.id,
                              }))
                            }
                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all
                              ${
                                formData.priority === p.id
                                  ? p.color +
                                    " shadow-sm ring-1 ring-offset-1 ring-slate-200"
                                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                              }
                            `}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Empty div to balance grid on wide screens if needed, or span full */}
                    <div className="hidden sm:block" />

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        Client Price (₹) *
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="number"
                          name="clientPrice"
                          min="0"
                          placeholder="0"
                          value={formData.clientPrice}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">
                        Admin Price (₹) *
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="number"
                          name="adminPrice"
                          min="0"
                          placeholder="0"
                          value={formData.adminPrice}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Profit Display Box */}
                    <div className="sm:col-span-2 mt-2 p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TrendingUp
                          className={`w-4 h-4 ${
                            profit >= 0 ? "text-emerald-500" : "text-red-500"
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-500 uppercase">
                          Net Profit
                        </span>
                      </div>
                      <span
                        className={`text-lg font-bold ${
                          profit >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {profit >= 0 ? "+" : "-"} ₹
                        {Math.abs(profit).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </section>

                <hr className="border-slate-100" />

                {/* 3. Work Brief */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Instructions
                    </h3>
                  </div>

                  <textarea
                    name="brief"
                    rows={3}
                    value={formData.brief}
                    onChange={handleChange}
                    placeholder="Describe the work requirements, deadlines, and any specific instructions..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                  />
                </section>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </div>

              {/* --- Footer Actions --- */}
              <div className="p-5 border-t border-slate-100 bg-white shrink-0 flex gap-3">
                <button
                  onClick={onClose}
                  type="button"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  type="button"
                  className="flex-[2] px-4 py-3.5 rounded-xl bg-[#f7650b] text-white font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Order <Zap className="w-4 h-4 fill-white" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateOrderModal;
