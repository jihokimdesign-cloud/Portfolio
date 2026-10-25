import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

/* =========================================================================
   LandingHero
   Centered headline. Hover "AI products", "people," or "code" to focus that
   phrase and float in visuals around it. All styles live in landing-hero.css,
   scoped under .jk-hero so nothing collides with the rest of the site.
   ========================================================================= */

type Key = "ai" | "people" | "code";

/* ---------- editable copy ---------- */
const CAPTIONS: Record<Key, string> = {
  ai: "AI that notices your situation and speaks up first.",
  people: "I test ideas with real people first, from 24 trainees to 11,000+ volunteers.",
  code: "Figma for concepts, Claude Code for everything that moves.",
};

const AI_LINES: [situation: string, message: string][] = [
  ["Hands full while cooking", "No problem. Say “next” and I’ll read the step."],
  ["After a long day", "Rough day? Let’s keep tonight’s entry short."],
  ["End of the training week", "You got better at 3 skills. Here’s what to try next."],
  ["Stuck on a step", "Looks like step 4 is tricky. Want a hint?"],
];

const PEOPLE = [
  { x: "4%", y: -14, r: -7, d: 0, seed: 0, n: 3, num: 24, plus: false, label: "trainees tested it first" },
  { x: "9%", y: 118, r: 5, d: 70, seed: 3, n: 3, num: 500, plus: false, label: "beta testers" },
  { x: "96%", y: -8, r: 7, d: 40, seed: 6, n: 4, num: 11000, plus: true, label: "volunteers" },
];

/* Icon files: put them in /public/icon/ (adjust the path if yours differs) */
const TOOLS = [
  { src: "/icon/figma.png", name: "Figma", x: "3%", y: 6, r: -10 },
  { src: "/icon/claude.png", name: "Claude Code", x: "10%", y: 104, r: 8 },
  { src: "/icon/cursor.png", name: "Cursor", x: "-1%", y: 176, r: -4 },
  { src: "/icon/react.png", name: "React", x: "97%", y: 0, r: 9 },
  { src: "/icon/ae.png", name: "After Effects", x: "91%", y: 100, r: -7 },
];

const CODE_SRC: [cls: string, text: string][] = [
  ["p", "<"], ["t", "Step"], ["", " "], ["a", "voice"], ["p", "="], ["v", "{on}"], ["p", " />"], ["", "\n"],
  ["p", "<"], ["t", "Button"], ["", " "], ["a", "big"], ["p", ">"], ["", "Next"], ["p", "</"], ["t", "Button"], ["p", ">"],
];
const CODE_LEN = CODE_SRC.reduce((n, [, t]) => n + t.length, 0);

/* ---------- small helpers ---------- */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmtNum = (v: number, plus: boolean) => v.toLocaleString("en-US") + (plus ? "+" : "");
type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- headline content ---------- */
const LINES: { words: string[]; hot?: { key: Key; words: string[]; chip?: "spark" | "code"; tail?: string } }[] = [
  { words: ["I'm", "Jiho,", "a", "product", "designer."] },
  { words: ["I", "design"], hot: { key: "ai", words: ["AI", "products"], chip: "spark" } },
  { words: ["that", "adapt", "to"], hot: { key: "people", words: ["people,"] } },
  { words: ["and", "prototype", "them", "in"], hot: { key: "code", words: ["code"], chip: "code", tail: "." } },
];

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5c.7 4.8 3.2 7.3 9.5 9.5-6.3 2.2-8.8 4.7-9.5 9.5-.7-4.8-3.2-7.3-9.5-9.5 6.3-2.2 8.8-4.7 9.5-9.5Z" />
  </svg>
);
const CodeIcon = () => (
  <svg viewBox="0 0 30 24" aria-hidden="true">
    <path d="M8 6 3 12l5 6M22 6l5 6-5 6" />
    <rect className="jk-cur" x="14" y="7" width="2.2" height="10" rx="1" />
  </svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4.5v1A3.5 3.5 0 0 0 8 10.5M17 6h2.5v1A3.5 3.5 0 0 1 16 10.5M12 14v3.5M8.5 20h7" />
  </svg>
);

