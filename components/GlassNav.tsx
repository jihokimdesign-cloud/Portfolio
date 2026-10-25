import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { SITE } from "../lib/constants";
import { openAbout } from "../lib/about";
import ThemeToggle from "./ThemeToggle";
import SignatureMark from "./SignatureMark";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

// 이메일은 mailto 대신 클립보드 복사가 기본 동작 — 1.5초 "Copied" 확인
function EmailCopyButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      // 클립보드가 막힌 환경(구형 Safari 등) — Gmail 컴포즈로 폴백
      window.open(SITE.emailHref, "_blank");
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="rounded-full px-3 py-1 text-[13px] transition-opacity hover:opacity-70"
      style={{ color: copied ? "var(--fg)" : "var(--fg-secondary)" }}
      aria-live="polite"
    >
      {copied ? "Copied ✓" : "Email"}
    </button>
  );
}

// Floating glassmorphism nav — frosted pill, DESIGN.md tokens via --glass vars.
export default function GlassNav() {
  const router = useRouter();
  const isHome = router.pathname === "/";
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
          // near-opaque fill (over the blur) keeps labels legible over any
          // thumbnail, in both light and dark mode
          background: "var(--nav-bg)",
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
        {isHome ? (
          <button
            onClick={(e) => openAbout(router, e.currentTarget)}
            className="rounded-full px-3 py-1 text-[13px] transition-opacity hover:opacity-70"
            style={{ color: "var(--fg-secondary)" }}
          >
            About
          </button>
        ) : (
          <Link
            href="/about"
            className="rounded-full px-3 py-1 text-[13px] transition-opacity hover:opacity-70"
            style={{ color: "var(--fg-secondary)" }}
          >
            About
          </Link>
        )}
        <EmailCopyButton />
        <span
          className="mx-1 h-4 w-px"
          style={{ background: "var(--glass-border)" }}
          aria-hidden
        />
        <ThemeToggle inline />
      </div>
    </nav>
  );
}
