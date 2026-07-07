import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

// A turning-point callout — full opacity against the 60%-opacity body text,
// so narrative beats surface when skimming.
type Props = {
  label?: string; // e.g. "The insight", "Turning point"
  children: React.ReactNode;
};

const Insight = ({ label = "The insight", children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className="col-span-full md:col-start-2 md:col-span-3 mt-20 mb-12 border-l-2 pl-6"
      style={{ borderColor: "var(--accent, currentColor)" }}
      initial={{ opacity: 0, x: -12 }}
      animate={{
        opacity: isInView ? 1 : 0,
        x: isInView ? 0 : -12,
      }}
      transition={{
        duration: AnimationConfig.SLOW,
        ease: AnimationConfig.EASING,
      }}
    >
      <div className="text-xs font-bold uppercase tracking-[.14em] opacity-50">
        {label}
      </div>
      <div className="mt-3 text-xl md:text-2xl font-light leading-[1.2] -tracking-[.02em]">
        {children}
      </div>
    </motion.div>
  );
};

export default Insight;
