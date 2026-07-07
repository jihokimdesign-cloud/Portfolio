import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

interface FlowNode {
  label?: string; // small caps eyebrow, e.g. "Trigger 1" / "Phase 1"
  title: string;
  note?: string;
  state?: "fail" | "pass" | "result";
}

type Props = {
  nodes: FlowNode[];
  separator?: string; // glyph between nodes, defaults to "→"
  caption?: string;
};

const stateChip = {
  fail: "✗",
  pass: "✓",
};

const Flow = ({ nodes, separator = "→", caption }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <div className="col-span-full md:col-start-2 md:col-span-4 mt-16 mb-8" ref={ref}>
      <div className="flex flex-col md:flex-row md:items-stretch gap-2">
        {nodes.map((node, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <motion.div
                className="flex items-center justify-center opacity-40 text-lg px-1 rotate-90 md:rotate-0 self-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 0.4 : 0 }}
                transition={{
                  duration: AnimationConfig.NORMAL,
                  ease: AnimationConfig.EASING,
                  delay: index * 0.12,
                }}
              >
                {separator}
              </motion.div>
            )}
            <motion.div
              className={`flex-1 rounded-xl p-5 ring-1 ring-current ${
                node.state === "result"
                  ? "ring-opacity-40"
                  : "ring-opacity-10"
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 16,
              }}
              transition={{
                duration: AnimationConfig.SLOW,
                ease: AnimationConfig.EASING,
                delay: index * 0.12,
              }}
            >
              <div className="flex flex-row justify-between items-baseline text-xs uppercase tracking-[.14em] font-bold opacity-50">
                <div>{node.label}</div>
                {node.state && node.state !== "result" && (
                  <div>{stateChip[node.state]}</div>
                )}
              </div>
              <div className="mt-3 leading-snug">{node.title}</div>
              {node.note && (
                <div className="mt-1 text-sm opacity-60 leading-snug">
                  {node.note}
                </div>
              )}
            </motion.div>
          </React.Fragment>
        ))}
      </div>
      {caption && (
        <div className="text-sm opacity-40 mt-4 max-w-[50ch]">{caption}</div>
      )}
    </div>
  );
};

export default Flow;
