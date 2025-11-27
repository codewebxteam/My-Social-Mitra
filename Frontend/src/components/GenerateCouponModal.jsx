import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Ticket,
  Loader2,
  Copy,
  CheckCircle2,
  Tag,
  AlertCircle,
} from "lucide-react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const GenerateCouponModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState({
    code: "",
    discount: 10,
    planId: "all", // 'all', 'starter', 'growth', 'pro'
    maxUses: 1,
  });
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "SAVE";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setConfig((prev) => ({ ...prev, code: result }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!config.code) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "coupons"), {
        code: config.code.toUpperCase(),
        discountPercent: Number(config.discount),
        validPlan: config.planId,
        maxUses: Number(config.maxUses),
        usedCount: 0,
        createdAt: serverTimestamp(),
        status: "Active",
      });
      setCreatedCode(config.code.toUpperCase());
    } catch (error) {
      console.error("Coupon error:", error);
      alert("Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setConfig({ code: "", discount: 10, planId: "all", maxUses: 1 });
    setCreatedCode(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetForm}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Ticket className="w-4 h-4" />
                  </div>
                  Create Coupon
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {!createdCode ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                        Coupon Code
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            required
                            value={config.code}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                code: e.target.value.toUpperCase(),
                              })
                            }
                            placeholder="e.g. WELCOME20"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-wider focus:outline-none focus:border-orange-500 transition-all uppercase"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={generateRandomCode}
                          className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          Generate
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                          Discount %
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          value={config.discount}
                          onChange={(e) =>
                            setConfig({ ...config, discount: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                          Max Uses
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={config.maxUses}
                          onChange={(e) =>
                            setConfig({ ...config, maxUses: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                        Valid For Plan
                      </label>
                      <select
                        value={config.planId}
                        onChange={(e) =>
                          setConfig({ ...config, planId: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 transition-all appearance-none"
                      >
                        <option value="all">All Plans</option>
                        <option value="starter">Pro Starter</option>
                        <option value="elite">Premium Elite</option>
                        <option value="supreme">Supreme Master</option>
                      </select>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl text-blue-700 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        Coupons are verified in real-time. Setting Max Uses to 1
                        makes it a one-time code.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/25 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Create Coupon"
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Coupon Active!
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                      Ready to be used by users.
                    </p>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 mb-6">
                      <div className="text-left">
                        <p className="text-xs text-slate-400 font-bold uppercase">
                          Code
                        </p>
                        <p className="text-xl font-mono font-bold text-slate-900 tracking-wider">
                          {createdCode}
                        </p>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => setCreatedCode(null)}
                      className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                    >
                      Create Another
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GenerateCouponModal;
