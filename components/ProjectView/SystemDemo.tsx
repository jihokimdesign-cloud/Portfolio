import React, { useState } from "react";
import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

// A living specimen of the Sidewalk validation-button system —
// click a state to inspect its tokens and the compliance it inherits.
interface Spec {
  name: string;
  token: string;
  hex: string;
  contrast: string;
  style: React.CSSProperties;
}

const SPECS: Spec[] = [
  {
    name: "Validated correct",
    token: "--canopy",
    hex: "#16a34a",
    contrast: "4.8:1",
    style: { backgroundColor: "#16a34a", color: "#ffffff" },
  },
  {
    name: "Validated incorrect",
    token: "--brick",
    hex: "#b91c1c",
    contrast: "6.4:1",
    style: { backgroundColor: "#b91c1c", color: "#ffffff" },
  },
  {
    name: "Unsure",
    token: "--amber-deep",
    hex: "#92600a",
    contrast: "5.1:1",
    style: { backgroundColor: "#fef3c7", color: "#92600a" },
  },
  {
    name: "Unvalidated",
    token: "--ink",
    hex: "#1c1917",
    contrast: "15.2:1",
    style: {
      backgroundColor: "transparent",
      color: "inherit",
      boxShadow: "inset 0 0 0 1.5px currentColor",
    },
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
        {/* specimen */}
        <div className="rounded-xl ring-1 ring-current ring-opacity-15 p-6 flex flex-wrap items-center gap-3">
          {SPECS.map((spec, index) => (
            <button
              key={index}
              onClick={() => setActive(spec)}
              className={`px-4 rounded-lg text-sm font-medium min-h-[44px] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
                active.name === spec.name ? "scale-105" : "opacity-90"
              }`}
              style={spec.style}
            >
              {spec.name}
            </button>
          ))}
        </div>

        {/* token readout */}
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

      <div className="text-sm opacity-40 mt-4 max-w-[50ch]">
        Every state resolves to one token, mirrored 1:1 in SCSS — compliance is inherited,
        not re-checked per feature.
      </div>
    </div>
  );
};

export default SystemDemo;
