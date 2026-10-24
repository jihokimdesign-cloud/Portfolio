import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { TOOL_ICONS } from "./heroContent";

/* §4-3 — "code" hover. The Design → Code → Live flow lives in the centered
   above-layer; each node carries a small row of tool icons beneath it (name
   on hover only). Class names are distinct (.dcl-*, .tool-tile) to avoid the
   featured panel's .win / .pf. */

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

function ToolIcon({ i }: { i: number }) {
  const tool = TOOL_ICONS[i];
  return (
    <div className="tool-tile" tabIndex={0} aria-label={tool.name}>
      <Image src={tool.src} alt={tool.name} width={18} height={18} />
      <span className="tool-tip" role="tooltip">
        {tool.name}
      </span>
    </div>
  );
}

function Node({
  label,
  delay,
  tools,
  children,
}: {
  label: string;
  delay: number;
  tools: number[];
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
      {/* tool icons, centered under the node; pop in after the node appears */}
      <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "center" }}>
        {tools.map((ti, k) => (
          <motion.div
            key={ti}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: reduce ? 0 : delay + 0.3 + k * 0.06,
              type: "spring",
              stiffness: 480,
              damping: 18,
            }}
          >
            <ToolIcon i={ti} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Dash() {
  return (
    <svg
      width="34"
      height="12"
      viewBox="0 0 34 12"
      style={{ flexShrink: 0, alignSelf: "flex-start", marginTop: 44 }}
    >
      <path className="dcl-dash" d="M1 6 H33" />
    </svg>
  );
}

// Design: Figma(0) · Code: Claude(1), Cursor(2) · Live: React(3), After Effects(4)
export default function DclFlow() {
  const reduce = useReducedMotion();
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
      <Node label="Design" delay={0.1} tools={[0]}>
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

      <Node label="Code" delay={0.55} tools={[1, 2]}>
        <CodeWindow />
      </Node>

      <Dash />

      <Node label="Live" delay={2.1} tools={[3, 4]}>
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
