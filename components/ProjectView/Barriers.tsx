import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

interface BarrierItem {
  label?: string; // e.g. "Barrier 01"
  title: string; // e.g. "Commitment debt"
  quote?: string; // the user's words — rendered in the project accent
  text?: string; // short explanation
  solution?: string; // the design answer, paired below a divider
}

type Props = {
  items: BarrierItem[];
  columns?: number; // md+ column count, defaults to items.length (max 3)
};

// Problems deserve their own moment — accent-marked cards,
// each pairing the barrier with the design decision that answers it.
const Barriers = ({ items, columns }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
  const colCount = Math.min(columns ?? items.length, 3);

  return (
    <div
      ref={ref}
      className="col-span-full md:col-start-2 md:col-span-4 grid gap-4 mt-16 mb-8"
      style={{
        gridTemplateColumns: `repeat(1, 1fr)`,
      }}
    >
      <div
        className="grid gap-4 md:grid-cols-[var(--barrier-cols)]"
        style={
          {
            "--barrier-cols": `repeat(${colCount}, 1fr)`,
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="rounded-xl p-6 ring-1 ring-current ring-opacity-15 flex flex-col"
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 16,
            }}
            transition={{
              duration: AnimationConfig.SLOW,
              ease: AnimationConfig.EASING,
              delay: index * 0.1,
            }}
          >
            <div className="flex flex-row justify-between items-baseline">
              <div className="text-xs font-bold uppercase tracking-[.14em] opacity-50">
                {item.label}
              </div>
              <div
                className="text-xs font-bold"
                style={{ color: "var(--accent, currentColor)" }}
              >
                ✗
              </div>
            </div>
            <div className="mt-4 md:text-xl leading-tight">{item.title}</div>
            {item.quote && (
              <div
                className="mt-2 leading-snug"
                style={{ color: "var(--accent, currentColor)" }}
              >
                “{item.quote}”
              </div>
            )}
            {item.text && (
              <div className="mt-2 text-sm md:text-base opacity-60 leading-snug">
                {item.text}
              </div>
            )}
            {item.solution && (
              <div className="mt-auto pt-5">
                <div className="border-t border-current opacity-10" />
                <div className="pt-4 text-sm md:text-base leading-snug flex flex-row gap-2">
                  <span
                    className="shrink-0 font-bold"
                    style={{ color: "var(--accent, currentColor)" }}
                  >
                    →
                  </span>
                  <span className="opacity-80">{item.solution}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Barriers;
