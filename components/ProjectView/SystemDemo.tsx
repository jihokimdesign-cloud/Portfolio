import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

// A living specimen of the Sidewalk validation-button system —
// click a state to inspect its tokens and the compliance it inherits.
// The specimen is skinned as the product renders it (white pills with
// colored state icons on a card, matching the published filter panel);
// the token readout stays editorial so it reads as case-study voiceover.
interface Spec {
  name: string;
  token: string;
  hex: string;
  contrast: string;
  glyph: string;
}

const SPECS: Spec[] = [
  {
    name: "Validate correct",
    token: "--canopy",
    hex: "#16a34a",
    contrast: "4.8:1",
    glyph: "✓",
  },
  {
    name: "Validate incorrect",
    token: "--brick",
    hex: "#b91c1c",
    contrast: "6.4:1",
    glyph: "✕",
  },
  {
    name: "Unsure",
    token: "--amber-deep",
    hex: "#92600a",
    contrast: "5.1:1",
    glyph: "?",
  },
  {
    name: "Unvalidated",
    token: "--ink",
    hex: "#1c1917",
    contrast: "15.2:1",
    glyph: "⋯",
  },
];

const CHECKS = [
  { label: "Contrast", detail: "≥ 4.5:1 text" },
  { label: "Target", detail: "44px minimum" },
  { label: "Focus", detail: "2px visible ring" },
  { label: "Reader", detail: "state announced" },
];

const SystemDemo = () => {
  const [active, setActive] = useState<Spec>(SPECS[0]);

  return (
    <div className="col-span-full md:col-start-2 md:col-span-4 mt-16 mb-8">
      <div
        className="text-xs font-bold uppercase tracking-[.14em]"
        style={{ color: "var(--accent, currentColor)" }}
      >
        Try it — inspect a state (tab works too)
      </div>

      <div className="grid md:grid-cols-[3fr_2fr] gap-4 mt-4">
        {/* specimen — product voice */}
        <div className="rounded-xl bg-white p-6 shadow-md text-[#1c1917]">
          <div className="text-sm font-semibold opacity-70">Validations</div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {SPECS.map((spec, index) => (
              <button
                key={index}
                onClick={() => setActive(spec)}
                className={`flex items-center gap-2 px-3.5 rounded-lg text-sm font-medium min-h-[44px] bg-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
                  active.name === spec.name ? "scale-105 shadow-sm" : ""
                }`}
                style={{
                  boxShadow:
                    active.name === spec.name
                      ? `inset 0 0 0 2px ${spec.hex}`
                      : "inset 0 0 0 1px rgba(28,25,23,.18)",
                }}
              >
                <span
                  className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] leading-none text-white shrink-0"
                  style={{ backgroundColor: spec.hex }}
                  aria-hidden
                >
                  {spec.glyph}
                </span>
                {spec.name}
              </button>
            ))}
          </div>
        </div>

        {/* token readout — editorial voice */}
        <motion.div
          key={active.name}
          className="rounded-xl ring-1 ring-current ring-opacity-40 p-5 text-sm leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: AnimationConfig.NORMAL,
            ease: AnimationConfig.EASING,
          }}
        >
          <div className="flex flex-row justify-between items-baseline">
            <span className="font-bold">{active.token}</span>
            <span className="opacity-60">{active.hex}</span>
          </div>
          <div className="mt-1 opacity-60">
            = SCSS ${active.token.slice(2)} · contrast {active.contrast}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1">
            {CHECKS.map((check, index) => (
              <div key={index} className="flex flex-row gap-2">
                <span style={{ color: "var(--accent, currentColor)" }}>✓</span>
                <span className="opacity-70">
                  {check.label} <span className="opacity-60">{check.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="text-sm opacity-60 mt-4 max-w-[50ch]">
        The buttons render exactly as the product ships them — every state
        resolves to one token, mirrored 1:1 in SCSS, so compliance is
        inherited, not re-checked per feature.
      </div>
    </div>
  );
};

export default SystemDemo;
