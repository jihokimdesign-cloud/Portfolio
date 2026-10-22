import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowUp, Copy, Check } from "lucide-react";
import { SITE } from "../../lib/constants";

const TITLE_FONT = '"TikTok Sans", Inter, sans-serif';

// Toolkit — 5 marks only. Copy carries the rest.
const TOOLS = [
  { name: "Figma", src: "/logos-tools/figma.webp" },
  { name: "Claude Code", src: "/logos-tools/claude.png" },
  { name: "Cursor", src: "/cursorlogo.svg" },
  { name: "React", src: "/logos-tools/react-icon.png" },
  { name: "After Effects", src: "/logos-tools/after-effects.png" },
];

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  borderRadius: 18,
  border: "1px solid var(--hairline)",
};

const labelStyle: React.CSSProperties = {
  color: "var(--fg-muted)",
};

/* "I am a builder." — types the word once on mount, then holds with a
   blinking caret. Always reads "builder." (no cycling). */
const TYPED_WORD = "builder.";

function Typewriter() {
  const [text, setText] = useState("");

  useEffect(() => {
    if (text === TYPED_WORD) return;
    const t = setTimeout(
      () => setText(TYPED_WORD.slice(0, text.length + 1)),
      95
    );
    return () => clearTimeout(t);
  }, [text]);

  return (
    <span>
      {text}
      <span className="typewriter-caret" aria-hidden>
        |
      </span>
    </span>
  );
}

/* Inline case-study link inside the bio paragraph */
function BioLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className="font-medium underline decoration-[1.5px] underline-offset-2 transition-opacity hover:opacity-70"
      style={{ color: "var(--link)" }}
    >
      {children}
    </Link>
  );
}

/* Email pill — copies to clipboard, shows "Copied" briefly. No mailto. */
function EmailCopyPill() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.open(SITE.emailHref, "_blank");
    }
  };
  return (
    <button
      onClick={copy}
      aria-live="polite"
      aria-label={`Copy email ${SITE.email}`}
      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors hover:bg-[var(--bubble)]"
      style={{
        borderColor: "var(--hairline)",
        color: copied ? "var(--link)" : "var(--fg-secondary)",
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : SITE.email}
    </button>
  );
}

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-full border px-3.5 py-1.5 text-[13px] transition-colors hover:bg-[var(--bubble)]"
      style={{ borderColor: "var(--hairline)", color: "var(--fg-secondary)" }}
    >
      {children}
    </a>
  );
}

/* 플로팅 챗 입력 — 나브와 같은 리퀴드 글래스 필. 히어로(#landing-hero)가
   보이는 동안 하단 중앙에 떠 있고, 지나치면 사라진다. */
const CHAT_PROMPTS = [
  "What's your design process?",
  "Tell me about the Cheffy project...",
  "Are you open to new roles?",
  "How do you prototype with code?",
];

function HeroChatBar() {
  const [value, setValue] = useState("");
  const [heroInView, setHeroInView] = useState(true);
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setPromptIndex((i) => (i + 1) % CHAT_PROMPTS.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

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
      className="fixed inset-x-0 bottom-5 z-[201] flex justify-center px-4"
      style={{
        opacity: heroInView ? 1 : 0,
        transform: heroInView ? "translateY(0)" : "translateY(12px)",
        pointerEvents: heroInView ? "auto" : "none",
        transition: "opacity 250ms ease, transform 250ms ease",
      }}
    >
      <div
        className="liquid-glass flex w-full max-w-3xl items-center gap-2 rounded-full p-2 pl-5"
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
              new CustomEvent("jiho-chat-open", { detail: { source: "hero" } })
            )
          }
          placeholder={CHAT_PROMPTS[promptIndex]}
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

export default function LandingBento() {
  return (
    <div
      id="landing-hero"
      className="grid grid-cols-1 gap-2.5 pt-4 pb-6 md:grid-cols-3 md:pb-8"
    >
      {/* ── hero: identity · headline · bio · contact row ── */}
      <div className="md:col-span-3 p-7 lg:p-9 flex flex-col" style={cardStyle}>
        {/* identity */}
        <div>
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

        {/* headline */}
        <h1
          className="mt-6 text-3xl md:text-[40px]"
          style={{
            fontFamily: TITLE_FONT,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "var(--title)",
          }}
        >
          I am a <Typewriter />
        </h1>

        {/* bio */}
        <div
          className="mt-6 flex max-w-[62ch] flex-col gap-4 text-[15px] leading-relaxed"
          style={{ color: "var(--fg-secondary)" }}
        >
          <p>
            I design AI products that adapt to people, and I prototype them in
            code.
          </p>
          <p>
            I&apos;ve built a hands-free cooking assistant that adapts when your
            hands are full at <BioLink href="/projects/cheffy">Cheffy</BioLink>,
            an AI agent for XR workforce training at{" "}
            <BioLink href="/projects/tap3d">TAP</BioLink>, emotion-aware
            journaling at <BioLink href="/projects/lepal">LePal</BioLink>, and
            an accessible design system for{" "}
            <BioLink href="/projects/sidewalk">Project Sidewalk</BioLink>. My AR
            research, <BioLink href="/projects/cookar">CookAR</BioLink>,
            received the UIST 2024 Best Paper Award for Belonging &amp;
            Inclusion.
          </p>
          <p>
            Based in Seoul. Open to roles in Korea, Vancouver, and remote.
          </p>
        </div>

        {/* contact row — right on desktop, stacked on mobile */}
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <EmailCopyPill />
          <PillLink href={SITE.resumeUrl}>Resume</PillLink>
          <PillLink href={SITE.linkedin}>LinkedIn</PillLink>
        </div>
      </div>

      {/* ── toolkit: 5 marks + one line ── */}
      <div className="md:col-span-3 p-6 lg:px-9" style={cardStyle}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          {TOOLS.map((tool) => (
            <span
              key={tool.name}
              className="group relative inline-flex"
              tabIndex={0}
              aria-label={tool.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.src}
                alt={tool.name}
                className="h-8 w-8 object-contain"
                draggable={false}
              />
              {/* tooltip */}
              <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100"
                style={{
                  background: "var(--title)",
                  color: "var(--canvas)",
                }}
              >
                {tool.name}
              </span>
            </span>
          ))}
        </div>
        <div
          className="mt-4 text-[13px]"
          style={{ color: "var(--fg-secondary)" }}
        >
          Figma for concepts, Claude Code for everything that moves.
        </div>
      </div>

      {/* ── AI chat input — floating at hero bottom ── */}
      <HeroChatBar />
    </div>
  );
}
