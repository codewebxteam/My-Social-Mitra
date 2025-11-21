import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Enroll & Get Started",
    description:
      "Create your account, choose your path, and get instant access.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
    stat: "Quick Setup",
  },
  {
    id: 2,
    title: "Learn Through Video",
    description:
      "Watch high-quality, expert-led video modules at your own pace.",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop",
    stat: "HD Video",
  },
  {
    id: 3,
    title: "Get Certified",
    description: "Complete the assessments to earn a verified certificate.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
    stat: "Verified",
  },
  {
    id: 4,
    title: "Launch Career",
    description:
      "Apply your skills in real-world projects and connect with employers.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
    stat: "Hired",
  },
];

const RoadmapSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="w-full relative font-sans bg-gradient-to-b from-white via-orange-50 to-[#f7650b] py-12 md:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />

      {/* --- The Main Container --- */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto bg-orange-50/90 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-white/50 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* --- LEFT SIDE: Content & Steps --- */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {/* Heading Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200 bg-white w-fit mb-4 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#f7650b] animate-pulse" />
                <span className="text-xs font-bold text-[#f7650b] tracking-wide uppercase">
                  How it works
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Your Roadmap to <span className="text-[#f7650b]">Mastery</span>.
              </h2>
              <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
                We’ve simplified the journey so you can focus on what
                matters—learning, growing, and earning.
              </p>
            </motion.div>

            {/* Interactive Steps (Buttons with Staggered Animation) */}
            <div className="flex flex-col gap-3 mt-2">
              {steps.map((step, index) => (
                <motion.button
                  key={step.id}
                  // Animation Props
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }} // Staggers each button by 0.1s
                  onClick={() => setActiveStep(step.id)}
                  className={`group relative flex items-center justify-between p-3 md:p-4 rounded-xl text-left transition-all duration-300 border
                  ${
                    activeStep === step.id
                      ? "bg-white border-orange-200 shadow-md scale-[1.02]"
                      : "bg-transparent border-transparent hover:bg-orange-100/50 hover:border-orange-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Number Circle */}
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all
                      ${
                        activeStep === step.id
                          ? "bg-[#f7650b] text-white shadow-md"
                          : "bg-orange-200/50 text-orange-700/60"
                      }`}
                    >
                      {step.id}
                    </div>

                    {/* Text */}
                    <div>
                      <span
                        className={`text-base md:text-lg font-semibold block transition-colors ${
                          activeStep === step.id
                            ? "text-slate-900"
                            : "text-slate-500 group-hover:text-slate-700"
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  </div>

                  {/* Animated Arrow */}
                  <AnimatePresence>
                    {activeStep === step.id && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                      >
                        <ArrowRight className="text-[#f7650b] w-4 h-4 md:w-5 md:h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* --- RIGHT SIDE: Image Area --- */}
          <div className="relative h-64 md:h-[450px] w-full flex items-center justify-center lg:justify-end order-1 lg:order-2">
            {/* Background Blob Animation */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [0.95, 1, 0.95] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-white rounded-[2rem] blur-xl opacity-60"
            />

            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-xl border-4 border-white bg-white"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={steps[activeStep - 1].image}
                  alt={steps[activeStep - 1].title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

              {/* Text Content Overlay */}
              <motion.div
                key={`text-${activeStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 p-6 w-full"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                  {steps[activeStep - 1].title}
                </h3>
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed max-w-sm line-clamp-2">
                  {steps[activeStep - 1].description}
                </p>
              </motion.div>
            </motion.div>

            {/* Floating "Step Complete" Card (Pop-in Animation) */}
            <motion.div
              initial={{ x: 20, opacity: 0, scale: 0.8 }}
              whileInView={{ x: 0, opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="absolute -right-4 top-8 bg-white p-3 rounded-xl shadow-lg border border-slate-100 w-40 hidden sm:block"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#f7650b]" />
                <span className="font-bold text-slate-800 text-xs">
                  Step Complete
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 1.5, delay: 1 }}
                  className="bg-[#f7650b] h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RoadmapSection;
