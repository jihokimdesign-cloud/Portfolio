import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

type Props = {
  num?: string;
  kicker?: string;
  title: string;
};

const SectionTitle = ({ num, kicker, title }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const eyebrow = [num, kicker].filter(Boolean).join(" — ");

  return (
    <div
      ref={ref}
      className="col-span-full md:col-start-2 md:col-span-4 pt-48"
    >
      {eyebrow && (
        <motion.div
          className="text-xs font-bold uppercase tracking-[.14em]"
          style={{ color: "var(--accent, currentColor)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{
            duration: AnimationConfig.SLOW,
            ease: AnimationConfig.EASING,
          }}
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        className="mt-5 text-3xl md:text-4xl xl:text-5xl font-light leading-[1.08] -tracking-[.035em] max-w-[20ch]"
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 16,
        }}
        transition={{
          duration: AnimationConfig.SLOW,
          ease: AnimationConfig.EASING,
          delay: 0.06,
        }}
      >
        {title}
      </motion.h2>
    </div>
  );
};

export default SectionTitle;
