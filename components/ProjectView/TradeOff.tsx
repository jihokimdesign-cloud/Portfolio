import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

interface Option {
  label: string; // e.g. "A" or "Engineering"
  title: string;
  text: string;
  verdict?: string; // one-line consequence shown at the bottom
  selected?: boolean;
}

type Props = {
  options: Option[];
};

const TradeOff = ({ options }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <div
      ref={ref}
      className="col-span-full md:col-start-2 md:col-span-4 grid md:grid-cols-2 gap-4 mt-16 mb-8"
    >
      {options.map((option, index) => (
        <motion.div
          key={index}
          className={`rounded-xl p-6 ring-1 ring-current ${
            option.selected ? "ring-opacity-40" : "ring-opacity-10 opacity-60"
          }`}
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: isInView ? (option.selected ? 1 : 0.6) : 0,
            y: isInView ? 0 : 16,
          }}
          transition={{
            duration: AnimationConfig.SLOW,
            ease: AnimationConfig.EASING,
            delay: index * 0.1,
          }}
        >
          <div className="flex flex-row justify-between items-baseline text-sm">
            <div className="opacity-60">{option.label}</div>
            {option.selected && (
              <div className="px-2 py-[2px] rounded-full ring-1 ring-current text-xs">
                Selected
              </div>
            )}
          </div>
          <div className="mt-4 md:text-xl leading-tight">{option.title}</div>
          <div className="mt-2 text-sm md:text-base opacity-60 leading-snug">
            {option.text}
          </div>
          {option.verdict && (
            <div className="mt-4 text-sm opacity-80 leading-snug">
              {option.verdict}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TradeOff;
