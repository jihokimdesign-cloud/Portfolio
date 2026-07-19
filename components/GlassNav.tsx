import Link from "next/link";
import { SITE } from "../lib/constants";
import ThemeToggle from "./ThemeToggle";
import SignatureMark from "./SignatureMark";
import RecruiterNav from "./RecruiterNav";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

// Floating glassmorphism nav — frosted pill, DESIGN.md tokens via --glass vars.
export default function GlassNav() {
  return (
    <nav
      className="fixed inset-x-0 top-4 z-[150] flex justify-center gap-2 px-4"
      style={{ fontFamily: FONT_STACK }}
    >
      {/* displacement map for the liquid-glass edge refraction */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter
          id="liquid-lens"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.009"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="110"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div
        className="liquid-glass flex items-center gap-1 rounded-full px-2 py-1.5"
        style={{
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--liquid-rim), var(--glass-shadow)",
          color: "var(--fg)",
        }}
      >
        <Link
          href="/"
          aria-label="Jiho Kim — home"
          className="rounded-full px-3 py-0.5 transition-opacity hover:opacity-70"
        >
          <SignatureMark height={26} />
        </Link>
        <span
          className="mx-1 h-4 w-px"
          style={{ background: "var(--glass-border)" }}
          aria-hidden
        />
        <a
          href={SITE.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full px-3 py-1 text-[13px] transition-opacity hover:opacity-70"
          style={{ color: "var(--fg-secondary)" }}
        >
          Resume
        </a>
        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-full px-3 py-1 text-[13px] transition-opacity hover:opacity-70"
          style={{ color: "var(--fg-secondary)" }}
        >
          LinkedIn
        </a>
        <a
          href={`mailto:${SITE.email}`}
          className="rounded-full px-3 py-1 text-[13px] transition-opacity hover:opacity-70"
          style={{ color: "var(--fg-secondary)" }}
        >
          Email
        </a>
        <span
          className="mx-1 h-4 w-px"
          style={{ background: "var(--glass-border)" }}
          aria-hidden
        />
        <ThemeToggle inline />
      </div>
      <RecruiterNav />
    </nav>
  );
}
