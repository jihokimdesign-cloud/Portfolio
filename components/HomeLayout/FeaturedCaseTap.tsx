import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSiteTheme } from "../../hooks/useSiteTheme";

// TAP moved into the context row above the title, so it's dropped from here
const TAGS = ["AI Agent", "XR", "Contract"];

/* Featured case — TAP. Header row (title / description + tags + link) over a
   16:9.4 panel that plays the TAP trainee web-app animation. The app screen is
   the self-contained /thumbs/tap3d.html vid (its own product colors + fonts),
   so the panel stays crisp and themed via our tokens around it. */
export default function FeaturedCaseTap() {
  const theme = useSiteTheme();
  // the vid takes a ?theme= hint so its surrounding frame matches the site
  const src = `/thumbs/tap3d.html?theme=${theme}`;
  const ref = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div>
      {/* ── header row ── */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_1fr]">
        <div>
          {/* context row: TAP pill + what it is */}
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="sw-tag jk-glass" style={{ color: "var(--accent)" }}>
              TAP3D
            </span>
            <span className="text-[13px]" style={{ color: "var(--hero-fg2)" }}>
              VR training for manufacturing technicians
            </span>
          </div>
          <h2
            style={{
              fontWeight: 510,
              fontSize: "clamp(28px, 3vw, 40px)",
              letterSpacing: "-0.022em",
              lineHeight: 1.1,
              color: "var(--hero-fg)",
              textWrap: "balance" as any,
              margin: 0,
            }}
          >
            From passive lists to proactive agents
          </h2>
        </div>

        <div className="flex flex-col items-start gap-5">
          <p
            className="text-[18px]"
            style={{ lineHeight: 1.5, color: "var(--fg-secondary)", margin: 0 }}
          >
            <span style={{ color: "var(--fg)", fontWeight: 500 }}>
              I turned TAP3D&apos;s passive checklist into an agent that reaches
              out first.
            </span>{" "}
            I proved it with a Wizard-of-Oz study of 24 trainees, and the
            results got the CFO to greenlight it.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => (
              <span key={t} className="sw-tag jk-glass">
                {t}
              </span>
            ))}
          </div>

          <Link
            href="/projects/tap3d"
            scroll={false}
            className="sw-readlink text-[14px]"
            style={{ color: "var(--fg)" }}
          >
            Read the case <span className="sw-arrow">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* ── panel ── */}
      <Link href="/projects/tap3d" scroll={false} aria-label="Open TAP case study">
        <div
          className="group relative mt-7 overflow-hidden"
          style={{
            aspectRatio: "16 / 9.4",
            borderRadius: 18,
            border: "1px solid var(--hairline)",
            background: "var(--panel-bg)",
          }}
        >
          {mounted && (
            // The thumbnail (/thumbs/tap3d.html) is a 16:9 design; the panel is
            // 16:9.4. Size the iframe to the panel height at 16:9 and center it so
            // it COVERS the panel (crops a sliver of width) instead of under-filling
            // and leaving an empty band at the bottom.
            <iframe
              key={src}
              ref={ref}
              src={src}
              title="TAP3D — proactive agent demo"
              scrolling="no"
              className="absolute left-1/2 top-0 h-full border-0"
              style={{
                pointerEvents: "none",
                aspectRatio: "16 / 9",
                minWidth: "100%",
                transform: "translateX(-50%)",
              }}
            />
          )}
        </div>
      </Link>
    </div>
  );
}
