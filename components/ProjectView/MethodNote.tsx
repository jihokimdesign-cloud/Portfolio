import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

// Progressive-disclosure rigor: the methodology behind a claim, closed by
// default so the skim path stays untouched. Recruiters skip it; design leads
// open it. One MethodNote per big claim, not per section.
type MethodNoteItem = {
  label: string; // e.g. "Design", "Control", "Measured"
  text: string;
};

type Props = {
  label?: string; // eyebrow, e.g. "Method"
  title: string; // the visible one-liner, e.g. "How the study was designed"
  items: MethodNoteItem[];
};

const MethodNote = ({ label = "Method", title, items }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="col-span-full md:col-start-2 md:col-span-3 my-8 text-base">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="group flex w-full items-baseline gap-4 py-3 text-left border-t border-b transition-opacity opacity-60 hover:opacity-100"
        style={{
          borderColor: "color-mix(in srgb, currentColor 30%, transparent)",
        }}
      >
        <span className="text-xs font-bold uppercase tracking-[.14em] whitespace-nowrap">
          {label}
        </span>
        <span className="leading-snug">{title}</span>
        <motion.span
          className="ml-auto text-lg leading-none select-none"
          style={{ color: "var(--accent, currentColor)" }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: AnimationConfig.FAST,
            ease: AnimationConfig.EASING,
          }}
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{
          duration: AnimationConfig.NORMAL,
          ease: AnimationConfig.EASING,
        }}
        className="overflow-hidden"
      >
        <div
          className="py-5 flex flex-col gap-4 border-b"
          style={{
            borderColor: "color-mix(in srgb, currentColor 30%, transparent)",
          }}
        >
          {items.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="text-xs font-bold uppercase tracking-[.14em] opacity-50 w-24 shrink-0 pt-[3px]">
                {item.label}
              </div>
              <div className="opacity-80 leading-relaxed">{item.text}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MethodNote;
