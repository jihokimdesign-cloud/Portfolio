import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AI_SITUATIONS } from "./heroContent";

/* §4-1 — shown above the headline while "AI products" is hovered.
   A 50px orb grows sideways into a bar, then the reply types out. The border
   is two SVG rects: a faint full-rainbow outline (.base) and a short segment
   (.run) that travels around it via stroke-dashoffset — constant speed, one
   direction, Safari-safe (no @property / mask / conic rotation). A blurred
   copy behind the bar gives the moving light a halo. */
const STOPS = [
  { o: "0", c: "#4f8cff" },
  { o: ".25", c: "#9b6bff" },
  { o: ".5", c: "#ff6fae" },
  { o: ".75", c: "#ffb547" },
  { o: "1", c: "#3fd0c9" },
];

function Grad({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
        {STOPS.map((s) => (
          <stop key={s.o} offset={s.o} stopColor={s.c} />
        ))}
      </linearGradient>
    </defs>
  );
}

export default function AiBar() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"orb" | "open">(reduce ? "open" : "orb");
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [targetW, setTargetW] = useState(50);
  const [boxW, setBoxW] = useState(50);
  const measureRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const current = AI_SITUATIONS[idx];

  useEffect(() => {
    if (reduce) {
      setTyped(current.reply);
      return;
    }
    const t = setTimeout(() => setPhase("open"), 160);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (measureRef.current) setTargetW(measureRef.current.offsetWidth + 3);
  }, [idx]);

  // keep the SVG border rects sized to the (animating) bar width
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setBoxW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || phase !== "open") return;
    let i = 0;
    setTyped("");
    const reply = current.reply;
    const typer = setInterval(() => {
      i += 1;
      setTyped(reply.slice(0, i));
      if (i >= reply.length) clearInterval(typer);
    }, 26);
    const advance = setTimeout(
      () => setIdx((p) => (p + 1) % AI_SITUATIONS.length),
      reply.length * 26 + 1500
    );
    return () => {
      clearInterval(typer);
      clearTimeout(advance);
    };
  }, [idx, phase, reduce, current.reply]);

  const w = Math.max(2, boxW - 2);
  const rectProps = {
    x: 1,
    y: 1,
    width: w,
    height: 46,
    rx: 23,
    pathLength: 100,
  };

  return (
    <div className="ai-bar-wrap">
      <motion.div
        className="ai-situation"
        key={current.situation}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {current.situation}
      </motion.div>

      <motion.div
        className="ai-barbox"
        ref={boxRef}
        animate={{ width: phase === "orb" ? 50 : targetW }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ width: 50 }}
      >
        {/* glow (behind) — blurred copy of the travelling segment */}
        <svg className="ai-glow-svg" width={boxW} height={48} aria-hidden>
          <Grad id="aiGradGlow" />
          <rect className="run" {...rectProps} stroke="url(#aiGradGlow)" />
        </svg>

        {/* opaque bar */}
        <div className="ai-bar">
          <span className="ai-orb-glyph" aria-hidden>
            ✦
          </span>
          <span style={{ opacity: phase === "open" ? 1 : 0 }}>
            {typed}
            {!reduce && <span className="ai-type-cursor" aria-hidden />}
          </span>
        </div>

        {/* border (over) — faint full rainbow + travelling segment */}
        <svg className="ai-ring" width={boxW} height={48} aria-hidden>
          <Grad id="aiGrad" />
          <rect className="base" {...rectProps} stroke="url(#aiGrad)" />
          <rect className="run" {...rectProps} stroke="url(#aiGrad)" />
        </svg>
      </motion.div>

      {/* hidden measurer — same padding/font as .ai-bar */}
      <div
        ref={measureRef}
        className="ai-bar"
        aria-hidden
        style={{
          position: "absolute",
          visibility: "hidden",
          width: "auto",
          height: 48,
          pointerEvents: "none",
        }}
      >
        <span className="ai-orb-glyph">✦</span>
        <span>{current.reply}</span>
      </div>
    </div>
  );
}
