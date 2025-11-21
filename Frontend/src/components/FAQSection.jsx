import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Who is Social Mitra designed for?",
    answer:
      "Social Mitra is perfect for students, freelancers, and aspiring digital marketers who want to master real-world skills. Whether you're a complete beginner or looking to upskill, our roadmap adapts to your pace.",
  },
  {
    id: 2,
    question: "Do I get a certificate upon completion?",
    answer:
      "Yes! Upon finishing your course and passing the final assessment, you will receive a verified industry-recognized certificate. This can be added to your LinkedIn profile and resume.",
  },
  {
    id: 3,
    question: "Can I access the courses on mobile?",
    answer:
      "Absolutely. Our platform is 100% responsive. You can watch video lessons, take quizzes, and track your progress from any device—smartphone, tablet, or laptop.",
  },
  {
    id: 4,
    question: "What is the refund policy?",
    answer:
      "We offer a 7-day money-back guarantee. If you're not satisfied with the content within the first week, simply reach out to our support team, and we'll process a full refund—no questions asked.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Default open the first one

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-white py-20 md:py-28 px-6 font-sans overflow-hidden">
      {/* --- 1. Background Decorations (Improved) --- */}
      {/* Dot Pattern for Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Soft Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100/60 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* --- LEFT SIDE: Sticky Header & CTA --- */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#f7650b] text-xs font-bold tracking-wider uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f7650b]"></span>
                </span>
                Support Center
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                Frequently Asked{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7650b] to-orange-600">
                  Questions
                </span>
              </h2>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                Everything you need to know about the product and billing. Can't
                find the answer you're looking for?
              </p>

              {/* --- NEW: Avatar Group (Trust Factor) --- */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${10 + i}`}
                        alt="Support"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-bold text-slate-900">Online now</span>{" "}
                  <br /> and ready to help.
                </div>
              </div>

              {/* CTA Button */}
              <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-base hover:bg-[#f7650b] transition-all duration-300 shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1">
                <MessageCircle className="w-5 h-5" />
                <span>Chat with our team</span>
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            </motion.div>
          </div>

          {/* --- RIGHT SIDE: The Accordion List --- */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`group border rounded-2xl overflow-hidden transition-all duration-300 relative
                  ${
                    activeIndex === index
                      ? "border-orange-500/30 bg-white shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/20 z-10 scale-[1.01]"
                      : "border-slate-100 bg-white hover:border-orange-200 hover:shadow-md z-0"
                  }
                `}
              >
                {/* Active Indicator Strip (Left) */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-[#f7650b] transition-all duration-300 ${
                    activeIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 md:p-7 text-left focus:outline-none"
                >
                  <span
                    className={`text-lg md:text-xl font-bold pr-8 transition-colors duration-300
                      ${
                        activeIndex === index
                          ? "text-slate-900"
                          : "text-slate-700 group-hover:text-slate-900"
                      }`}
                  >
                    {faq.question}
                  </span>

                  {/* Animated Icon */}
                  <div
                    className={`shrink-0 relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300
                      ${
                        activeIndex === index
                          ? "bg-[#f7650b] border-[#f7650b] rotate-180 shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-400 group-hover:border-orange-200 group-hover:text-[#f7650b]"
                      }`}
                  >
                    <Plus
                      className={`absolute w-5 h-5 transition-all duration-300 
                          ${
                            activeIndex === index
                              ? "opacity-0 rotate-90 scale-50"
                              : "opacity-100 rotate-0 scale-100"
                          }`}
                    />
                    <Minus
                      className={`absolute w-5 h-5 text-white transition-all duration-300 
                          ${
                            activeIndex === index
                              ? "opacity-100 rotate-0 scale-100"
                              : "opacity-0 -rotate-90 scale-50"
                          }`}
                    />
                  </div>
                </button>

                {/* Answer Body */}
                <AnimatePresence initial={false}>
                  {activeIndex === index && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-7 pt-0 text-slate-600 leading-relaxed text-[16px]">
                        <div className="w-full h-px bg-slate-100 mb-4" />{" "}
                        {/* Divider */}
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
