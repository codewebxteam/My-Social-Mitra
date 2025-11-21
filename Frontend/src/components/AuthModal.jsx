import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

const AuthModal = ({ isOpen, onClose }) => {
  // Views: 'login', 'signup', 'otp'
  const [view, setView] = useState("login");
  const [direction, setDirection] = useState(0);

  // Form States
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);

  // Signup Specific
  const [fullName, setFullName] = useState("");
  const [profession, setProfession] = useState("");

  // Password Strength State
  const [strength, setStrength] = useState(0);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("login");
        setPassword("");
        setConfirmPassword("");
        setStrength(0);
        setOtp(["", "", "", ""]);
      }, 300);
    }
  }, [isOpen]);

  // Calculate Password Strength
  useEffect(() => {
    let score = 0;
    if (!password) {
      setStrength(0);
      return;
    }
    if (password.length > 5) score += 1;
    if (password.length > 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(score);
  }, [password]);

  // Helper for Strength Color
  const getStrengthColor = () => {
    if (strength === 0) return "bg-slate-200";
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Medium";
    return "Strong";
  };

  // Navigation Helpers
  const navigateTo = (newView) => {
    if (view === "login" && newView === "signup") setDirection(1);
    else if (view === "signup" && newView === "login") setDirection(-1);
    else if (view === "signup" && newView === "otp") setDirection(1);
    else if (view === "otp" && newView === "signup") setDirection(-1);
    setView(newView);
  };

  // Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", { phone, password });
    onClose();
  };

  const handleSignup = (e) => {
    e.preventDefault();
    navigateTo("otp");
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    console.log("Verifying OTP", otp.join(""));
    onClose();
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  if (!isOpen) return null;

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 200 : -200, opacity: 0 }),
  };

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
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60]"
          />

          {/* Modal Wrapper - Centered Flexbox */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              // UPDATED: Added max-h-[95dvh] for mobile to use almost full height if needed
              className="w-[95%] sm:w-full sm:max-w-md bg-white rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto relative flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors z-30 backdrop-blur-md border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Area - UPDATED: Reduced height (h-24 on mobile) to save space */}
              <div className="relative h-24 sm:h-40 bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="absolute -bottom-20 -right-10 w-40 h-40 sm:w-60 sm:h-60 bg-[#f7650b]/30 rounded-full blur-[50px] sm:blur-[60px]" />
                <div className="absolute top-[-50%] left-[-20%] w-32 h-32 sm:w-40 sm:h-40 bg-blue-500/20 rounded-full blur-[40px] sm:blur-[50px]" />

                <div className="relative z-10 text-center px-4 mt-2 sm:mt-0">
                  <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight mb-0.5 sm:mb-1">
                    {view === "login" && "Welcome Back"}
                    {view === "signup" && "Create Account"}
                    {view === "otp" && "Verification"}
                  </h2>
                  <p className="text-slate-400 text-[10px] sm:text-sm font-medium">
                    {view === "login" && "Login to continue your journey"}
                    {view === "signup" && "Join the community today"}
                    {view === "otp" && "Enter the code sent to your phone"}
                  </p>
                </div>
              </div>

              {/* Scrollable Content Area - UPDATED: Adjusted padding for mobile */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-5 sm:p-8 relative">
                <AnimatePresence
                  initial={false}
                  custom={direction}
                  mode="popLayout"
                >
                  {/* --- LOGIN VIEW --- */}
                  {view === "login" && (
                    <motion.div
                      key="login"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="w-full"
                    >
                      {/* Google Login */}
                      <button className="w-full py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-3 text-slate-700 text-sm sm:text-base font-semibold hover:bg-slate-50 transition-all mb-5 sm:mb-8 group">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Login with Google
                      </button>

                      <div className="relative mb-5 sm:mb-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                          <span className="bg-white px-3 text-slate-400">
                            Or Login with Phone
                          </span>
                        </div>
                      </div>

                      <form
                        onSubmit={handleLogin}
                        className="space-y-4 sm:space-y-5"
                      >
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              setPhone(val);
                            }}
                            className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-[#f7650b]/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 text-sm sm:text-base"
                          />
                        </div>

                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-[#f7650b]/10 transition-all font-medium text-slate-800 placeholder:text-slate-400 text-sm sm:text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>

                        <div className="flex justify-end">
                          <a
                            href="#"
                            className="text-xs sm:text-sm font-bold text-[#f7650b] hover:text-orange-600 transition-colors"
                          >
                            Forgot Password?
                          </a>
                        </div>

                        <button className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-900 text-white font-bold text-base sm:text-lg shadow-xl shadow-slate-900/20 hover:bg-[#f7650b] hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 group">
                          Login Now
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </form>

                      <div className="mt-6 sm:mt-8 text-center pb-2">
                        <p className="text-xs sm:text-sm text-slate-500">
                          Not registered yet?{" "}
                          <button
                            onClick={() => navigateTo("signup")}
                            className="text-slate-900 font-bold hover:text-[#f7650b] transition-colors"
                          >
                            Create an Account
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* --- SIGNUP VIEW --- */}
                  {view === "signup" && (
                    <motion.div
                      key="signup"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="w-full"
                    >
                      {/* Google Signup */}
                      <button className="w-full py-3 rounded-xl border border-slate-200 flex items-center justify-center gap-3 text-slate-700 text-sm sm:text-base font-semibold hover:bg-slate-50 transition-all mb-5 group">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign up with Google
                      </button>

                      <div className="relative mb-5">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                          <span className="bg-white px-3 text-slate-400">
                            Or Register with Phone
                          </span>
                        </div>
                      </div>

                      <form onSubmit={handleSignup} className="space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Full Name"
                              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#f7650b] transition-all font-medium text-sm"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#f7650b] transition-all font-medium text-sm"
                          />
                        </div>

                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#f7650b] transition-all font-medium text-slate-600 text-sm appearance-none">
                            <option value="" disabled selected>
                              What describes you best?
                            </option>
                            <option value="student">Student</option>
                            <option value="freelancer">Freelancer</option>
                            <option value="professional">
                              Working Professional
                            </option>
                          </select>
                        </div>

                        {/* Password Field with Strength */}
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#f7650b] transition-all font-medium text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Password Strength Meter */}
                        <AnimatePresence>
                          {password.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-1"
                            >
                              <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                  Strength
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider ${
                                    strength <= 2
                                      ? "text-red-500"
                                      : strength === 3
                                      ? "text-orange-500"
                                      : "text-green-500"
                                  }`}
                                >
                                  {getStrengthLabel()}
                                </span>
                              </div>
                              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${getStrengthColor()}`}
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(strength / 4) * 100}%`,
                                  }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Confirm Password */}
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#f7650b] transition-all font-medium text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <button className="w-full py-3.5 rounded-xl bg-[#f7650b] text-white font-bold text-base sm:text-lg shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 mt-4">
                          Create Account
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </form>

                      <div className="mt-5 text-center pb-2">
                        <p className="text-xs sm:text-sm text-slate-500">
                          Already have an account?{" "}
                          <button
                            onClick={() => navigateTo("login")}
                            className="text-slate-900 font-bold hover:text-[#f7650b] transition-colors"
                          >
                            Login here
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* --- OTP VIEW --- */}
                  {view === "otp" && (
                    <motion.div
                      key="otp"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="w-full flex flex-col items-center text-center"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-5 animate-bounce">
                        <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                        Verification Code
                      </h3>
                      <p className="text-slate-500 mb-8 max-w-[250px] text-xs sm:text-sm">
                        We have sent a 4-digit code to your phone number.
                      </p>

                      <div className="flex gap-3 sm:gap-4 mb-8">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target, index)}
                            className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl sm:rounded-2xl border-2 border-slate-200 text-center text-xl sm:text-2xl font-bold text-slate-900 focus:border-[#f7650b] focus:outline-none transition-all"
                          />
                        ))}
                      </div>

                      <button
                        onClick={handleOtpVerify}
                        className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-900 text-white font-bold text-base sm:text-lg shadow-xl shadow-slate-900/20 hover:bg-[#f7650b] hover:shadow-orange-500/30 transition-all duration-300"
                      >
                        Verify & Proceed
                      </button>

                      <button
                        onClick={() => navigateTo("signup")}
                        className="mt-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-xs sm:text-sm"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Signup
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
