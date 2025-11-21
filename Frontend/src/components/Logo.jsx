import React from "react";

const Logo = () => (
  <div className="w-8 h-8 relative">
    {/* Meridian Logo SVG */}
    <svg viewBox="0 0 100 100" className="w-full h-full fill-black">
      {[...Array(12)].map((_, i) => (
        <circle
          key={i}
          cx={50 + 35 * Math.cos((i * 30 * Math.PI) / 180)}
          cy={50 + 35 * Math.sin((i * 30 * Math.PI) / 180)}
          r="6"
        />
      ))}
    </svg>
  </div>
);

export default Logo;