/* ---------- illustrated portraits (no real people) ---------- */
const SKIN = ["#f3cfb3", "#c98d63", "#e8b48f", "#8d5a3b", "#f6dcc6", "#a86f4c"];
const HAIR = ["#2b2420", "#1d1d1f", "#6b4630", "#3a2f2a", "#8b5e3c", "#2b2420"];
const SHIRT = ["#9fb8ff", "#ffcf8a", "#a8e0c2", "#d8bbff", "#ffb3c1", "#b9d4e8"];
const STYLES = ["short", "long", "curly", "bun", "side", "bald", "long", "short", "curly", "side"] as const;
const SHORT = "M9.4 13.5c-.2-5.4 3-8 6.6-8s6.8 2.6 6.6 8c-1.1-2.6-3.2-3.7-6.6-3.7s-5.5 1.1-6.6 3.7z";

function Portrait({ i }: { i: number }) {
  const style = STYLES[i % STYLES.length];
  const sk = SKIN[i % 6], h = HAIR[i % 6], sh = SHIRT[i % 6];
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      {style === "long" && (
        <path fill={h} d="M8.6 22c-1-3-1.1-6-.6-8.6.9-5 4.2-7.6 8-7.6s7.1 2.6 8 7.6c.5 2.6.4 5.6-.6 8.6-.7-1.3-1-2.8-1.1-4.6-.3-4-2.4-7-6.3-7s-6 3-6.3 7c-.1 1.8-.4 3.3-1.1 4.6z" />
      )}
      <path fill={sh} d="M5.5 32c.8-5.6 4.8-8.2 10.5-8.2s9.7 2.6 10.5 8.2z" />
      <rect fill={sk} x="14" y="20" width="4" height="4.5" rx="1.5" />
      <ellipse fill={sk} cx="16" cy="15.4" rx="6.4" ry="7.3" />
      {style === "short" && <path fill={h} d={SHORT} />}
      {style === "long" && <path fill={h} d="M10 12.8c.6-4 3-5.8 6-5.8s5.4 1.8 6 5.8c-1.4-1.9-3.4-2.7-6-2.7s-4.6.8-6 2.7z" />}
      {style === "bun" && (<><circle fill={h} cx="16" cy="5.6" r="2.7" /><path fill={h} d={SHORT} /></>)}
      {style === "side" && <path fill={h} d="M9.5 14.4c-.6-6 2.9-8.9 6.7-8.9 4.1 0 7.1 2.8 6.4 8.4-1.4-3.2-5.2-4.6-9.3-3.1-1.6.6-2.9 2-3.8 3.6z" />}
      {style === "curly" &&
        [[10.6, 11], [12.2, 7.8], [15.6, 6.4], [19, 7.4], [21.2, 10.4], [9.6, 14.2], [22.4, 13.6]].map(([cx, cy], k) => (
          <circle key={k} fill={h} cx={cx} cy={cy} r="2.6" />
        ))}
      {style === "bald" && <path fill={h} d="M10.8 17.4c.9 3.8 2.9 5.4 5.2 5.4s4.3-1.6 5.2-5.4c-1.1 1.2-3 1.8-5.2 1.8s-4.1-.6-5.2-1.8z" />}
      <circle fill="#222" cx="13.5" cy="15.6" r=".85" />
      <circle fill="#222" cx="18.5" cy="15.6" r=".85" />
      <path d="M14.7 19.2q1.3.9 2.6 0" fill="none" stroke="#7a3b2e" strokeWidth=".9" strokeLinecap="round" />
      {i % 4 === 2 && (
        <g fill="none" stroke="#2a2a2e" strokeWidth=".9">
          <circle cx="13.4" cy="15.4" r="2" /><circle cx="18.6" cy="15.4" r="2" /><path d="M15.4 15.4h1.2" />
        </g>
      )}
    </svg>
  );
}

const CONFETTI: [angle: number, dist: number, accent: boolean][] = [
  [-90, 26, true], [-60, 22, false], [-120, 22, true], [-35, 18, true], [-145, 18, false],
  [-75, 30, false], [-105, 30, true], [-15, 14, false], [-165, 14, true],
];

/* =========================================================================== */

