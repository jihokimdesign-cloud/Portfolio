import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

// Interactive recreation of Cheffy's adaptive mode switch.
// The device area is skinned in the product's design language (cream
// surfaces, sage-green pills — matching the published landing shot);
// the signal readout stays in the page's editorial style on purpose,
// so instrumentation reads as case-study voiceover, not product UI.
const cheffy = {
  cream: "#FAF6ED",
  card: "#F1EBDD",
  ink: "#3A372E",
  inkSoft: "rgba(58,55,46,.55)",
  sage: "#7D9878",
  sageDeep: "#6C8767",
  chipBg: "#E7EFE3",
};

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
        {/* signal readout — editorial voice */}
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

        {/* device — product voice */}
        <div
          className="relative rounded-[1.75rem] bg-[#1C1B18] p-2.5 shadow-xl cursor-pointer select-none"
          onPointerEnter={() => setIsMacro(true)}
          onPointerLeave={() => setIsMacro(false)}
          onClick={() => setIsMacro((prev) => !prev)}
        >
          <div
            className="relative overflow-hidden rounded-[1.25rem] aspect-[4/3]"
            style={{ backgroundColor: cheffy.cream, color: cheffy.ink }}
          >
            {/* recipe screen */}
            <div className="absolute inset-0 p-5 flex flex-col">
              <div className="flex flex-row justify-between items-start">
                <div>
                  <div className="font-semibold leading-tight">Kimchi Jjigae</div>
                  <div
                    className="inline-block text-xs font-semibold mt-1.5 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: cheffy.chipBg, color: cheffy.sageDeep }}
                  >
                    Step 3/8 · Sauté aromatics
                  </div>
                </div>
                <div className="text-sm" style={{ color: cheffy.inkSoft }}>
                  12:40
                </div>
              </div>
              {/* video area */}
              <div
                className="flex-1 mt-4 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(150deg, #EBE2CF 0%, #E0D3BC 55%, #D6C6AC 100%)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm shadow-md"
                  style={{ backgroundColor: cheffy.sage }}
                >
                  ▶
                </div>
              </div>
              {/* standard controls */}
              <div className="flex flex-row gap-2 mt-4 text-sm font-semibold">
                <div
                  className="flex-1 text-center py-2 rounded-full bg-white shadow-sm"
                  style={{ color: cheffy.inkSoft }}
                >
                  ◀ Prev
                </div>
                <div
                  className="flex-1 text-center py-2 rounded-full bg-white shadow-sm"
                  style={{ color: cheffy.inkSoft }}
                >
                  Pause
                </div>
                <div
                  className="flex-1 text-center py-2 rounded-full text-white shadow-sm"
                  style={{ backgroundColor: cheffy.sage }}
                >
                  Next ▶
                </div>
              </div>
            </div>

            {/* elbow-bump overlay */}
            <AnimatePresence>
              {isMacro && (
                <motion.div
                  className="absolute left-0 right-0 bottom-0 h-1/2 flex flex-col items-center justify-center rounded-t-[1.25rem] backdrop-blur-sm text-white"
                  style={{ backgroundColor: "rgba(109,135,103,.92)" }}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{
                    duration: 0.4,
                    ease: AnimationConfig.EASING,
                  }}
                >
                  <div className="text-xs uppercase tracking-[.14em] font-bold opacity-80">
                    Elbow-Bump Mode
                  </div>
                  <div className="text-2xl md:text-3xl font-light mt-2">
                    Next Step →
                  </div>
                  <div className="text-sm opacity-70 mt-2">tap anywhere</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* idle hint */}
            <motion.div
              className="absolute bottom-[45%] left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-xs text-white whitespace-nowrap pointer-events-none"
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
      </div>
      <div className="text-sm opacity-60 mt-4 max-w-[50ch]">
        Interactive recreation of the mode switch, in the product&apos;s design
        language. All three signals trip → the bottom half becomes one
        elbow-sized target, in 400ms.
      </div>
    </div>
  );
};

export default ElbowDemo;
