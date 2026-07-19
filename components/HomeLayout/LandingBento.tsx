import { useEffect, useRef, useState } from "react";
import ModeSwitch from "../ModeSwitch";
import GlobeCard from "./GlobeCard";
import ContactCard from "./ContactCard";

const PRIMARY = "#0071e3";

const TITLE_FONT = '"TikTok Sans", Inter, sans-serif';
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

/* ModeSwitch bound to the site theme; stays in sync with the nav toggle */
function ThemeModeSwitch() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const read = () =>
      setDark(document.documentElement.dataset.theme !== "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  const apply = (d: boolean) => {
    const next = d ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return <ModeSwitch checked={dark} onChange={apply} width={56} />;
}

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

/* analog watch face — smooth-sweep arms driven outside React render */
function AnalogClock({ size = 116 }: { size?: number }) {
  const hourRef = useRef<SVGGElement>(null);
  const minRef = useRef<SVGGElement>(null);
  const secRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const d = new Date();
      const s = d.getSeconds() + d.getMilliseconds() / 1000;
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;
      if (secRef.current)
        secRef.current.style.transform = `rotate(${s * 6}deg)`;
      if (minRef.current)
        minRef.current.style.transform = `rotate(${m * 6}deg)`;
      if (hourRef.current)
        hourRef.current.style.transform = `rotate(${h * 30}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const armStyle: React.CSSProperties = {
    transformOrigin: "50% 50%",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden
      className="shrink-0"
    >
      {/* dial */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="var(--hairline)"
        strokeWidth="1.5"
      />
      {Array.from({ length: 60 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1={i % 5 === 0 ? 6 : 8.5}
          x2="50"
          y2="11.5"
          stroke={i % 5 === 0 ? "var(--fg)" : "var(--fg-muted)"}
          strokeWidth={i % 5 === 0 ? 2 : 0.8}
          strokeLinecap="round"
          transform={`rotate(${i * 6} 50 50)`}
          opacity={i % 5 === 0 ? 0.9 : 0.45}
        />
      ))}
      {/* arms */}
      <g ref={hourRef} style={armStyle}>
        <line
          x1="50"
          y1="52"
          x2="50"
          y2="30"
          stroke="var(--fg)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </g>
      <g ref={minRef} style={armStyle}>
        <line
          x1="50"
          y1="53"
          x2="50"
          y2="17"
          stroke="var(--fg)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <g ref={secRef} style={armStyle}>
        <line
          x1="50"
          y1="58"
          x2="50"
          y2="13"
          stroke={PRIMARY}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
      <circle cx="50" cy="50" r="2.6" fill={PRIMARY} />
      <circle cx="50" cy="50" r="1" fill="var(--surface)" />
    </svg>
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
    <div className="flex h-full items-center gap-6 p-6">
      <AnalogClock />
      <div className="flex h-full flex-col justify-between py-1">
        <div className="text-[13px]" style={labelStyle}>
          Seattle, WA
        </div>
        <div>
          <div className="text-sm" style={{ color: "var(--fg-secondary)" }}>
            {dateStr}
          </div>
          <div
            className="mt-1 text-3xl tabular-nums"
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
    </div>
  );
}

export default function LandingBento() {
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
              title={tool.name}
              className="flex h-11 w-11 items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.src}
                alt={tool.name}
                className="h-7 w-7 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── globe (Worldspan-style) ── */}
      <div className="md:row-span-2 min-h-[280px]">
        <GlobeCard />
      </div>

      {/* ── contact (photo-reveal card) ── */}
      <div className="min-h-[280px]">
        <ContactCard />
      </div>

      {/* ── mode switch ── */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={cardStyle}
      >
        <div className="text-[13px]" style={labelStyle}>
          Appearance
        </div>
        <ThemeModeSwitch />
      </div>
    </div>
  );
}
