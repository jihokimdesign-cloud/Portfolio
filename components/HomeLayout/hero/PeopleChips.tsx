import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PEOPLE_CHIPS } from "./heroContent";

/* Flat illustrated portraits (Notion-style), drawn as SVG — no real photos.
   Varied skin tones, hair, glasses, and pastel tops. */
const SKINS = ["#f6c9a4", "#e0a579", "#c68642", "#8d5524", "#ffd9b8"];
const TOPS = ["#b9d4ff", "#ffd1e3", "#c7efd6", "#ffe3b0", "#e2d6ff"];
const HAIRS = ["#2a2a2a", "#5a3825", "#161616", "#6b4f2a", "#454545"];

function Avatar({ i, size = 26 }: { i: number; size?: number }) {
  const skin = SKINS[i % SKINS.length];
  const top = TOPS[(i * 2) % TOPS.length];
  const hair = HAIRS[(i * 3) % HAIRS.length];
  const glasses = i % 2 === 1;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <clipPath id={`c${i}`}>
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${i})`}>
        <rect width="40" height="40" fill={top} opacity="0.5" />
        {/* shoulders */}
        <circle cx="20" cy="40" r="15" fill={top} />
        {/* head */}
        <circle cx="20" cy="19" r="10" fill={skin} />
        {/* hair cap */}
        <path
          d="M10 18 A10 10 0 0 1 30 18 L30 13 A10 10 0 0 0 10 13 Z"
          fill={hair}
        />
        {/* eyes */}
        <circle cx="16.5" cy="19" r="1.2" fill="#1a1a1a" />
        <circle cx="23.5" cy="19" r="1.2" fill="#1a1a1a" />
        {glasses && (
          <g stroke="#1a1a1a" strokeWidth="0.9" fill="none" opacity="0.8">
            <circle cx="16.5" cy="19" r="2.6" />
            <circle cx="23.5" cy="19" r="2.6" />
            <line x1="19.1" y1="19" x2="20.9" y2="19" />
          </g>
        )}
      </g>
    </svg>
  );
}

function AvatarStack({ count, base }: { count: number; base: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="people-avatars">
      {Array.from({ length: count }).map((_, k) => (
        <motion.span
          key={k}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1 + k * 0.07,
            type: "spring",
            stiffness: 460,
            damping: 20,
          }}
          style={{ display: "inline-flex" }}
        >
          <Avatar i={base + k} />
        </motion.span>
      ))}
    </span>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  const ref = useRef<number>();
  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    const dur = 900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, reduce]);
  return (
    <span className="people-num">
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function AccessibilityChip() {
  const reduce = useReducedMotion();
  return (
    <div className="people-chip">
      <span
        aria-hidden
        style={{
          display: "inline-flex",
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "var(--accent)",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {/* universal access glyph */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="4" r="1.8" />
          <path
            d="M4 8h16M12 7v5m0 0l-3.5 6M12 12l3.5 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
      <span style={{ display: "flex", flexDirection: "column" }}>
        <span className="people-num" style={{ fontSize: 13 }}>
          WCAG 2.2 AA
        </span>
        <span className="people-label">accessible for everyone</span>
      </span>
      {/* green circle pop + check draw */}
      <motion.span
        aria-hidden
        initial={reduce ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 500, damping: 18 }}
        style={{
          display: "inline-flex",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "var(--status-green)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M5 12.5l4 4 10-10"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          />
        </svg>
      </motion.span>
    </div>
  );
}

// corners around the headline: 2 left, 2 right, slightly tilted — tucked into
// the gaps above line 1 and below line 4 so they clear the (wide) headline.
const POS = [
  { top: "40%", left: "1%", rotate: -4 },
  { top: "56%", left: "0%", rotate: 3 },
  { top: "40%", right: "0%", rotate: 4 },
  { top: "55%", right: "0%", rotate: -3 },
];

export default function PeopleChips() {
  const reduce = useReducedMotion();
  return (
    <>
      {PEOPLE_CHIPS.map((c, i) => (
        <motion.div
          key={c.label}
          initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
          style={{
            position: "absolute",
            ...POS[i],
            rotate: `${POS[i].rotate}deg`,
          }}
        >
          <div className="people-chip">
            <AvatarStack count={i === 2 ? 4 : 3} base={i * 3} />
            <span style={{ display: "flex", flexDirection: "column" }}>
              <CountUp value={c.value} suffix={c.suffix} />
              <span className="people-label">{c.label}</span>
            </span>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
        transition={{ delay: 0.18, type: "spring", stiffness: 300, damping: 24 }}
        style={{ position: "absolute", ...POS[3], rotate: `${POS[3].rotate}deg` }}
      >
        <AccessibilityChip />
      </motion.div>
    </>
  );
}
