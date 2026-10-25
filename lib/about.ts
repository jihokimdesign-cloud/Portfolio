import type { NextRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   Route-modal helpers for the About sheet.
   Home opens the sheet with  href "/?about=1"  shown as  "/about".
   A direct visit to /about renders pages/about.tsx (full page).
   ------------------------------------------------------------------ */

type Origin = { x: number; y: number };

let origin: Origin | null = null;
let opener: HTMLElement | null = null;
let pushedFromHome = false;

export function openAbout(router: NextRouter, el?: HTMLElement | null) {
  if (el) {
    const r = el.getBoundingClientRect();
    origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    opener = el;
  } else {
    origin = null;
    opener = null;
  }
  pushedFromHome = true;
  router.push({ pathname: "/", query: { about: "1" } }, "/about", { shallow: true, scroll: false });
}

export function closeAbout(router: NextRouter) {
  if (pushedFromHome) {
    pushedFromHome = false;
    router.back();
  } else {
    router.replace("/", undefined, { shallow: true, scroll: false });
  }
}

/** Origin for the circle reveal. Falls back to the opener's current position, then the screen centre. */
export function getOrigin(): Origin {
  if (opener && document.contains(opener)) {
    const r = opener.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export function getOpener() {
  return opener && document.contains(opener) ? opener : (document.getElementById("jk-name") as HTMLElement | null);
}

/** Click-to-copy, same behaviour as the footer: Copied for 1.8s, mailto fallback if the clipboard is blocked. */
export function useCopyEmail(email: string) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(t.current), []);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(false), 1800);
  }, [email]);
  return { copied, copy };
}
