import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ContactUs = () => {
  const [formState, setFormState] = useState("idle"); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState("submitting");
    // Simulate API call
    setTimeout(() => {
      setFormState("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden pt-20 pb-12 lg:pt-28 lg:pb-20">
      {/* =========================================
          BACKGROUND AMBIENCE
      ========================================= */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none border-slate-200/60 z-0">
        <div className="absolute left-1/4 top-0 bottom-0 w-px border-slate-200/60 hidden lg:block"></div>
        <div className="absolute right-1/4 top-0 bottom-0 w-px border-slate-200/60 hidden lg:block"></div>
      </div>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -right-[10%] w-[60vw] h-[60vw] bg-gradient-to-b from-orange-100/40 to-[#f7650b]/10 rounded-full blur-[120px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] -left-[10%] w-[40vw] h-[40vw] bg-orange-200/20 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* =========================================
              LEFT COLUMN: Header & Info
          ========================================= */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 lg:sticky lg:top-32"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#f7650b] text-xs font-bold tracking-widest uppercase shadow-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f7650b]"></span>
                </span>
                Contact Us
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
                Let’s Build Something{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7650b] to-orange-600">
                  Great Together.
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Have a project in mind? Want to enroll in a course? Or just want
                to say hi? We’d love to hear from you.
              </p>
            </motion.div>

            {/* Contact Cards */}
            <motion.div variants={itemVariants} className="grid gap-4">
              {[
                {
                  icon: Mail,
                  title: "Chat with us",
                  info: "hello@socialmitra.com",
                  desc: "We typically respond within 2 hours.",
                },
                {
                  icon: MapPin,
                  title: "Visit our HQ",
                  info: "Tech Park, Bangalore",
                  desc: "Come say hello at our office HQ.",
                },
                {
                  icon: Phone,
                  title: "Call us",
                  info: "+91 98765 43210",
                  desc: "Mon-Fri from 8am to 5pm.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white border border-transparent hover:border-orange-100 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-50 group-hover:bg-[#f7650b] flex items-center justify-center text-[#f7650b] group-hover:text-white transition-colors duration-300 shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 font-medium">{item.info}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 mt-4"
            >
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Follow Us
              </span>
              <div className="h-px flex-grow bg-slate-200"></div>
              <div className="flex gap-2">
                {[Twitter, Linkedin, Instagram, Globe].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ y: -3, color: "#f7650b" }}
                    className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-orange-200 shadow-sm transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* =========================================
              RIGHT COLUMN: Interactive Form
          ========================================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden"
          >
            {/* Decorative Form Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -mr-8 -mt-8 z-0 pointer-events-none"></div>

            <AnimatePresence mode="wait">
              {formState === "success" ? (
                // --- Success State ---
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="min-h-[400px] flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-green-100 rounded-full -z-10 opacity-50"
                    />
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 max-w-xs mx-auto mb-8">
                    Thanks for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => setFormState("idle")}
                    className="px-8 py-3 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                // --- Form State ---
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="relative z-10 flex flex-col gap-6"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Send a message
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Fill out the form below and we’ll guide you forward.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wide ml-1">
                        First Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. John"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wide ml-1">
                        Last Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wide ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wide ml-1">
                      Topic
                    </label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none cursor-pointer">
                        <option>General Inquiry</option>
                        <option>Course Support</option>
                        <option>Partnership</option>
                        <option>Billing</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wide ml-1">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        required
                        rows="4"
                        placeholder="Tell us how we can help..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#f7650b] focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={formState === "submitting"}
                    className="w-full py-4 bg-[#f7650b] text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {formState === "submitting" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
