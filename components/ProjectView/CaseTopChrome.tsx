// Top chrome for the no-iframe case pages (TAP3D, LePal): close ✕ (left) + Next
// pill (right), matching the approved mockup's own .chrome — which we hide — but
// driven by the site. Portals to body so it anchors to the viewport, above the
// case content that scrolls inside the ScrollContainer.
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

const GLASS: React.CSSProperties = {
  background: "var(--glass)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--liquid-rim), var(--glass-shadow)",
  WebkitBackdropFilter: "saturate(1.8) blur(20px)",
  backdropFilter: "saturate(1.8) blur(20px)",
  color: "var(--fg)",
};

export default function CaseTopChrome({
  nextTitle,
  nextHref,
  hidden = false,
}: {
  nextTitle?: string;
  nextHref?: string;
  hidden?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-x-0 top-0 z-[160] flex items-center justify-between"
      style={{
        padding:
          "calc(16px + env(safe-area-inset-top,0px)) max(20px,env(safe-area-inset-right,0px)) 0 max(20px,env(safe-area-inset-left,0px))",
        pointerEvents: "none",
        fontFamily: FONT_STACK,
        opacity: hidden ? 0 : 1,
        transition: "opacity .2s ease",
      }}
    >
      <Link
        href="/"
        aria-label="Close case study"
        className="grid h-[38px] w-[38px] place-items-center rounded-full transition-opacity hover:opacity-80"
        style={{ ...GLASS, pointerEvents: hidden ? "none" : "auto" }}
      >
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </Link>

      {nextTitle && nextHref && (
        <Link
          href={nextHref}
          className="flex h-[38px] items-center gap-2 rounded-full pl-3 pr-3.5 text-[13px] font-medium no-underline transition-opacity hover:opacity-80"
          style={{ ...GLASS, pointerEvents: hidden ? "none" : "auto" }}
        >
          <span style={{ color: "var(--fg-secondary)", fontWeight: 400 }}>Next</span>
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--accent, #8b5cf6)" }}
            aria-hidden
          />
          {nextTitle}
        </Link>
      )}
    </div>,
    document.body
  );
}
