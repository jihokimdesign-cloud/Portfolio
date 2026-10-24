import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AI_SITUATIONS } from "./heroContent";

/* §4-1 — shown above the headline while "AI products" is hovered.
   A 50px orb grows sideways into a bar, then the reply types out. Loops
   through the situations; the parent unmounts this on mouse-out (reset). */
export default function AiBar() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"orb" | "open">(reduce ? "open" : "orb");
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [targetW, setTargetW] = useState(50);
  const measureRef = useRef<HTMLDivElement>(null);

  const current = AI_SITUATIONS[idx];

  // open a beat after mount
  useEffect(() => {
    if (reduce) {
      setTyped(current.reply);
      return;
    }
    const t = setTimeout(() => setPhase("open"), 160);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // measure the natural bar width for the current reply
  useLayoutEffect(() => {
    if (measureRef.current) setTargetW(measureRef.current.offsetWidth);
  }, [idx]);

  // type the reply, hold, then advance to the next situation
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
        className="ai-bar"
        animate={{ width: phase === "orb" ? 50 : targetW }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ width: 50 }}
      >
        <span className="ai-orb-glyph" aria-hidden>
          ✦
        </span>
        <span style={{ opacity: phase === "open" ? 1 : 0 }}>
          {typed}
          {!reduce && <span className="ai-type-cursor" aria-hidden />}
        </span>
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
          pointerEvents: "none",
        }}
      >
        <span className="ai-orb-glyph">✦</span>
        <span>{current.reply}</span>
      </div>
    </div>
  );
}
