import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { TOOL_ICONS } from "./heroContent";

/* §4-3 — "code" hover. DclFlow (Design → Code → Live) goes in the centered
   above-layer; ToolColumn renders the tool tiles inside a side column.
   Class names are distinct (.dcl-*, .tool-tile) to avoid the featured
   panel's .win / .pf. */

const C = {
  punct: "#8b949e",
  tag: "#79c0ff",
  attr: "#ffa657",
  value: "#d2a8ff",
  text: "#c9d1d9",
};
type Tok = { t: string; c: string };
const CODE: Tok[] = [
  { t: "<", c: C.punct },
  { t: "Step", c: C.tag },
  { t: " ", c: C.text },
  { t: "voice", c: C.attr },
  { t: "=", c: C.punct },
  { t: "{on}", c: C.value },
  { t: " />", c: C.punct },
  { t: "\n", c: C.text },
  { t: "<", c: C.punct },
  { t: "Button", c: C.tag },
  { t: " ", c: C.text },
  { t: "big", c: C.attr },
  { t: ">", c: C.punct },
  { t: "Next", c: C.text },
  { t: "</", c: C.punct },
  { t: "Button", c: C.tag },
  { t: ">", c: C.punct },
];

function CodeWindow() {
  const reduce = useReducedMotion();
  const total = CODE.reduce((n, k) => n + k.t.length, 0);
  const [shown, setShown] = useState(reduce ? total : 0);
  const raf = useRef<number>();

  useEffect(() => {
    if (reduce) return;
    const begin = performance.now() + 700;
    const per = 26;
    const tick = (now: number) => {
      const elapsed = now - begin;
      if (elapsed > 0) setShown(Math.min(total, Math.floor(elapsed / per)));
      if (elapsed < total * per) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduce, total]);

  // split tokens into lines; each token keeps a full copy (hidden chars reserve
  // width so the window never resizes) and a visible slice up to `shown`.
  let budget = shown;
  const lines: { text: string; c: string; show: number }[][] = [[]];
  for (const tok of CODE) {
    if (tok.t === "\n") {
      lines.push([]);
      continue;
    }
    const show = Math.max(0, Math.min(tok.t.length, budget));
    lines[lines.length - 1].push({ text: tok.t, c: tok.c, show });
    budget -= show;
  }
  let cursorLine = 0;
  lines.forEach((ln, li) => {
    if (ln.some((t) => t.show > 0)) cursorLine = li;
  });

  return (
    <div className="dcl-codewin">
      <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span
            key={c}
            style={{ width: 8, height: 8, borderRadius: "50%", background: c }}
          />
        ))}
      </div>
      <pre style={{ margin: 0, lineHeight: 1.7, minHeight: 38 }}>
        {lines.map((line, li) => (
          <div key={li}>
            {line.map((tok, ti) => (
              <span key={ti}>
                <span style={{ color: tok.c }}>{tok.text.slice(0, tok.show)}</span>
                <span style={{ visibility: "hidden" }}>
                  {tok.text.slice(tok.show)}
                </span>
              </span>
            ))}
            {li === cursorLine && shown < total && !reduce && (
              <span className="ai-type-cursor" aria-hidden />
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}

function Node({
  label,
  delay,
  children,
}: {
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : delay, duration: 0.3 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="dcl-node-label">{label}</div>
      {children}
    </motion.div>
  );
}

function Dash() {
  return (
    <svg width="34" height="12" viewBox="0 0 34 12" style={{ flexShrink: 0 }}>
      <path className="dcl-dash" d="M1 6 H33" />
    </svg>
  );
}

// ── the centered flow (lives in the above-layer) ──
export default function DclFlow() {
  const reduce = useReducedMotion();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <Node label="Design" delay={0.1}>
        <div className="dcl-card" style={{ width: 92, height: 64, padding: 10 }}>
          <div
            style={{
              height: 8,
              width: "60%",
              borderRadius: 3,
              background: "var(--hero-fg3)",
              opacity: 0.5,
              marginBottom: 6,
            }}
          />
          <div
            style={{
              height: 6,
              width: "85%",
              borderRadius: 3,
              background: "var(--hero-fg3)",
              opacity: 0.3,
              marginBottom: 5,
            }}
          />
          <div
            style={{
              height: 18,
              width: "50%",
              borderRadius: 5,
              background: "var(--accent)",
              opacity: 0.25,
            }}
          />
        </div>
      </Node>

      <Dash />

      <Node label="Code" delay={0.55}>
        <CodeWindow />
      </Node>

      <Dash />

      <Node label="Live" delay={2.1}>
        <div
          className="dcl-card"
          style={{ width: 92, height: 64, padding: 10, position: "relative" }}
        >
          <motion.span
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: reduce ? 0 : 2.35, type: "spring", stiffness: 420, damping: 18 }}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: 8,
              color: "var(--status-green)",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--status-green)",
              }}
            />
            live
          </motion.span>
          <motion.div
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: reduce ? 0 : 2.2, type: "spring", stiffness: 420, damping: 18 }}
            style={{
              position: "absolute",
              left: 10,
              bottom: 12,
              padding: "5px 10px",
              borderRadius: 7,
              background: "var(--accent)",
              color: "#fff",
              fontSize: 9,
              fontWeight: 510,
            }}
          >
            Next step
          </motion.div>
        </div>
      </Node>
    </div>
  );
}

// ── tool tiles (live in the side columns) ──
function ToolTile({ name, src }: { name: string; src: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="tool-tile">
        <Image src={src} alt={name} width={26} height={26} />
      </div>
      <span className="tool-name">{name}</span>
    </div>
  );
}

type ToolSlot = { i: number; top: string; tilt: number };
const LEFT_TOOLS: ToolSlot[] = [
  { i: 0, top: "0%", tilt: -6 }, // Figma
  { i: 1, top: "40%", tilt: 5 }, // Claude
  { i: 2, top: "74%", tilt: -4 }, // Cursor
];
const RIGHT_TOOLS: ToolSlot[] = [
  { i: 3, top: "2%", tilt: 6 }, // React
  { i: 4, top: "46%", tilt: -6 }, // After Effects
];

export function ToolColumn({ side }: { side: "left" | "right" }) {
  const reduce = useReducedMotion();
  const slots = side === "left" ? LEFT_TOOLS : RIGHT_TOOLS;
  return (
    <>
      {slots.map((s, k) => {
        const tool = TOOL_ICONS[s.i];
        return (
          <motion.div
            key={tool.name}
            className="hero-floaty"
            initial={reduce ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, rotate: s.tilt }}
            transition={{ delay: 0.1 + k * 0.06, type: "spring", stiffness: 320, damping: 20 }}
            style={{
              position: "absolute",
              top: s.top,
              [side === "left" ? "right" : "left"]: 4,
            }}
          >
            <ToolTile name={tool.name} src={tool.src} />
          </motion.div>
        );
      })}
    </>
  );
}
