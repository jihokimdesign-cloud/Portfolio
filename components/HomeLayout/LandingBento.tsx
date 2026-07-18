import { useEffect, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import { SITE } from "../../lib/constants";

const TITLE_FONT = '"TikTok Sans", Inter, sans-serif';
const PHONE_DISPLAY = "206.291.2567";
const ROLES = ["designer.", "builder.", "prototyper.", "founder."];

const TOOLBOX = [
  { name: "Figma", src: "/logos tools/free-figma-logo-icon-svg-download-png-8630394.webp" },
  { name: "Claude", src: "/logos tools/Claude-ai-icon.svg.png" },
  { name: "Framer", src: "/logos tools/framer.avif" },
  { name: "Webflow", src: "/logos tools/6699096cdd45ad7b198bbc43_partner-webflow.png" },
  { name: "Adobe XD", src: "/logos tools/Adobe_XD_CC_icon.svg.png" },
  { name: "Photoshop", src: "/logos tools/Adobe_Photoshop_CC_icon.svg.png" },
  { name: "Illustrator", src: "/logos tools/Adobe_Illustrator_CC_icon.svg.png" },
  { name: "After Effects", src: "/logos tools/Adobe_After_Effects_CC_icon.svg.png" },
  { name: "Miro", src: "/logos tools/Miro.png" },
  { name: "Hotjar", src: "/logos tools/Hotjar.png" },
  { name: "Google Analytics", src: "/logos tools/Google analytics.png" },
  { name: "React", src: "/logos tools/React-icon.svg.png" },
  { name: "Colab", src: "/logos tools/Colab.png" },
  { name: "Docker", src: "/logos tools/docker.png" },
  { name: "QGIS", src: "/logos tools/qgis.png" },
];

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  borderRadius: 18,
  border: "1px solid var(--hairline)",
};

const labelStyle: React.CSSProperties = {
  color: "var(--fg-muted)",
};

/* "I am a designer.|" — looping typewriter */
function Typewriter() {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = ROLES[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (text.length < word.length) {
            setText(word.slice(0, text.length + 1));
          } else {
            setTimeout(() => setDeleting(true), 1600);
          }
        } else {
          if (text.length > 0) {
            setText(word.slice(0, text.length - 1));
          } else {
            setDeleting(false);
            setWordIndex((i) => (i + 1) % ROLES.length);
          }
        }
      },
      deleting ? 45 : 90
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex]);

  return (
    <span>
      {text}
      <span className="typewriter-caret" aria-hidden>
        |
      </span>
    </span>
  );
}

/* live local clock */
function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now
    ? now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const timeStr = now ? now.toLocaleTimeString("en-US", { hour12: false }) : "";

  return (
    <div className="flex h-full flex-col justify-between p-6" >
      <div className="text-[13px]" style={labelStyle}>
        Seattle, WA
      </div>
      <div>
        <div className="text-sm" style={{ color: "var(--fg-secondary)" }}>
          {dateStr}
        </div>
        <div
          className="mt-1 text-4xl tabular-nums"
          style={{
            fontFamily: TITLE_FONT,
            letterSpacing: "-0.025em",
            color: "var(--title)",
          }}
        >
          {timeStr}
        </div>
      </div>
    </div>
  );
}

export default function LandingBento() {
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 gap-2.5 py-10 md:grid-cols-3 md:py-14">
      {/* ── identity / typewriter / bio ── */}
      <div className="md:col-span-2 md:row-span-2 p-7 flex flex-col" style={cardStyle}>
        <div>
          <div
            className="text-lg"
            style={{ fontFamily: TITLE_FONT, color: "var(--title)" }}
          >
            Jiho Kim
          </div>
          <div className="text-sm" style={labelStyle}>
            Product Designer
          </div>
        </div>
        <div
          className="mt-8 text-4xl md:text-[56px]"
          style={{
            fontFamily: TITLE_FONT,
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.025em",
            color: "var(--title)",
          }}
        >
          I am a <Typewriter />
        </div>
        <p
          className="mt-8 max-w-[52ch] text-[15px] leading-relaxed"
          style={{ color: "var(--fg-secondary)" }}
        >
          Specialize in AI-native interfaces as a product designer, with
          strong research and creative execution. I bring my work to life by
          prototyping with code — websites, apps, and adaptive systems. I
          thrive on pushing boundaries, testing early, and proving decisions
          with data.
        </p>
      </div>

      {/* ── clock ── */}
      <div style={cardStyle}>
        <Clock />
      </div>

      {/* ── currently at ── */}
      <div className="p-6" style={cardStyle}>
        <div className="text-[13px]" style={labelStyle}>
          Currently at
        </div>
        <div
          className="mt-2 text-xl"
          style={{ fontFamily: TITLE_FONT, color: "var(--title)" }}
        >
          Stealth AI Startup
        </div>
        <div className="text-sm" style={{ color: "var(--fg-secondary)" }}>
          Founding Designer · 2024—present
        </div>
        <div
          className="mt-4 flex flex-col gap-1 text-[13px]"
          style={labelStyle}
        >
          <span>Lepal.ai · 2024</span>
          <span>TAP3D (XR Training) · 2024</span>
          <span>Project Sidewalk · 2023–2024</span>
          <span>Seoul Women&apos;s University · 2021–2023</span>
        </div>
      </div>

      {/* ── toolkit chips ── */}
      <div className="md:col-span-2 p-6" style={cardStyle}>
        <div className="flex flex-wrap gap-2">
          {TOOLBOX.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px]"
              style={{
                color: "var(--fg-secondary)",
                border: "1px solid var(--hairline)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.src}
                alt=""
                aria-hidden
                className="h-4 w-4 object-contain"
              />
              {tool.name}
            </div>
          ))}
        </div>
      </div>

      {/* ── contact + mode ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex-1 p-6" style={cardStyle}>
          <div className="text-[13px]" style={labelStyle}>
            Contact
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={copyNumber}
              className="rounded-full px-3.5 py-1.5 text-[13px] transition-colors"
              style={{
                border: "1px solid var(--hairline)",
                color: copied ? "var(--link)" : "var(--fg-secondary)",
              }}
            >
              {copied ? "Copied ✓" : "Copy number"}
            </button>
            <a
              href={`mailto:${SITE.email}`}
              className="rounded-full px-3.5 py-1.5 text-[13px]"
              style={{
                border: "1px solid var(--hairline)",
                color: "var(--fg-secondary)",
              }}
            >
              Email me
            </a>
          </div>
        </div>
        <div
          className="flex items-center justify-between px-6 py-4"
          style={cardStyle}
        >
          <div className="text-[13px]" style={labelStyle}>
            Appearance
          </div>
          <ThemeToggle inline />
        </div>
      </div>
    </div>
  );
}
