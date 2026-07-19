import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";
import ModeSwitch from "../ModeSwitch";
import GlobeCard from "./GlobeCard";
import ContactCard from "./ContactCard";

const TITLE_FONT = '"TikTok Sans", Inter, sans-serif';
const ROLES = ["designer.", "builder.", "prototyper.", "founder."];

const TOOLBOX = [
  { name: "Figma", src: "/logos tools/free-figma-logo-icon-svg-download-png-8630394.webp" },
  { name: "Claude", src: "/logos tools/Claude-ai-icon.svg.png" },
  { name: "Framer", src: "/logos tools/framer.avif" },
  { name: "Adobe XD", src: "/logos tools/Adobe_XD_CC_icon.svg.png" },
  { name: "Photoshop", src: "/logos tools/Adobe_Photoshop_CC_icon.svg.png" },
  { name: "Illustrator", src: "/logos tools/Adobe_Illustrator_CC_icon.svg.png" },
  { name: "After Effects", src: "/logos tools/Adobe_After_Effects_CC_icon.svg.png" },
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

/* 플로팅 챗 입력 — 나브와 같은 리퀴드 글래스 필. 히어로(#landing-hero)가
   보이는 동안 하단 중앙에 떠 있고, 지나치면 사라진다(그 자리는 ChatWidget
   FAB이 이어받음). 제출하면 커스텀 이벤트로 패널을 열고 질문을 보낸다. */
function HeroChatBar() {
  const [value, setValue] = useState("");
  const [heroInView, setHeroInView] = useState(true);
  // ScrollContainer의 transform 때문에 내부 fixed는 뷰포트에 안 붙는다 —
  // ChatWidget과 같은 이유로 body 포털 필수
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const el = document.getElementById("landing-hero");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  const submit = () => {
    if (!value.trim()) return;
    window.dispatchEvent(
      new CustomEvent("jiho-chat-open", { detail: { message: value.trim() } })
    );
    setValue("");
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-5 z-[150] flex justify-center px-4"
      style={{
        opacity: heroInView ? 1 : 0,
        transform: heroInView ? "translateY(0)" : "translateY(12px)",
        pointerEvents: heroInView ? "auto" : "none",
        transition: "opacity 250ms ease, transform 250ms ease",
      }}
    >
      <div
        className="liquid-glass flex w-full max-w-xl items-center gap-2 rounded-full p-2 pl-5"
        style={{
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--liquid-rim), var(--glass-shadow)",
          color: "var(--fg)",
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          onFocus={() =>
            window.dispatchEvent(
              new CustomEvent("jiho-chat-open", {
                detail: { source: "hero" },
              })
            )
          }
          placeholder="Ask my AI anything — my work, process, availability…"
          aria-label="Ask Jiho's AI"
          className="flex-1 bg-transparent text-[14px] focus:outline-none"
          style={{ color: "var(--fg)" }}
        />
        <button
          onClick={submit}
          disabled={!value.trim()}
          aria-label="Ask"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform active:scale-95 disabled:opacity-30"
          style={{ background: "#F97030" }}
        >
          <ArrowUp size={15} />
        </button>
      </div>
    </div>,
    document.body
  );
}

/* ModeSwitch bound to the site theme; stays in sync with the nav toggle */
function ThemeModeSwitch({ width = 56 }: { width?: number | string }) {
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

  return <ModeSwitch checked={dark} onChange={apply} width={width} />;
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

/* live local time — 바이오 박스 하단에 들어가는 텍스트 블록 */
function TimeBlock() {
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
    <div className="flex items-baseline justify-between">
      <div className="text-[13px]" style={labelStyle}>
        Seattle, WA · {dateStr}
      </div>
      <div className="text-[13px] tabular-nums" style={labelStyle}>
        {timeStr}
      </div>
    </div>
  );
}

export default function LandingBento() {
  return (
    <div
      id="landing-hero"
      className="grid grid-cols-1 gap-2.5 pt-4 pb-10 md:grid-cols-3 md:pb-14"
    >
      {/* ── identity / typewriter / bio ── */}
      <div className="md:col-span-2 p-7 flex flex-col" style={cardStyle}>
        <div>
          {/* 오렌지 점(파비콘과 동일) + 이름/타이틀, 그 아래 구분선 */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="shrink-0"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#F97030",
              }}
            />
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
          </div>
          <div
            className="mt-5"
            style={{ borderTop: "1px solid var(--hairline)" }}
          />
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
        <div className="mt-auto pt-8">
          <TimeBlock />
        </div>
      </div>

      {/* ── contact (photo-reveal card) ── */}
      <div className="min-h-[280px]">
        <ContactCard />
      </div>

      {/* ── 하단 밴드 왼쪽: 툴킷 스트립 + (Currently at | 모드 스위치) ── */}
      <div className="md:col-span-2 flex flex-col gap-2.5">
        <div className="p-6" style={cardStyle}>
          <div className="text-[13px]" style={labelStyle}>
            Current toolkit
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
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
        {/* ── currently at | mode switch — 나란히 ── */}
        <div className="grid flex-1 grid-cols-1 gap-2.5 md:grid-cols-2">
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
          <div className="flex flex-col justify-center gap-3 px-6 py-4">
            <div className="text-[13px]" style={labelStyle}>
              Mode switch
            </div>
            <ThemeModeSwitch width="100%" />
          </div>
        </div>
      </div>

      {/* ── globe (Worldspan-style) ── */}
      <div className="min-h-[280px]">
        <GlobeCard />
      </div>

      {/* ── AI 챗 입력 — 히어로 맨 아래 풀폭 ── */}
      <HeroChatBar />
    </div>
  );
}
