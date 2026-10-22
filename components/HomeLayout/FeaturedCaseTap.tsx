import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSiteTheme } from "../../hooks/useSiteTheme";

const TITLE_FONT = '"TikTok Sans", Inter, sans-serif';

const TAGS = ["TAP", "AI Agent", "XR", "Contract"];

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
        <h2
          style={{
            fontFamily: TITLE_FONT,
            fontWeight: 500,
            fontSize: "clamp(30px, 4vw, 46px)",
            letterSpacing: "-0.035em",
            lineHeight: 1.06,
            color: "var(--title)",
            textWrap: "balance" as any,
            margin: 0,
          }}
        >
          From passive lists to proactive agents
        </h2>

        <div className="flex flex-col items-start gap-5">
          <p
            className="text-[18px]"
            style={{ lineHeight: 1.5, color: "var(--fg-secondary)", margin: 0 }}
          >
            <span style={{ color: "var(--fg)", fontWeight: 500 }}>
              I turned TAP&apos;s passive checklist into an agent that reaches
              out first.
            </span>{" "}
            I proved it with a Wizard-of-Oz study of 24 trainees, and the
            results got the CFO to greenlight it.
          </p>

          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => (
              <span key={t} className="sw-tag">
                {t}
              </span>
            ))}
          </div>

          <Link
            href="/projects/tap3d"
            scroll={false}
            className="sw-readlink text-[14px] transition-opacity hover:opacity-80"
            style={{ color: "var(--link)" }}
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
            <iframe
              key={src}
              ref={ref}
              src={src}
              title="TAP — proactive agent demo"
              scrolling="no"
              className="absolute inset-0 h-full w-full border-0"
              style={{ pointerEvents: "none" }}
            />
          )}
          {/* bottom 12% fades to the page background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: "12%",
              background:
                "linear-gradient(to bottom, transparent, var(--panel-fade))",
            }}
          />
        </div>
      </Link>
    </div>
  );
}
