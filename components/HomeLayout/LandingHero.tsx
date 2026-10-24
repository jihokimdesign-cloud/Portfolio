import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import AiBar from "./hero/AiBar";
import PeopleSide from "./hero/PeopleChips";
import DclFlow, { ToolColumn } from "./hero/DesignCodeLive";
import { PHRASE_CAPTIONS, PhraseKey } from "./hero/heroContent";

const EASE = [0.22, 1, 0.36, 1] as const;
const HINT_KEY = "hero-hint-seen";

/* ── inline icon chips ─────────────────────────────────────────── */
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2z" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ width: "1em", height: "1em", verticalAlign: "-0.14em" }}
    >
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 6H4.5v1A3.5 3.5 0 0 0 8 10.5M17 6h2.5v1A3.5 3.5 0 0 1 16 10.5" />
      <path d="M10 14h4M12 14v3M9.5 20h5M10 20a2.5 2.5 0 0 1 1.2-2.2M14 20a2.5 2.5 0 0 0-1.2-2.2" />
    </svg>
  );
}

/* ── confetti burst above the trophy ───────────────────────────── */
function Confetti({ fire }: { fire: number }) {
  const reduce = useReducedMotion();
  if (reduce || fire === 0) return null;
  const colors = ["#4d94ff", "#8a8f98", "#0066ff", "#b9c2cc"];
  return (
    <span
      aria-hidden
      style={{ position: "absolute", left: "50%", top: 0, pointerEvents: "none" }}
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = (Math.PI / 8) * (i - 4) - Math.PI / 2;
        const dist = 18 + Math.random() * 16;
        return (
          <motion.span
            key={`${fire}-${i}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 4,
              opacity: 0,
              scale: 0.6,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: 4,
              height: 4,
              borderRadius: 1,
              background: colors[i % colors.length],
            }}
          />
        );
      })}
    </span>
  );
}

export default function LandingHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<PhraseKey | null>(null);
  const [entranceDone, setEntranceDone] = useState(reduce ? true : false);
  const [showHint, setShowHint] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [burst, setBurst] = useState(0);

  // entrance completes → enable hint + clears any lingering transition lag
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setEntranceDone(true), 1500);
    return () => clearTimeout(t);
  }, [reduce]);

  // first-visit hint (skip if seen before or on reduced motion)
  useEffect(() => {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(coarse);
    let seen = false;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
    } catch {}
    if (seen || reduce) return;
    const t = setTimeout(() => setShowHint(true), 2200);
    return () => clearTimeout(t);
  }, [reduce]);

  // trophy confetti ~2.5s after load
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setBurst((b) => b + 1), 2500);
    return () => clearTimeout(t);
  }, [reduce]);

  const dismissHint = () => {
    setShowHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {}
  };

  const activate = (k: PhraseKey) => {
    setActive(k);
    if (showHint) dismissHint();
  };
  const clear = () => setActive(null);

  const phraseProps = (k: PhraseKey, label: string) => ({
    className: `hp hp--${k}`,
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onMouseEnter: () => activate(k),
    onMouseLeave: clear,
    onFocus: () => activate(k),
    onBlur: clear,
    onClick: () => setActive((p) => (p === k ? null : k)),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Escape") clear();
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(k);
      }
    },
  });

  // per-line entrance
  const line = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { delay: 0.1 + i * 0.12, duration: 0.6, ease: EASE },
        };
  const chip = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { delay, type: "spring" as const, stiffness: 520, damping: 16 },
        };

  return (
    <section
      className="font-inter"
      onKeyDown={(e) => e.key === "Escape" && clear()}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1120,
        margin: "0 auto",
        textAlign: "center",
        padding: "clamp(120px, 17vh, 196px) 16px clamp(40px, 6vh, 72px)",
      }}
    >
      <div className="hero-grid">
        {/* left float column */}
        <div className="float-col">
          {entranceDone && active === "people" && <PeopleSide side="left" />}
          {entranceDone && active === "code" && <ToolColumn side="left" />}
        </div>

        {/* headline + the centered above-layer (AI bar / Design→Code→Live) */}
        <div className="headline-col">
          <div className="above-layer">
            {entranceDone && active === "ai" && <AiBar />}
            {entranceDone && active === "code" && <DclFlow />}
          </div>

          <h1
            className={`hero-hl${entranceDone ? " done" : ""}`}
            data-active={active ?? "none"}
            style={{ position: "relative", zIndex: 2, margin: 0 }}
          >
        <motion.span className="hero-line" {...line(0)}>
          I&apos;m Jiho, a product designer.
        </motion.span>{" "}
        <motion.span className="hero-line" {...line(1)}>
          I design{" "}
          <span {...phraseProps("ai", "Show how the AI notices your situation")}>
            AI products
          </span>{" "}
          <span style={{ position: "relative", display: "inline-flex" }}>
            <motion.span className="hero-chip chip--ai" {...chip(0.95)}>
              <SparkleIcon />
            </motion.span>
            {showHint && (
              <span
                className="hover-hint"
                style={{
                  position: "absolute",
                  left: "135%",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden>
                  <path d="M8 0L0 5l8 5z" fill="currentColor" />
                </svg>
                {isTouch ? "Tap me" : "Hover me"}
              </span>
            )}
          </span>
        </motion.span>{" "}
        <motion.span className="hero-line" {...line(2)}>
          that adapt to{" "}
          <span {...phraseProps("people", "Show the people I tested with")}>
            people,
          </span>
        </motion.span>{" "}
        <motion.span className="hero-line" {...line(3)}>
          and prototype them in{" "}
          <span {...phraseProps("code", "Show the design to code to live flow")}>
            code
          </span>{" "}
          <motion.span className="hero-chip chip--code" {...chip(1.05)}>
            <CodeIcon />
          </motion.span>
          .
        </motion.span>
          </h1>
        </div>

        {/* right float column */}
        <div className="float-col">
          {entranceDone && active === "people" && <PeopleSide side="right" />}
          {entranceDone && active === "code" && <ToolColumn side="right" />}
        </div>
      </div>

      {/* divider */}
      <div
        className="hero-divider"
        style={{ margin: "clamp(24px, 4vh, 40px) auto" }}
      />

      {/* caption — credentials by default, phrase blurb on hover (crossfade) */}
      <div style={{ position: "relative", zIndex: 2, minHeight: 52 }}>
        <AnimatePresence mode="wait">
          {active ? (
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--hero-fg2)",
              }}
            >
              {PHRASE_CAPTIONS[active]}
            </motion.p>
          ) : (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  fontWeight: 510,
                  color: "var(--hero-fg)",
                  fontSize: 15,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--status-green)",
                  }}
                />
                Open to new roles
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  fontSize: 13,
                  color: "var(--hero-fg2)",
                }}
              >
                University of Washington MHCI+D Graduate
                <span aria-hidden>·</span>
                <span
                  style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 5 }}
                  onMouseEnter={() => !reduce && setBurst((b) => b + 1)}
                >
                  <span style={{ position: "relative", color: "var(--hero-fg2)" }}>
                    <TrophyIcon />
                    <Confetti fire={burst} />
                  </span>
                  UIST 2024 Best Paper
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
