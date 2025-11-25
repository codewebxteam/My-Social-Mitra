import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  DollarSign,
  IndianRupeeIcon,
  Calendar,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const CreateOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    service: "Video Editing",
    amount: "",
    deadline: "",
    status: "Pending",
  });

  const services = [
    "Video Editing",
    "Thumbnail Pack",
    "Reels Bundle",
    "Web Audit",
    "Graphic Design",
    "SEO Optimization",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for professional feel
    setTimeout(() => {
      onSubmit(formData);
      setIsLoading(false);
      onClose();
      setFormData({
        // Reset form
        client: "",
        service: "Video Editing",
        amount: "",
        deadline: "",
        status: "Pending",
      });
    }, 1500);
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
              className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl pointer-events-auto overflow-hidden relative"
            >
              {/* Header Background */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-slate-900 to-slate-800 z-0" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#f7650b]/10 rounded-full blur-[80px] z-0" />

              {/* Header Content */}
              <div className="relative z-10 px-8 pt-8 pb-4 flex justify-between items-start text-white">
                <div>
                  <h2 className="text-2xl font-bold">Create New Order</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Enter project details below.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="relative z-10 p-8 pt-4 bg-white rounded-t-[2rem] mt-4"
              >
                <div className="space-y-5">
                  {/* Client Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Client Name
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        name="client"
                        value={formData.client}
                        onChange={handleChange}
                        placeholder="e.g. Tech Solutions Ltd"
                        className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Service Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Service
                      </label>
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none"
                        >
                          {services.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Budget
                      </label>
                      <div className="relative">
                        <IndianRupeeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          required
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="5000"
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                      Deadline
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] py-3.5 rounded-xl bg-[#f7650b] text-white font-bold text-sm hover:bg-orange-600 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Create Order <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateOrderModal;
