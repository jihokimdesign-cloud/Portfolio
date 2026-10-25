import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { getOpener, getOrigin } from "../../lib/about";
import AboutContent from "./AboutContent";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Pass the site's existing night-mode toggle button here (do not build a new one). */
  themeToggle?: ReactNode;
};

const DUR = 700; // ms, matches about.css
const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full-screen glass sheet that grows from the click point (clip-path circle)
 * and shrinks back to it on close. Landing behind scales down + blurs.
 * ESC closes, focus is trapped, page scroll is locked, focus returns to the opener.
 */
export default function AboutSheet({ open, onClose, themeToggle }: Props) {
  const [mounted, setMounted] = useState(false); // in the DOM
  const [shown, setShown] = useState(false); // .open class (expanded)
  const [vars, setVars] = useState<CSSProperties>({});
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  const measure = () => {
    const { x, y } = getOrigin();
    const rad = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 24;
    setVars({ "--ox": `${x}px`, "--oy": `${y}px`, "--rad": `${rad}px` } as CSSProperties);
  };

  /* open / close lifecycle */
  useEffect(() => {
    const app = document.getElementById("__next");
    const root = document.documentElement;
    if (open) {
      measure();
      setMounted(true);
      root.classList.add("jk-about-lock");
      document.body.classList.add("jk-about-open");
      app?.setAttribute("inert", "");
      const r1 = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setShown(true);
          setTimeout(() => closeRef.current?.focus({ preventScroll: true }), reduced() ? 60 : 420);
        })
      );
      return () => cancelAnimationFrame(r1);
    }
    if (!mounted) return;
    measure();
    setShown(false);
    document.body.classList.remove("jk-about-open");
    app?.removeAttribute("inert");
    getOpener()?.focus({ preventScroll: true });
    const t = setTimeout(() => {
      setMounted(false);
      root.classList.remove("jk-about-lock");
    }, reduced() ? 260 : DUR);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* safety: never leave the page locked if this unmounts while open */
  useEffect(
    () => () => {
      document.documentElement.classList.remove("jk-about-lock");
      document.body.classList.remove("jk-about-open");
      document.getElementById("__next")?.removeAttribute("inert");
    },
    []
  );

  /* ESC + focus trap */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !sheetRef.current) return;
    const f = Array.from(
      sheetRef.current.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
    ).filter((n) => n.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={sheetRef}
      className={`jk-about-sheet${shown ? " open" : ""}`}
      style={vars}
      role="dialog"
      aria-modal="true"
      aria-labelledby="jk-about-title"
      onKeyDown={onKeyDown}
    >
      <div
        className="jk-about-scroll"
        ref={(n) => {
          scrollRef.current = n;
          if (n !== scrollEl) setScrollEl(n);
        }}
      >
        <div className="jk-about-controls">
          {themeToggle && <span className="jk-about-ctl jk-glass">{themeToggle}</span>}
          <button ref={closeRef} type="button" className="jk-about-ctl jk-glass" aria-label="Close About" onClick={onClose}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" />
            </svg>
          </button>
        </div>
        <AboutContent scrollEl={scrollEl} />
      </div>
    </div>,
    document.body
  );
}
