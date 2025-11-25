 import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  IndianRupeeIcon,
  Loader2,
  User,
  Phone,
  Mail,
  AlertCircle,
  BadgeHelp,
  ClipboardList,
} from "lucide-react";

// Plan configuration same as pehle wale CreateOrderPanel se
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

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - planKey: "PLAN_1" | "PLAN_2" | "PLAN_3"
 * - partnerName: string
 * - onSubmit: (orderPayload) => Promise<void> | void
 */
const CreateOrderModal = ({
  isOpen,
  onClose,
  planKey = "PLAN_1",
  partnerName = "Partner",
  onSubmit,
}) => {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [priceFromClient, setPriceFromClient] = useState("");
  const [priceToAdmin, setPriceToAdmin] = useState("");
  const [brief, setBrief] = useState("");
  const [priority, setPriority] = useState("normal");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const planConfig = PLAN_CONFIG[planKey];

  const profit = useMemo(() => {
    const fromClient = parseFloat(priceFromClient || 0);
    const toAdmin = parseFloat(priceToAdmin || 0);
    if (isNaN(fromClient) || isNaN(toAdmin)) return 0;
    return fromClient - toAdmin;
  }, [priceFromClient, priceToAdmin]);

  const resetForm = () => {
    setClientName("");
    setClientPhone("");
    setClientEmail("");
    setSelectedService("");
    setPriceFromClient("");
    setPriceToAdmin("");
    setBrief("");
    setPriority("normal");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!planConfig) {
      setError("Plan configuration not found. Please contact admin.");
      return;
    }

    if (!clientName.trim()) {
      setError("Please enter client name.");
      return;
    }
    if (!selectedService) {
      setError("Please select a service.");
      return;
    }
    if (!priceFromClient || !priceToAdmin) {
      setError("Please fill both prices.");
      return;
    }

    const fromClient = parseFloat(priceFromClient);
    const toAdmin = parseFloat(priceToAdmin);

    if (isNaN(fromClient) || isNaN(toAdmin) || fromClient <= 0 || toAdmin <= 0) {
      setError("Prices must be valid positive numbers.");
      return;
    }

    if (fromClient < toAdmin) {
      setError(
        "Price from client should be greater than or equal to price to admin."
      );
      return;
    }

    const serviceConfig = planConfig.services.find(
      (s) => s.id === selectedService
    );
    if (!serviceConfig) {
      setError("Invalid service selected for this plan.");
      return;
    }

    const orderPayload = {
      partnerName,
      planKey,
      planLabel: planConfig.label,
      client: {
        name: clientName.trim(),
        phone: clientPhone.trim(),
        email: clientEmail.trim(),
      },
      service: {
        id: serviceConfig.id,
        name: serviceConfig.label,
      },
      pricing: {
        priceFromClient: fromClient,
        priceToAdmin: toAdmin,
        profit: fromClient - toAdmin,
      },
      brief: brief.trim(),
      priority,
      createdAt: new Date().toISOString(),
      status: "PENDING_APPROVAL_FROM_ADMIN",
    };

    try {
      setIsLoading(true);
      if (typeof onSubmit === "function") {
        await onSubmit(orderPayload);
      }
      resetForm();
      onClose && onClose();
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong while creating the order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl pointer-events-auto overflow-hidden relative"
            >
              {/* Header Background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-slate-900 to-slate-800 z-0" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#f7650b]/10 rounded-full blur-[80px] z-0" />

              {/* Header Content */}
              <div className="relative z-10 px-8 pt-8 pb-4 flex justify-between items-start text-white gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-1">
                    <ClipboardList className="w-3 h-3" />
                    <span>New admin order</span>
                  </div>
                  <h2 className="text-2xl font-bold">Create New Order</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Partner:{" "}
                    <span className="font-semibold text-white/90">
                      {partnerName}
                    </span>{" "}
                    · Plan:{" "}
                    <span className="font-semibold text-[#fbd38d]">
                      {planConfig ? planConfig.label : "Invalid Plan"}
                    </span>
                  </p>
                  {planConfig && (
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <BadgeHelp className="w-3 h-3" />
                      Max {planConfig.maxTasks} services allowed under this plan.
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Margin (per order)</p>
                    <p
                      className={`text-lg font-semibold ${
                        profit >= 0 ? "text-emerald-300" : "text-red-300"
                      }`}
                    >
                      ₹{profit.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form
                onSubmit={handleSubmit}
                className="relative z-10 p-8 pt-4 bg-white rounded-t-[2rem] mt-4 space-y-6"
              >
                {planConfig ? (
                  <>
                    {/* Error Banner */}
                    {error && (
                      <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Client Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-700">
                          Client Details
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Client Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              placeholder="Enter client name"
                              className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Client Phone
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="tel"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              placeholder="+91..."
                              className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Client Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="email"
                              value={clientEmail}
                              onChange={(e) => setClientEmail(e.target.value)}
                              placeholder="client@example.com"
                              className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service + Priority */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-700">
                          Service & Priority
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Service Type *
                          </label>
                          <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                          >
                            <option value="">Select service</option>
                            {planConfig.services.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.label}
                              </option>
                            ))}
                          </select>
                          <p className="text-[11px] text-gray-400 ml-1">
                            Only services allowed in your plan are visible here.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Priority
                          </label>
                          <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High (Urgent)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IndianRupeeIcon className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-700">
                          Pricing
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Price from Client (₹) *
                          </label>
                          <div className="relative">
                            <IndianRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="number"
                              min="0"
                              value={priceFromClient}
                              onChange={(e) =>
                                setPriceFromClient(e.target.value)
                              }
                              placeholder="e.g. 1500"
                              className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Price to admin (₹) *
                          </label>
                          <div className="relative">
                            <IndianRupeeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="number"
                              min="0"
                              value={priceToAdmin}
                              onChange={(e) => setPriceToAdmin(e.target.value)}
                              placeholder="e.g. 1000"
                              className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                            Your Profit (auto)
                          </label>
                          <input
                            type="text"
                            value={`₹${profit.toFixed(2)}`}
                            disabled
                            className="w-full px-3 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Brief */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-700">
                          Work Brief
                        </h3>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                          Work Brief / Requirements
                        </label>
                        <textarea
                          value={brief}
                          onChange={(e) => setBrief(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                          placeholder="Explain what exactly needs to be done. Add links, references, sizes, deadlines, etc."
                        />
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
                      <p className="text-[11px] text-gray-500 max-w-md">
                        By creating this order, you agree that admin will deliver
                        the work and you will handle communication with your client.
                      </p>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 md:flex-none md:px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 md:flex-none md:px-5 py-3 rounded-xl bg-[#f7650b] text-white font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <> Send to admin</>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl">
                    Plan configuration not found. Please contact admin.
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateOrderModal;