type HeroProps = {
  /** Opens the About sheet. Receives the name button so the circle grows from it. */
  onNameClick?: (el: HTMLElement) => void;
};

export default function LandingHero({ onNameClick }: HeroProps = {}) {
  const [active, setActive] = useState<Key | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [hint, setHint] = useState(false);
  const [capKey, setCapKey] = useState<Key | null>(null);
  const [capSwap, setCapSwap] = useState(false);
  const [trophyPop, setTrophyPop] = useState(0);
  const [wiggle, setWiggle] = useState(0);

  const leaveTimer = useRef<number>();
  const hintSeen = useRef(false);

  /* entrance: words rise line by line */
  useEffect(() => {
    if (prefersReduced()) { setRevealed(true); setSettled(true); return; }
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setRevealed(true)); });
    const t = window.setTimeout(() => setSettled(true), 2600);
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); clearTimeout(t); };
  }, []);

  /* hint (every visit) + trophy pop + chip wiggle */
  useEffect(() => {
    const timers: number[] = [];
    if (!hintSeen.current) timers.push(window.setTimeout(() => !hintSeen.current && setHint(true), 2200));
    timers.push(window.setTimeout(() => setTrophyPop((n) => n + 1), 2600));
    if (!prefersReduced()) {
      timers.push(window.setTimeout(() => setWiggle((n) => n + 1), 2800));
      timers.push(window.setInterval(() => setWiggle((n) => n + 1), 9000));
    }
    return () => timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
  }, []);

  const show = useCallback((key: Key | null) => {
    window.clearTimeout(leaveTimer.current);
    setActive(key);
    if (key && !hintSeen.current) {
      hintSeen.current = true;
      setHint(false);
    }
  }, []);
  const leave = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setActive(null), 120);
  }, []);

  /* Esc closes */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* caption crossfade */
  useEffect(() => {
    setCapSwap(true);
    const t = window.setTimeout(() => { setCapKey(active); setCapSwap(false); }, 140);
    return () => clearTimeout(t);
  }, [active]);

  /* ---------- AI bar loop ---------- */
  const [aiCtx, setAiCtx] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiCtxOn, setAiCtxOn] = useState(false);
  const [aiW, setAiW] = useState(360);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (active !== "ai") { setAiOpen(false); setAiText(""); setAiCtxOn(false); return; }
    let alive = true;
    const reduce = prefersReduced();
    (async () => {
      for (let i = 0; alive; i++) {
        const [ctx, msg] = AI_LINES[i % AI_LINES.length];
        setAiCtx(ctx); setAiCtxOn(true);
        if (measureRef.current) { measureRef.current.textContent = msg; setAiW(measureRef.current.offsetWidth + 15 + 16 + 18 + 10 + 8); }
        await wait(250); if (!alive) return;
        setAiOpen(true); await wait(reduce ? 0 : 560); if (!alive) return;
        if (reduce) setAiText(msg);
        else for (let k = 1; k <= msg.length && alive; k++) { setAiText(msg.slice(0, k)); await wait(26); }
        await wait(2300); if (!alive) return;
        setAiText(""); setAiOpen(false); setAiCtxOn(false);
        await wait(700);
      }
    })();
    return () => { alive = false; };
  }, [active]);

  /* ---------- people count-up ---------- */
  const [counts, setCounts] = useState(PEOPLE.map((p) => p.num));
  useEffect(() => {
    if (active !== "people" || prefersReduced()) { setCounts(PEOPLE.map((p) => p.num)); return; }
    let raf = 0;
    const t0 = performance.now() + 150;
    const step = (now: number) => {
      setCounts(PEOPLE.map((p) => {
        const k = Math.max(0, Math.min(1, (now - t0 - p.d) / 900));
        return Math.round(p.num * (1 - Math.pow(1 - k, 3)));
      }));
      if (now - t0 < 1200) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  /* ---------- code typing ---------- */
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (active !== "code") { setTyped(0); return; }
    if (prefersReduced()) { setTyped(CODE_LEN); return; }
    let n = 0, t = 0;
    const tick = () => { n += 1; setTyped(n); if (n < CODE_LEN) t = window.setTimeout(tick, 32); };
    t = window.setTimeout(tick, 750);
    return () => clearTimeout(t);
  }, [active]);

  const renderCode = () => {
    let left = typed;
    const out: JSX.Element[] = [];
    CODE_SRC.forEach(([cls, text], i) => {
      if (left <= 0) return;
      const part = text.slice(0, left);
      left -= text.length;
      out.push(cls ? <span key={i} className={`jk-c-${cls}`}>{part}</span> : <span key={i}>{part}</span>);
    });
    return out;
  };

  /* ---------- headline ---------- */
  let wordIndex = 0;
  const word = (w: string, line: number) => {
    const k = wordIndex++;
    const style = settled ? undefined : ({ transitionDelay: `${line * 140 + k * 14}ms` } as CSSProperties);
    return <span className="jk-w" style={style}>{w}</span>;
  };
  const chipDelay = (line: number) =>
    settled ? undefined : ({ transitionDelay: `${line * 140 + wordIndex * 14 + 320}ms` } as CSSProperties);

  const on = (k: Key) => active === k;
  const peek = active !== null;

  return (
    <section className={`jk-hero${peek ? " jk-peek" : ""}`}>
      <div className="jk-stage">
        {/* ---------- floaters ---------- */}
        <div className="jk-pops" aria-hidden="true">
          {/* AI products */}
          <div className={`jk-fx jk-aiw${on("ai") ? " show" : ""}`} style={{ "--x": "50%", "--y": "-128px", "--r": "0deg", "--d": "0ms" } as Vars}>
            <span className={`jk-aictx${aiCtxOn ? " on" : ""}`}>{aiCtx}</span>
            <div className={`jk-aibar${aiOpen ? " open" : ""}`} style={{ "--w": `${aiW}px` } as Vars}>
              <span className="jk-glow" aria-hidden><i /></span>
              <span className="jk-ring" aria-hidden><i /></span>
              <span className="jk-orb">✦</span>
              <span className="jk-aitxt">{aiText}{aiText && <span className="jk-aicur" />}</span>
            </div>
            <span className="jk-measure" ref={measureRef} />
          </div>

          {/* people */}
          {PEOPLE.map((p, i) => (
            <div key={i} className={`jk-fx jk-ppl${on("people") ? " show" : ""}`}
              style={{ "--x": p.x, "--y": `${p.y}px`, "--r": `${p.r}deg`, "--d": `${p.d}ms` } as Vars}>
              <span className="jk-stack">
                {Array.from({ length: p.n }, (_, j) => (
                  <span key={j} className="jk-av" style={{ "--k": j } as Vars}><Portrait i={p.seed + j} /></span>
                ))}
              </span>
              <span className="jk-pt"><b>{fmtNum(counts[i], p.plus)}</b><em>{p.label}</em></span>
            </div>
          ))}
          <div className={`jk-fx jk-a11y${on("people") ? " show" : ""}`} style={{ "--x": "91%", "--y": "124px", "--r": "-6deg", "--d": "110ms" } as Vars}>
            <span className="jk-acc">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle className="dot" cx="12" cy="7.3" r="1.4" /><path d="M7.5 10h9M12 10v4.2M12 14.2l-2.4 4M12 14.2l2.4 4" /></svg>
            </span>
            <span className="jk-pt"><b>WCAG 2.2 AA</b><em>accessible for everyone</em></span>
            <svg className="jk-ck" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" /><path d="M6 10.3l2.6 2.5L14 7.4" /></svg>
          </div>

          {/* code: Design -> Code -> Live */}
          <div className={`jk-fx jk-flow${on("code") ? " show" : ""}`} style={{ "--x": "50%", "--y": "-140px", "--r": "0deg", "--d": "0ms" } as Vars}>
            <div className="jk-node jk-fig"><span className="jk-nl">Design</span>
              <div className="jk-wf"><i className="h" /><i /><i className="s" /><i className="b" /></div></div>
            <span className="jk-link jk-l1" />
            <div className="jk-node jk-ed"><span className="jk-nl">Code</span>
              <div className="jk-win"><span className="jk-dots"><i /><i /><i /></span>
                <pre className="jk-code">{renderCode()}{on("code") && <span className="jk-ccur" />}</pre></div></div>
            <span className="jk-link jk-l2" />
            <div className="jk-node jk-pv"><span className="jk-nl">Live</span>
              <div className="jk-ph"><i className="h" /><i /><b className="jk-btn">Next step</b><span className="jk-live"><i />live</span></div></div>
          </div>
          {TOOLS.map((t, i) => (
            <div key={t.name} className={`jk-fx jk-tool${on("code") ? " show" : ""}`}
              style={{ "--x": t.x, "--y": `${t.y}px`, "--r": `${t.r}deg`, "--d": `${i * 50}ms` } as Vars}>
              <span className="jk-ti"><img src={t.src} alt="" width={42} height={42} /></span>
              <span className="jk-tn">{t.name}</span>
            </div>
          ))}
        </div>

        {/* ---------- headline ---------- */}
        <h1 className={`jk-para${revealed ? "" : " jk-pre"}`}
          aria-label="I'm Jiho, a product designer. I design AI products that adapt to people, and prototype them in code.">
          {LINES.map((line, li) => (
            <span className="jk-line" key={li}>
              {line.words.map((w, k) =>
                li === 0 && w === "Jiho," ? (
                  <span key={k}>
                    <button
                      type="button"
                      id="jk-name"
                      className="jk-name"
                      aria-haspopup="dialog"
                      aria-label="About Jiho"
                      onClick={(e) => onNameClick?.(e.currentTarget)}
                    >
                      {word("Jiho", li)}
                    </button>
                    {word(",", li)}{" "}
                  </span>
                ) : (
                  <span key={k}>{word(w, li)} </span>
                )
              )}
              {line.hot && (
                <span
                  className={`jk-hot${on(line.hot.key) ? " on" : ""}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Show ${line.hot.key === "ai" ? "AI product" : line.hot.key} details`}
                  onPointerEnter={() => show(line.hot!.key)}
                  onPointerLeave={leave}
                  onFocus={() => show(line.hot!.key)}
                  onBlur={() => show(null)}
                  onClick={() => show(active === line.hot!.key ? null : line.hot!.key)}
                >
                  {line.hot.words.map((w, k) => <span key={k}>{word(w, li)}{k < line.hot!.words.length - 1 ? " " : ""}</span>)}
                  {line.hot.chip && (
                    <>
                      {" "}
                      <span className="jk-w jk-chipw" style={chipDelay(li)}>
                        <span key={`wg${wiggle}`} className={`jk-chip${wiggle ? " wiggle" : ""}`}>
                          {line.hot.chip === "spark" ? <SparkIcon /> : <CodeIcon />}
                        </span>
                      </span>
                    </>
                  )}
                  {line.hot.key === "ai" && (
                    <span className={`jk-hint${hint ? " on" : ""}`} aria-hidden="true">
                      <span className="jk-h-m">Hover me</span><span className="jk-h-t">Tap me</span>
                    </span>
                  )}
                </span>
              )}
              {line.hot?.tail && <span className="jk-w">{line.hot.tail}</span>}
            </span>
          ))}
        </h1>

        {/* ---------- caption ---------- */}
        <div className="jk-capwrap">
          <hr className="jk-div" />
          <p className={`jk-cap${capSwap ? " swap" : ""}`}>
            {capKey ? CAPTIONS[capKey] : (
              <>
                <span className="jk-open">Open to new roles</span>
                <br />
                <span className="jk-cred">
                  University of Washington MHCI+D Graduate ·{" "}
                  <span className="jk-troph" tabIndex={0} aria-label="UIST 2024 Best Paper"
                    onPointerEnter={() => setTrophyPop((n) => n + 1)} onFocus={() => setTrophyPop((n) => n + 1)}>
                    <TrophyIcon />
                    <span key={trophyPop} className={`jk-conf${trophyPop ? " pop" : ""}`} aria-hidden="true">
                      {CONFETTI.map(([a, d, acc], k) => (
                        <i key={k} style={{ "--a": `${a}deg`, "--dist": `${d}px`, "--c": acc ? "var(--jk-accent)" : "var(--jk-fg-3)" } as Vars} />
                      ))}
                    </span>
                  </span>
                  UIST 2024 Best Paper
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
