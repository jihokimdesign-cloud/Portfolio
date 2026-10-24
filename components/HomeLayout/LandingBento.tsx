import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
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

/* "I am a ___." — cycles keywords with a blinking caret (type → hold →
   delete → next). Starts on "builder." */
const ROLES = ["builder.", "designer.", "prototyper.", "researcher."];

function Typewriter() {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = ROLES[roleIndex];
    let delay = deleting ? 55 : 95;
    if (!deleting && text === word) delay = 1800; // hold full word
    if (deleting && text === "") delay = 300;

    const t = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setRoleIndex((i) => (i + 1) % ROLES.length);
      } else {
        setText(
          deleting
            ? word.slice(0, text.length - 1)
            : word.slice(0, text.length + 1),
        );
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, roleIndex]);

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

        {/* one-line intro */}
        <p
          className="mt-6 max-w-[56ch] text-[15px] leading-relaxed"
          style={{ color: "var(--fg-secondary)", margin: "24px 0 0" }}
        >
          I design AI products that adapt to people, and I prototype them in
          code.
        </p>

        {/* meta + email copy — same row */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex items-center gap-2 text-[14px]"
            style={{ color: "var(--fg-muted)" }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                flexShrink: 0,
              }}
            />
            Open to new roles
          </div>
          <EmailCopyPill />
        </div>

        {/* thin divider → toolkit (merged into the hero card) */}
        <div
          className="mt-7"
          style={{ borderTop: "1px solid var(--hairline)" }}
        />
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
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
              <span
                role="tooltip"
                className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100"
                style={{ background: "var(--title)", color: "var(--canvas)" }}
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
    </div>
  );
}
