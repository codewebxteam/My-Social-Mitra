import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Check, ArrowRight, Star, Zap, Crown } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Pro Starter",
    price: "₹999",
    type: "Beginner",
    description: "Master the basics of digital marketing.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    features: [
      "5 Core Courses",
      "Community Support",
      "Weekly Assignments",
      "Certificate",
    ],
    icon: Zap,
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 2,
    title: "Supreme Master",
    price: "₹4,999",
    type: "Most Popular",
    description: "Mentorship, job placement & toolkits.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    features: [
      "All Pro Features",
      "1-on-1 Mentorship",
      "Job Placement",
      "Lifetime Access",
    ],
    icon: Crown,
    popular: true,
    color: "from-[#f7650b] to-orange-600",
  },
  {
    id: 3,
    title: "Premium Elite",
    price: "₹2,499",
    type: "Advanced",
    description: "Advanced strategies for scaling.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    features: [
      "12 Advanced Courses",
      "Priority Support",
      "Case Studies",
      "Portfolio Review",
    ],
    icon: Star,
    color: "from-purple-400 to-pink-400",
  },
];

const ProductCard = ({ product }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xOffset = clientX - left - width / 2;
    const yOffset = clientY - top - height / 2;
    x.set(xOffset / 25);
    y.set(yOffset / 25);
  }

  const transform = useMotionTemplate`perspective(1000px) rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ transformStyle: "preserve-3d", transform }}
      className={`relative group h-full rounded-[2rem] transition-all duration-300
        ${product.popular ? "z-10 md:scale-105" : "hover:z-10"}
      `}
    >
      {/* --- Background Layer (Fixes Border Radius Bug) --- */}
      <div
        className={`absolute inset-0 rounded-[2rem] bg-slate-900 border border-slate-800 transition-colors duration-300 group-hover:border-slate-600 ${
          product.popular
            ? "ring-1 ring-orange-500/50 shadow-2xl shadow-orange-500/20"
            : "hover:shadow-xl"
        }`}
      />

      {/* --- Best Value Badge (Fixed Z-Index Issue) --- */}
      {product.popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f7650b] to-orange-600 text-white px-4 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-lg shadow-orange-500/40 tracking-wide uppercase"
          style={{ transform: "translateZ(50px) translateX(-50%)" }} // Lifts badge way above card
        >
          Best Value
        </div>
      )}

      {/* --- Image Header --- */}
      {/* Reduced height (h-36) for compactness */}
      <div
        className="relative h-36 md:h-40 rounded-t-[2rem] overflow-hidden"
        style={{ transform: "translateZ(20px)" }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            product.popular ? "from-orange-500/20" : "from-slate-800/20"
          } to-slate-900 z-10`}
        />
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-white/10 z-20">
          <product.icon className={`w-4 h-4 text-white`} />
        </div>
      </div>

      {/* --- Content Body --- */}
      {/* Reduced padding (p-5) for mobile fit */}
      <div
        className="p-5 md:p-6 flex flex-col h-auto justify-between relative z-10"
        style={{ transform: "translateZ(30px)" }}
      >
        <div>
          <div
            className={`text-[10px] font-bold uppercase tracking-wider mb-1 bg-gradient-to-r ${product.color} bg-clip-text text-transparent`}
          >
            {product.type}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl md:text-3xl font-bold text-white">
              {product.price}
            </span>
            <span className="text-slate-500 text-[10px] md:text-xs">
              /one-time
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed mb-5 min-h-[32px]">
            {product.description}
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-slate-800 mb-5" />

          {/* Features List */}
          <ul className="space-y-2 mb-6">
            {product.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-slate-300"
              >
                <Check
                  className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                    product.popular ? "text-[#f7650b]" : "text-slate-500"
                  }`}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-3 rounded-xl font-bold text-white text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3
            ${
              product.popular
                ? "bg-gradient-to-r from-[#f7650b] to-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                : "bg-slate-800 hover:bg-slate-700 border border-slate-700"
            }
        `}
        >
          Get Started
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* --- Hover Glow Effect (Fixed Border Radius) --- */}
      <div
        className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity duration-500`}
        style={{ transform: "translateZ(0px)" }} // Keeps it at base level
      />
    </motion.div>
  );
};

const DigitalProducts = () => {
  return (
    <section className="relative w-full bg-slate-950 py-16 md:py-20 px-4 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#f7650b]/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-900 border border-slate-800 text-[#f7650b] text-[10px] font-bold tracking-widest uppercase mb-3">
            Unlock Your Potential
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Path to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7650b] to-orange-400">
              Mastery
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-sm mx-auto">
            Select the package that fits your goals. Start out or scale up.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={product.popular ? "md:-mt-6 md:-mb-6" : ""}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalProducts;
