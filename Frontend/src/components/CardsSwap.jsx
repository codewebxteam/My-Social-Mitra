import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { Check, ArrowRight, Zap, Crown, Star, Bookmark } from "lucide-react";

// ==========================================
// SECTION 1: CARD DESIGNS
// ==========================================

const StarterCard = () => (
  <div className="w-full h-full bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-bl-[4rem] -mr-4 -mt-4 z-0 transition-transform duration-700 group-hover:scale-110" />
    <div className="relative z-10">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 md:mb-6">
        <Zap className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-slate-900">
        Pro Starter
      </h3>
      <p className="text-slate-500 mt-2 text-xs md:text-sm leading-relaxed font-medium">
        Chapter 1: The Fundamentals.
      </p>
    </div>
    <div className="relative z-10">
      <div className="flex items-baseline gap-1 mb-4 md:mb-6">
        <span className="text-3xl md:text-4xl font-bold text-slate-900">
          ₹999
        </span>
        <span className="text-slate-400 text-xs md:text-sm font-medium">
          /mo
        </span>
      </div>
      <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
        {["5 Core Courses", "Community Access", "Weekly Assignments"].map(
          (item) => (
            <li
              key={item}
              className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-600 font-medium"
            >
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" />
              </div>
              {item}
            </li>
          )
        )}
      </ul>
      <button className="w-full py-3 md:py-3.5 rounded-xl border border-slate-200 text-slate-900 font-bold text-xs md:text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
        Open Chapter <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </button>
    </div>
  </div>
);

const SupremeCard = () => (
  <div className="w-full h-full bg-gradient-to-br from-[#f7650b] to-[#e05a09] rounded-[1.5rem] md:rounded-[2rem] shadow-2xl shadow-orange-500/40 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden border border-white/20 group">
    {/* --- FIX: Badge moved inside the card with proper spacing --- */}
    <div
      className="absolute top-4 right-4 md:top-6 md:right-6 z-50"
      style={{ transform: "translateZ(60px)" }}
    >
      <span className="px-3 py-1 md:px-4 md:py-1.5 bg-white text-[#f7650b] text-[10px] md:text-xs font-bold rounded-full shadow-xl uppercase tracking-wider flex items-center gap-1">
        <Crown className="w-3 h-3" /> Best Value
      </span>
    </div>

    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl transition-transform group-hover:scale-110 duration-700" />
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-400/30 rounded-full blur-3xl" />
    <div className="relative z-10">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-inner border border-white/20">
        <Crown className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-white">Supreme</h3>
      <p className="text-orange-100 mt-2 text-xs md:text-sm leading-relaxed font-medium">
        The Complete Collection.
      </p>
    </div>
    <div className="relative z-10">
      <div className="flex items-baseline gap-1 mb-4 md:mb-6">
        <span className="text-3xl md:text-4xl font-bold text-white">
          ₹4,999
        </span>
        <span className="text-orange-100 text-xs md:text-sm font-medium">
          /mo
        </span>
      </div>
      <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
        {[
          "All Features",
          "1-on-1 Mentorship",
          "Job Placement",
          "Lifetime Access",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-white font-medium"
          >
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
            </div>
            {item}
          </li>
        ))}
      </ul>
      <button className="w-full py-3 md:py-3.5 rounded-xl bg-white text-[#f7650b] font-bold text-xs md:text-sm hover:bg-orange-50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
        Start Reading <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </button>
    </div>
  </div>
);

