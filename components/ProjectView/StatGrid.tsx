import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

interface Stat {
  value: string;
  label: string;
  sub?: string;
}

type Props = {
  stats: Stat[];
};

const COUNT_DURATION = 1400;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// animate the last number found in the value string, keep the rest static
const useCountUp = (value: string, isInView: boolean) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/(\d+(?:\.\d+)?)(?!.*\d)/);
    if (!match || match.index === undefined) {
      setDisplay(value);
      return;
    }
    const target = parseFloat(match[1]);
    const decimals = (match[1].split(".")[1] || "").length;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice(match.index + match[1].length);

    if (!isInView) {
      setDisplay(`${prefix}${(0).toFixed(decimals)}${suffix}`);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_DURATION, 1);
      const current = target * easeOutCubic(progress);
      setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, isInView]);

  return display;
};

const StatItem = ({
  stat,
  isInView,
  index,
}: {
  stat: Stat;
  isInView: boolean;
  index: number;
}) => {
  const display = useCountUp(stat.value, isInView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 16,
      }}
      transition={{
        duration: AnimationConfig.SLOW,
        ease: AnimationConfig.EASING,
        delay: index * 0.08,
      }}
    >
      <div className="text-4xl lg:text-6xl font-light -tracking-[.04em] whitespace-nowrap">
        {display}
      </div>
      <div className="text-sm mt-2 opacity-60 leading-tight">{stat.label}</div>
      {stat.sub && (
        <div className="text-sm opacity-40 leading-tight mt-1">{stat.sub}</div>
      )}
    </motion.div>
  );
};

const StatGrid = ({ stats }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <div
      ref={ref}
      className="col-span-full md:col-start-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 mt-24 mb-32"
    >
      {stats.map((stat, index) => (
        <StatItem key={index} stat={stat} isInView={isInView} index={index} />
      ))}
    </div>
  );
};

export default StatGrid;
