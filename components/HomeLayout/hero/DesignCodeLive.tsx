import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { TOOL_ICONS } from "./heroContent";

/* §4-3 — shown while "code" is hovered. Design → Code → Live flow above the
   headline, plus scattered tool-icon tiles (3 left, 2 right). Class names are
   deliberately distinct (.dcl-*, .tool-tile) so they don't collide with the
   featured panel's .win / .pf. */

// GitHub-dark syntax palette
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
    const begin = performance.now() + 700; // after the Code node appears
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

  // build visible tokens up to `shown` chars, preserving line breaks
  let budget = shown;
  const lines: Tok[][] = [[]];
  for (const tok of CODE) {
    if (tok.t === "\n") {
      if (budget <= 0) break;
      lines.push([]);
      continue;
    }
    if (budget <= 0) break;
    const slice = tok.t.slice(0, budget);
    lines[lines.length - 1].push({ t: slice, c: tok.c });
    budget -= slice.length;
  }

  return (
    <div className="dcl-codewin" style={{ width: 164, padding: "8px 10px 10px" }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span
            key={c}
            style={{ width: 8, height: 8, borderRadius: "50%", background: c }}
          />
        ))}
      </div>
      <pre style={{ margin: 0, lineHeight: 1.6, minHeight: 36 }}>
        {lines.map((line, li) => (
          <div key={li} style={{ whiteSpace: "pre" }}>
            {line.map((tok, ti) => (
              <span key={ti} style={{ color: tok.c }}>
                {tok.t}
              </span>
            ))}
            {li === lines.length - 1 && shown < total && !reduce && (
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

const LEFT = TOOL_ICONS.slice(0, 3);
const RIGHT = TOOL_ICONS.slice(3);
const TOOL_POS = [
  { top: "6%", left: "4%", rotate: -7 },
  { top: "44%", left: "-1%", rotate: 5 },
  { bottom: "8%", left: "6%", rotate: -4 },
  { top: "12%", right: "3%", rotate: 6 },
  { bottom: "12%", right: "1%", rotate: -6 },
];

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

export default function DesignCodeLive() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* flow, centered above the headline */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Node label="Design" delay={0.1}>
          <div
            className="dcl-card"
            style={{ width: 92, height: 64, padding: 10 }}
          >
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

      {/* scattered tool tiles */}
      {[...LEFT, ...RIGHT].map((tool, i) => (
        <motion.div
          key={tool.name}
          className="hero-floaty"
          initial={reduce ? false : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, scale: 0.7 }}
          transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 320, damping: 20 }}
          style={{
            position: "absolute",
            ...TOOL_POS[i],
            rotate: `${TOOL_POS[i].rotate}deg`,
          }}
        >
          <ToolTile name={tool.name} src={tool.src} />
        </motion.div>
      ))}
    </>
  );
}
