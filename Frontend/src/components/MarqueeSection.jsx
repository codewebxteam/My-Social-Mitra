import React from "react";
import { motion } from "framer-motion";

const MarqueeSection = () => {
  // The text to be repeated
  const marqueeText = "We’re Not Just a Platform — We’re a Movement.  ";

  return (
    <section className="relative w-full bg-white py-4 overflow-hidden border-t border-slate-100">
      {/* --- 1. The Scrolling Marquee (Background) --- */}
      <div className="relative w-full flex items-center">
        <div className="flex whitespace-nowrap">
          {/* We repeat the text twice to create a seamless loop */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              duration: 30, // Speed: Higher number = Slower
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex gap-8"
          >
            {/* Block 1 */}
            <span className="text-[80px] md:text-[140px] font-semibold uppercase text-slate-200 tracking-tighter leading-none shrink-0">
              {marqueeText}
            </span>
            {/* Block 2 (Duplicate for loop) */}
            <span className="text-[80px] md:text-[140px] font-semibold uppercase text-slate-200 tracking-tighter leading-none shrink-0">
              {marqueeText}
            </span>
          </motion.div>
        </div>
      </div>

      

      
    </section>
  );
};

export default MarqueeSection;
