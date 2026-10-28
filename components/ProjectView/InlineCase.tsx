// Renders an approved standalone case mockup (TAP3D / LePal / Sidewalk) directly
// in the page — NO iframe. The mockup's markup is injected as-is; its scoped CSS
// is imported globally in _app; its own <script> runs verbatim, sandboxed so the
// document-level listeners / observers it registers are torn down on unmount.
//
// The case renders inside _app's ScrollContainer (position:fixed, no transform),
// so the mockup's position:fixed summary modal and sticky TOC anchor to the real
// viewport and its IntersectionObserver reveals fire on real screen position.
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import CaseTopChrome from "./CaseTopChrome";
import CaseStudyNav from "./CaseStudyNav";

import * as tap3d from "./generated/tap3d";
import * as lepal from "./generated/lepal";
import * as sidewalk from "./generated/sidewalk";
import * as cheffy from "./generated/cheffy";
import * as cookar from "./generated/cookar";

const CASES: Record<string, { html: string; js: string; fontHref: string }> = {
  tap3d,
  lepal,
  sidewalk,
  cheffy,
  cookar,
};

export default function InlineCase({
  slug,
  nextTitle,
  nextHref,
}: {
  slug: string;
  nextTitle?: string;
  nextHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const data = CASES[slug];

  useEffect(() => {
    const root = ref.current;
    if (!root || !data) return;

    const htmlEl = document.documentElement;
    const prior = htmlEl.getAttribute("data-theme");
    // This case opens dark regardless of OS; the toggle can still switch to light.
    // An explicit ?theme=light|dark wins (shareable link + QA).
    const qp = new URLSearchParams(window.location.search).get("theme");
    htmlEl.setAttribute("data-theme", qp === "light" ? "light" : "dark");

    // Avoid a duplicate hero on React 18 StrictMode's dev double-invoke.
    root.querySelectorAll("#heroMedia iframe").forEach((n) => n.remove());

    // Sandbox: capture the document-level listeners + observers the mockup script
    // registers synchronously, so we can remove them when the page unmounts.
    const docListeners: Array<[string, any, any]> = [];
    const observers: any[] = [];
    const rawAdd = document.addEventListener.bind(document);
    const RawIO = window.IntersectionObserver;
    (document as any).addEventListener = (t: string, f: any, o: any) => {
      docListeners.push([t, f, o]);
      return rawAdd(t, f, o);
    };
    (window as any).IntersectionObserver = class extends RawIO {
      constructor(cb: any, opt?: any) {
        super(cb, opt);
        observers.push(this);
      }
    };

    try {
      // The mockup script is an IIFE that queries `document`; run it verbatim.
      new Function(data.js)();
    } catch (e) {
      console.error(`[inline-case:${slug}] script error`, e);
    } finally {
      (document as any).addEventListener = rawAdd;
      (window as any).IntersectionObserver = RawIO;
    }

    // Hide the site chrome while the summary modal is open.
    const sum = root.querySelector("#sum") as HTMLElement | null;
    let mo: MutationObserver | null = null;
    if (sum) {
      const sync = () => setSummaryOpen(!sum.hasAttribute("hidden"));
      sync();
      mo = new MutationObserver(sync);
      mo.observe(sum, { attributes: true, attributeFilter: ["hidden"] });
    }

    // iframe hero (TAP3D, Cheffy): the motion renders at a fixed 1440x810; scale
    // it to cover the hero width so the composition matches the landing card.
    const heroMedia = root.querySelector("#heroMedia") as HTMLElement | null;
    const fitHero = () => {
      if (heroMedia) {
        heroMedia.style.setProperty("--hero-scale", String(heroMedia.clientWidth / 1440));
      }
    };
    fitHero();
    window.addEventListener("resize", fitHero);

    // Bottom dock appears only after the hero is scrolled past, so it never
    // covers the hero meta row on first load.
    const cover = root.querySelector("#cover") as HTMLElement | null;
    let coverIO: IntersectionObserver | null = null;
    if (cover) {
      coverIO = new IntersectionObserver(
        (es) => es.forEach((e) => setPastHero(e.intersectionRatio < 0.35)),
        { threshold: [0, 0.35, 1] }
      );
      coverIO.observe(cover);
    } else {
      setPastHero(true);
    }

    return () => {
      window.removeEventListener("resize", fitHero);
      coverIO?.disconnect();
      docListeners.forEach(([t, f, o]) => document.removeEventListener(t, f, o));
      observers.forEach((o) => {
        try {
          o.disconnect();
        } catch {}
      });
      mo?.disconnect();
      document.body.style.overflow = ""; // summary may have locked scroll
      let restore: string | null = prior;
      try {
        restore = localStorage.getItem("theme") || prior;
      } catch {}
      if (restore) htmlEl.setAttribute("data-theme", restore);
      else htmlEl.removeAttribute("data-theme");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!data) return null;

  return (
    <>
      {data.fontHref && (
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={data.fontHref} rel="stylesheet" />
        </Head>
      )}
      <div
        ref={ref}
        className={`${slug}-case`}
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
      <CaseTopChrome nextTitle={nextTitle} nextHref={nextHref} hidden={summaryOpen} />
      <CaseStudyNav hidden={summaryOpen || !pastHero} />
    </>
  );
}
