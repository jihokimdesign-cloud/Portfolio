import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

interface Bar {
  label: string;
  value: number; // 0–100
  display?: string; // shown at the end of the bar, defaults to `${value}%`
  note?: string;
  highlight?: boolean;
}

type Props = {
  bars: Bar[];
  caption?: string;
};

const Bars = ({ bars, caption }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <div
      ref={ref}
      className="col-span-full md:col-start-2 md:col-span-3 row-start-auto mt-16 mb-8"
    >
      {bars.map((bar, index) => (
        <div key={index} className="mt-4 first:mt-0">
          <div className="flex flex-row justify-between text-sm leading-tight mb-1">
            <div className={bar.highlight ? "" : "opacity-60"}>
              {bar.label}
              {bar.note && (
                <span className="opacity-50"> — {bar.note}</span>
              )}
            </div>
            <div className={bar.highlight ? "" : "opacity-60"}>
              {bar.display ?? `${bar.value}%`}
            </div>
          </div>
          <div className="h-[6px] rounded-full bg-current opacity-[.12]" />
          <motion.div
            className={`h-[6px] rounded-full bg-current -mt-[6px] ${
              bar.highlight ? "" : "opacity-50"
            }`}
            initial={{ width: "0%" }}
            animate={{ width: isInView ? `${bar.value}%` : "0%" }}
            transition={{
              duration: 1,
              ease: AnimationConfig.EASING,
              delay: index * 0.09,
            }}
          />
        </div>
      ))}
      {caption && (
        <div className="text-sm opacity-40 mt-4 max-w-[50ch]">{caption}</div>
      )}
    </div>
  );
};

export default Bars;
