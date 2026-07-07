import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

// Interactive recreation of Cheffy's adaptive mode switch —
// the real product UI is confidential, so this demo stands in for it.
const ElbowDemo = () => {
  const [isMacro, setIsMacro] = useState(false);

  const signals = [
    { label: "Voice", value: isMacro ? "failed · 72dB" : "listening", tripped: isMacro },
    { label: "Gesture", value: isMacro ? "conf. 34%" : "conf. 92%", tripped: isMacro },
    { label: "Proximity", value: isMacro ? "< 30cm" : "—", tripped: isMacro },
  ];

  return (
    <div className="col-span-full md:col-start-2 md:col-span-4 mt-16 mb-8">
      <div className="grid md:grid-cols-[1fr_2fr] gap-4">
        {/* signal readout */}
        <div className="flex md:flex-col gap-2">
          {signals.map((signal, index) => (
            <div
              key={index}
              className={`flex-1 rounded-xl ring-1 ring-current p-4 transition-opacity duration-300 ${
                signal.tripped ? "ring-opacity-40" : "ring-opacity-10 opacity-60"
              }`}
            >
              <div className="text-xs uppercase tracking-[.14em] font-bold opacity-50">
                {signal.label}
              </div>
              <div className="mt-2 text-sm leading-snug">{signal.value}</div>
            </div>
          ))}
        </div>

        {/* device */}
        <div
          className="relative overflow-hidden rounded-xl ring-1 ring-current ring-opacity-20 aspect-[4/3] cursor-pointer select-none"
          onPointerEnter={() => setIsMacro(true)}
          onPointerLeave={() => setIsMacro(false)}
          onClick={() => setIsMacro((prev) => !prev)}
        >
          {/* recipe screen */}
          <div className="absolute inset-0 p-5 flex flex-col">
            <div className="flex flex-row justify-between items-baseline">
              <div>
                <div className="leading-tight">Kimchi Jjigae</div>
                <div className="text-sm opacity-50 mt-1">
                  Step 3/8 · Sauté aromatics
                </div>
              </div>
              <div className="text-sm opacity-50">12:40</div>
            </div>
            {/* video area */}
            <div className="flex-1 mt-4 rounded-lg bg-current opacity-[.07]" />
            {/* standard controls */}
            <div className="flex flex-row gap-2 mt-4">
              {["◀ Prev", "Pause", "Next ▶"].map((control, index) => (
                <div
                  key={index}
                  className="flex-1 text-center text-sm py-2 rounded-lg ring-1 ring-current ring-opacity-20 opacity-70"
                >
                  {control}
                </div>
              ))}
            </div>
          </div>

          {/* elbow-bump overlay */}
          <AnimatePresence>
            {isMacro && (
              <motion.div
                className="absolute left-0 right-0 bottom-0 h-1/2 flex flex-col items-center justify-center rounded-t-xl ring-1 ring-current backdrop-blur-sm"
                style={{ backgroundColor: "rgba(127,127,127,.18)" }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{
                  duration: 0.4,
                  ease: AnimationConfig.EASING,
                }}
              >
                <div className="text-xs uppercase tracking-[.14em] font-bold opacity-60">
                  Elbow-Bump Mode
                </div>
                <div className="text-2xl md:text-3xl font-light mt-2">
                  Next Step →
                </div>
                <div className="text-sm opacity-50 mt-2">tap anywhere</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* idle hint */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white pointer-events-none"
            animate={{ opacity: isMacro ? 0 : 1 }}
            transition={{
              duration: AnimationConfig.NORMAL,
              ease: AnimationConfig.EASING,
            }}
          >
            hover or tap — simulate leaning in
          </motion.div>
        </div>
      </div>
      <div className="text-sm opacity-40 mt-4 max-w-[50ch]">
        Interactive recreation of the mode switch. All three signals trip → the
        bottom half becomes one elbow-sized target, in 400ms.
      </div>
    </div>
  );
};

export default ElbowDemo;
