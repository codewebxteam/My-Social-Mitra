import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center pt-20 pb-12 lg:pb-0 bg-gradient-to-b from-white via-white via-75% to-[#f7650b]">
      {/* --- Background Grid & Gradients (STRICTLY PRESERVED) --- */}

      {/* 1. Grid Lines */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none border-slate-200/60 z-0">
        <div className="absolute left-1/2 top-0 bottom-0 w-px border-slate-200/60 -translate-x-1/2 hidden lg:block"></div>
      </div>

      {/* 2. Main Orange Glow (Bottom Right) */}
      <div className="absolute -bottom-[10%] -right-[5%] w-[70vw] h-[70vw] bg-gradient-to-t from-[#f7650b] via-[#fa8b3e] to-transparent opacity-20 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* 3. Secondary Glow (Top Right) */}
      <div className="absolute top-[10%] right-[10%] w-[30vw] h-[30vw] bg-orange-200 opacity-20 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* --- Hero Content --- */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 items-center gap-12 lg:gap-0">
        {/* Left Side: Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start gap-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
        >
          {/* New: Modern Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#f7650b] text-xs font-bold tracking-widest uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#f7650b] animate-pulse" />
            The Future of Learning
          </span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Welcome to the Place Where{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-[#f7650b]">
              Potential Meets Possibility.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
            Explore high-impact digital programs — expertly designed to
            transform your curiosity into confidence and your skills into
            real-world results.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-2 w-full">
            <button className="px-8 py-4 rounded-full bg-[#f7650b] text-white font-semibold text-lg hover:bg-[#e65a0a] transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-95">
              Get a demo
            </button>
            <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-lg hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95">
              Get started
            </button>
          </div>
        </motion.div>

        {/* Right Side: 3D Rotating Sphere */}
        <div className="relative w-full h-[400px] lg:h-[700px] flex items-center justify-center lg:justify-end perspective-1000">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] lg:-mr-20 flex items-center justify-center"
          >
            {/* Glow effect behind the ball */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200/40 to-transparent blur-2xl -z-10"></div>

            <img
              src="/assets/ball.webp"
              alt="AI Sphere"
              className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />

            {/* Fallback for missing image */}
            <div className="hidden w-full h-full rounded-full border border-slate-200 bg-white/10 backdrop-blur-sm items-center justify-center text-slate-500 text-center p-10 shadow-inner">
              <div>
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-medium">Image Missing</p>
                <p className="text-xs mt-1 text-slate-400">
                  Add ball.webp to public/assets folder
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
