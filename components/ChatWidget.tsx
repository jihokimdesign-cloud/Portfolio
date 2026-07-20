import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import {
  QUICK_ACTIONS_GENERAL,
  QUICK_ACTIONS_RECRUITER,
  SKILL_PILLS,
} from "../lib/constants";
import type { ChatResponse } from "../types";
import { AnimationConfig } from "./AnimationConfig";

/* DESIGN.md tokens (Apple-style ground truth) — theme-aware via CSS vars */
const PRIMARY = "#0071e3";
const FOREGROUND = "var(--fg, #1d1d1f)";
const MUTED = "var(--fg-muted, #6e6e73)";
const CANVAS_LIGHT = "var(--bubble, #f5f5f7)";
const HAIRLINE = "var(--hairline, #d2d2d7)";
const LINK_LIGHT = "var(--link, #0066cc)";
const SURFACE = "var(--surface, #ffffff)";
const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

/* **bold** segments from the API render as accent chips */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <mark
            key={i}
            className="rounded px-1 font-medium"
            style={{ background: `${PRIMARY}14`, color: PRIMARY }}
          >
            {part.slice(2, -2)}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

type Message = {
  role: "user" | "assistant";
  content: string;
  matchPercentage?: number;
  matchLevel?: string;
};

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // first-visit hint: slide-out label + pulse, once per visitor
  useEffect(() => {
    if (localStorage.getItem("jiho-chat-hint-seen")) return;
    const show = setTimeout(() => setShowHint(true), 1800);
    const hide = setTimeout(() => {
      setShowHint(false);
      localStorage.setItem("jiho-chat-hint-seen", "1");
    }, 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const dismissHint = useCallback(() => {
    setShowHint(false);
    localStorage.setItem("jiho-chat-hint-seen", "1");
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 250);
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setInput("");
      setFollowUps([]);
      setMessages((m) => [...m, { role: "user", content: text }]);
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            mode: isRecruiter ? "recruiter" : "general",
            selectedSkills: isRecruiter ? selectedSkills : [],
          }),
        });
        if (!res.ok) throw new Error();
        const data: ChatResponse = await res.json();
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.content,
            matchPercentage: data.matchPercentage,
            matchLevel: data.matchLevel,
          },
        ]);
        setFollowUps(data.followUps ?? []);
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Hmm, I couldn't reach the assistant just now. Please try again in a moment, or email me directly.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, isRecruiter, selectedSkills]
  );

  const toggleSkill = (skill: string) =>
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );

  // 히어로(#landing-hero)가 보이는 동안엔 플로팅 챗 바가 대신 떠 있으니
  // FAB/힌트 숨김 — 히어로를 지나면 지금처럼 우하단 플로팅으로 나타난다
  const [heroBarInView, setHeroBarInView] = useState(false);
  useEffect(() => {
    if (!mounted) return;
    const el = document.getElementById("landing-hero");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroBarInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  // 히어로 입력 클릭/제출 → 패널을 히어로 바 위 중앙에 열고, 질문이 있으면 바로 전송
  const [fromHero, setFromHero] = useState(false);
  useEffect(() => {
    const onOpen = (e: Event) => {
      dismissHint();
      const detail = (e as CustomEvent).detail;
      setFromHero(detail?.source === "hero");
      if (detail?.mode === "recruiter") setIsRecruiter(true);
      setIsOpen(true);
      if (detail?.message) send(detail.message);
    };
    window.addEventListener("jiho-chat-open", onOpen);
    return () => window.removeEventListener("jiho-chat-open", onOpen);
  }, [send, dismissHint]);

  // 나브 토글 ↔ 패널 내부 모드 전환 양방향 동기화
  useEffect(() => {
    const onMode = (e: Event) =>
      setIsRecruiter(Boolean((e as CustomEvent).detail?.recruiter));
    window.addEventListener("jiho-chat-mode", onMode);
    return () => window.removeEventListener("jiho-chat-mode", onMode);
  }, []);
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("jiho-chat-mode-changed", {
        detail: { recruiter: isRecruiter },
      })
    );
  }, [isRecruiter]);

  if (!mounted) return null;

  return createPortal(
    <div style={{ fontFamily: FONT_STACK, color: FOREGROUND }}>
      {/* ── Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{
              duration: AnimationConfig.FAST,
              ease: AnimationConfig.EASING,
            }}
            style={{
              transformOrigin: fromHero ? "bottom center" : "bottom right",
              boxShadow: "0 24px 60px rgba(0,0,0,.35)",
              background: SURFACE,
            }}
            className={`fixed bottom-24 z-[201] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[18px] ${
              fromHero ? "inset-x-0 mx-auto" : "right-5"
            }`}
          >
            {/* header */}
            <div
              className="flex items-start justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${HAIRLINE}` }}
            >
              <div>
                <div className="flex items-center gap-2 text-[15px] font-semibold">
                  {isRecruiter ? "AI Job Match Analysis" : "Chat with Jiho's AI"}
                  {isRecruiter && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                      style={{ background: `${PRIMARY}14`, color: PRIMARY }}
                    >
                      Recruiter
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[13px]" style={{ color: MUTED }}>
                  {isRecruiter
                    ? "Paste a job description to see how I match"
                    : "Ask anything about my work, skills, or experience"}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1 transition-colors"
                style={{ color: MUTED }}
              >
                <X size={16} />
              </button>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex max-h-[45vh] min-h-[180px] flex-col gap-2.5 overflow-y-auto px-4 py-4 text-[14px] leading-relaxed"
            >
              {messages.length === 0 && !loading && (
                <>
                  {isRecruiter && (
                    <div>
                      <div
                        className="mb-2 text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: MUTED }}
                      >
                        Highlight Specific Skills (Optional)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {SKILL_PILLS.map((skill) => {
                          const active = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              onClick={() => toggleSkill(skill)}
                              aria-pressed={active}
                              className="rounded-full px-3 py-1.5 text-[12px] transition-colors"
                              style={
                                active
                                  ? { background: PRIMARY, color: "#fff" }
                                  : {
                                      border: `1px solid ${HAIRLINE}`,
                                      color: MUTED,
                                    }
                              }
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {(isRecruiter
                      ? QUICK_ACTIONS_RECRUITER
                      : QUICK_ACTIONS_GENERAL
                    ).map((a) => (
                      <button
                        key={a.label}
                        onClick={() => send(a.prompt)}
                        className="rounded-full px-3 py-1.5 text-[12px] transition-colors"
                        style={{
                          border: `1px solid ${HAIRLINE}`,
                          color: LINK_LIGHT,
                        }}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <div
                    key={i}
                    className="max-w-[85%] self-end rounded-[18px] rounded-br-[6px] px-4 py-2.5 text-white"
                    style={{ background: PRIMARY }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div
                    key={i}
                    className="max-w-[92%] self-start rounded-[18px] rounded-bl-[6px] px-4 py-2.5"
                    style={{ background: CANVAS_LIGHT }}
                  >
                    {msg.matchPercentage !== undefined && (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-2xl font-semibold">
                          {msg.matchPercentage}%
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          style={{ background: `${PRIMARY}14`, color: PRIMARY }}
                        >
                          {msg.matchLevel}
                        </span>
                      </div>
                    )}
                    {msg.content.split("\n").map((line, j) =>
                      line.trim() ? (
                        <p key={j} className={j > 0 ? "mt-1.5" : ""}>
                          <RichText text={line} />
                        </p>
                      ) : null
                    )}
                  </div>
                )
              )}

              {loading && (
                <div
                  className="flex gap-1.5 self-start rounded-[18px] rounded-bl-[6px] px-4 py-3.5"
                  style={{ background: CANVAS_LIGHT }}
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-pulse rounded-full"
                      style={{
                        background: MUTED,
                        animationDelay: `${d * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {followUps.length > 0 && !loading && (
                <div className="flex flex-wrap gap-1.5">
                  {followUps.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => send(q)}
                      className="rounded-full px-3 py-1.5 text-left text-[12px] transition-colors"
                      style={{
                        border: `1px solid ${HAIRLINE}`,
                        color: LINK_LIGHT,
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* input */}
            <div
              className="px-4 py-3"
              style={{ borderTop: `1px solid ${HAIRLINE}` }}
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={
                    isRecruiter
                      ? "Paste a job description..."
                      : "Type a question..."
                  }
                  rows={1}
                  className="max-h-28 min-h-[40px] flex-1 resize-none rounded-[8px] px-3 py-2.5 text-[14px] transition-shadow focus:outline-none"
                  style={{
                    border: `1px solid ${HAIRLINE}`,
                    background: SURFACE,
                    color: FOREGROUND,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 0 3px ${PRIMARY}33`)
                  }
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-transform active:scale-95 disabled:opacity-30"
                  style={{ background: PRIMARY }}
                >
                  <ArrowUp size={16} />
                </button>
              </div>
              <button
                onClick={() => setIsRecruiter((v) => !v)}
                className="mt-2 text-[12px] transition-colors"
                style={{ color: LINK_LIGHT }}
              >
                {isRecruiter ? "← Back to chat" : "Recruiter →"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── First-visit hint label ── */}
      <AnimatePresence>
        {showHint && !isOpen && !heroBarInView && (
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{
              duration: AnimationConfig.NORMAL,
              ease: AnimationConfig.EASING,
            }}
            onClick={() => {
              dismissHint();
              setIsOpen(true);
            }}
            className="fixed bottom-[30px] right-[76px] z-[201] whitespace-nowrap rounded-full px-4 py-2 text-[13px]"
            style={{
              color: FOREGROUND,
              background: SURFACE,
              boxShadow: "0 8px 24px rgba(0,0,0,.25)",
            }}
          >
            Ask my AI anything{" "}
            <span style={{ color: PRIMARY }} aria-hidden>
              →
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Floating icon — 히어로 입력이 화면에 있는 동안엔 숨김 ── */}
      {!heroBarInView && (
        <button
          onClick={() => {
            dismissHint();
            setIsOpen((v) => !v);
          }}
          aria-label={isOpen ? "Close chat" : "Chat with Jiho's AI"}
          className="fixed bottom-6 right-5 z-[201] flex h-12 w-12 items-center justify-center rounded-full text-white transition-all hover:scale-105"
          style={{
            background: PRIMARY,
            boxShadow: "0 8px 24px rgba(0,113,227,.45)",
          }}
        >
          {showHint && !isOpen && (
            <span
              className="absolute inset-0 animate-ping rounded-full"
              style={{ background: `${PRIMARY}40` }}
              aria-hidden
            />
          )}
          {isOpen ? <X size={18} /> : <MessageCircle size={18} />}
        </button>
      )}
    </div>,
    document.body
  );
}