const PremiumCard = () => (
  <div className="w-full h-full bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] border border-slate-800 shadow-2xl shadow-slate-900/50 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
    <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors duration-500" />
    <div className="relative z-10">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 border border-slate-700 shadow-lg">
        <Star className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-white">
        Premium Elite
      </h3>
      <p className="text-slate-400 mt-2 text-xs md:text-sm leading-relaxed font-medium">
        Advanced Strategies.
      </p>
    </div>
    <div className="relative z-10">
      <div className="flex items-baseline gap-1 mb-4 md:mb-6">
        <span className="text-3xl md:text-4xl font-bold text-white">
          ₹2,499
        </span>
        <span className="text-slate-500 text-xs md:text-sm font-medium">
          /mo
        </span>
      </div>
      <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
        {[
          "12 Advanced Courses",
          "Priority Support",
          "Real-world Case Studies",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-300 font-medium"
          >
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-purple-400" />
            </div>
            {item}
          </li>
        ))}
      </ul>
      <button className="w-full py-3 md:py-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 font-bold text-xs md:text-sm hover:bg-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2">
        Upgrade <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </button>
    </div>
  </div>
);

// ==========================================
// SECTION 2: THE ENGINE (Logic)
// ==========================================

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${
      customClass ?? ""
    } ${rest.className ?? ""}`.trim()}
  />
));
Card.displayName = "Card";

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const SwapEngine = ({
  width,
  height,
  cardDistance,
  verticalDistance,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(
        r.current,
        makeSlot(i, cardDistance, verticalDistance, total),
        skewAmount
      )
    );

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=300",
        opacity: 0,
        rotation: -5,
        duration: config.durDrop,
        ease: "power2.in",
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length
      );
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, {
            zIndex: backSlot.zIndex,
            opacity: 0,
            rotation: 0,
          });
        },
        undefined,
        "return"
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          opacity: 1,
          duration: config.durReturn,
          ease: "power2.out",
        },
        "return"
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child
  );

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center perspective-[900px] overflow-visible z-20"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

// ==========================================
// SECTION 3: THE CLEAN LAYOUT (Responsive)
// ==========================================

const CardsSwap = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Responsive Dimensions
  const cardWidth = isMobile ? "280px" : "320px";
  const cardHeight = isMobile ? "400px" : "480px";
  const cardDist = isMobile ? 30 : 45;
  const vertDist = isMobile ? 40 : 55;

  return (
    <section className="w-full bg-transparent pt-16 md:pt-24 pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-auto lg:min-h-[700px] items-center gap-12 lg:gap-0">
            {/* --- TOP (Mobile) / LEFT (Desktop): Content --- */}
            <div className="flex flex-col justify-center relative z-10 w-full order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold tracking-wider uppercase mb-6 w-fit">
                <Bookmark className="w-3 h-3" />
                The Syllabus
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4 md:mb-6">
                Write Your Own <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7650b] to-orange-600">
                  Success Story.
                </span>
              </h2>

              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
                Don't just read about digital mastery—live it. Choose the
                chapter that fits your career goals and start learning today.
              </p>

              <div className="space-y-5 md:space-y-6">
                {[
                  {
                    num: 1,
                    title: "Foundation",
                    desc: "Build your skills from the ground up.",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    num: 2,
                    title: "Acceleration",
                    desc: "Advanced tools to scale your reach.",
                    color: "bg-purple-50 text-purple-600",
                  },
                  {
                    num: 3,
                    title: "Domination",
                    desc: "Lead the market with expert mentorship.",
                    color: "bg-orange-50 text-[#f7650b]",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex gap-4 group cursor-default"
                  >
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${item.color} flex items-center justify-center font-bold text-lg md:text-xl group-hover:scale-110 transition-transform`}
                    >
                      {item.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- BOTTOM (Mobile) / RIGHT (Desktop): 3D Cards --- */}
            <div className="w-full flex items-center justify-center relative overflow-visible order-2 mt-10 lg:mt-0">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-52 h-52 md:w-64 md:h-64 bg-orange-200/20 rounded-full blur-[80px]" />
              </div>

              <SwapEngine
                width={cardWidth}
                height={cardHeight}
                cardDistance={cardDist}
                verticalDistance={vertDist}
                delay={3500}
                skewAmount={3}
              >
                <Card>
                  <StarterCard />
                </Card>
                <Card>
                  <PremiumCard />
                </Card>
                <Card>
                  <SupremeCard />
                </Card>
              </SwapEngine>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardsSwap;
