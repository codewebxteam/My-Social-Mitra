import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserPlus,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { db } from "../firebase";

// Firebase Config (Re-declared to initialize secondary app)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const AddStaffModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Details, 2: Password
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Sales", // Default
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEnroll = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setStep(2);
  };

  const generateReferralId = () => {
    const prefix = formData.role.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    const namePart = formData.name.slice(0, 3).toUpperCase() || "STF";
    return `${prefix}-${namePart}-${random}`;
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Initialize Secondary App to create user without logging out Admin
      const secondaryApp = initializeApp(firebaseConfig, "Secondary");
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        formData.email,
        formData.password
      );
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: formData.name });

      // 3. Generate ID (Only strictly needed for Sales, but good for all)
      const refId = generateReferralId();
      setGeneratedId(refId);

      // 4. Save to Firestore (Using main app's DB connection)
      // We store in `users` collection but with a specific flag/role
      await setDoc(
        doc(
          db,
          "artifacts",
          "default-app",
          "users",
          newUser.uid,
          "profile",
          "account_info"
        ),
        {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: "Staff", // Generic Role
          staffRole: formData.role, // Specific Role (Designer, Sales, Editor)
          referralCode: refId, // Important for Sales
          joinedAt: new Date().toISOString(),
          createdAt: serverTimestamp(),
          status: "Active",
          plan: "Staff Account",
        }
      );

      // 5. Cleanup Secondary App
      await signOut(secondaryAuth);

      // Success State is handled by render
    } catch (error) {
      console.error("Error adding staff:", error);
      alert(error.message);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Sales",
      password: "",
    });
    setStep(1);
    setGeneratedId(null);
    setLoading(false);
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
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  {generatedId ? "Staff Added" : "Add New Staff"}
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
                {!generatedId ? (
                  <form
                    onSubmit={step === 1 ? handleEnroll : handleFinalSubmit}
                    className="space-y-4"
                  >
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        {/* Name */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              required
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Staff Name"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              required
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="staff@company.com"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              required
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+91..."
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                            Staff Role
                          </label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                            >
                              <option value="Sales">Sales Associate</option>
                              <option value="Designer">Graphic Designer</option>
                              <option value="Editor">Video Editor</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                          Enroll Staff
                        </button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="font-bold text-slate-900">
                            Set Password
                          </h3>
                          <p className="text-xs text-slate-500">
                            Create a secure password for {formData.name}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              required
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Min 6 characters"
                              className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? (
                                <EyeOff size={16} />
                              ) : (
                                <Eye size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading || formData.password.length < 6}
                          className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-500/25 hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Complete Registration"
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                        >
                          Back to Details
                        </button>
                      </motion.div>
                    )}
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Success!
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                      Staff account created. They can now login.
                    </p>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 mb-6">
                      <div className="text-left">
                        <p className="text-xs text-slate-400 font-bold uppercase">
                          Staff ID / Ref Code
                        </p>
                        <p className="text-lg font-mono font-bold text-slate-900">
                          {generatedId}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={resetForm}
                      className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                    >
                      Done
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

export default AddStaffModal;
