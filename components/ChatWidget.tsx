// 라이브 사이트(jihokim.me)의 ChatModal 구조를 리퀴드 글래스로 재해석한 버전.
// 중앙 대형 모달 + 백드롭, 퀵 액션은 입력창 프리필, 원샷 응답 카드. 스레드형 챗이 아니다.
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Brain, Loader2, AlertCircle } from "lucide-react";
import { QUICK_ACTIONS_GENERAL } from "../lib/constants";
import type { ChatResponse } from "../types";
import { AnimationConfig } from "./AnimationConfig";

const PRIMARY = "#0071e3";
const FOREGROUND = "var(--fg, #1d1d1f)";
const MUTED = "var(--fg-muted, #6e6e73)";
const SECONDARY = "var(--fg-secondary, #6e6e73)";
const HAIRLINE = "var(--glass-border, #d2d2d7)";
const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
const MONO_STACK =
  'ui-monospace, "SF Mono", SFMono-Regular, Menlo, monospace';

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

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // 닫으면 원샷 응답 초기화 (라이브 사이트와 동일)
  useEffect(() => {
    if (!isOpen) {
      setResponse(null);
      setError(null);
    }
  }, [isOpen]);

  const submit = useCallback(
    async (text?: string) => {
      const message = (text ?? input).trim();
      if (!message || loading) return;
      setLoading(true);
      setError(null);
      setResponse(null);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, mode: "general" }),
        });
        if (!res.ok) throw new Error();
        setResponse(await res.json());
      } catch {
        setError(
          "Unable to reach the AI assistant right now. Please try again, or email me directly."
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading]
  );

  // 히어로 입력/나브에서 열기 — 질문이 있으면 바로 제출
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsOpen(true);
      if (detail?.message) {
        setInput(detail.message);
        submit(detail.message);
      }
    };
    window.addEventListener("jiho-chat-open", onOpen);
    return () => window.removeEventListener("jiho-chat-open", onOpen);
  }, [submit]);

  if (!mounted) return null;

  return createPortal(
    <div style={{ fontFamily: FONT_STACK, color: FOREGROUND }}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* ── 백드롭 + 포지셔닝 래퍼: 히어로 입력 바로 위, 입력과 같은 폭
                 (max-w-xl). 입력 바(z-201)는 딤 위에 남아 계속 클릭 가능 ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: AnimationConfig.FAST }}
              className="fixed inset-0 z-[200] flex items-end justify-center px-4 pb-[84px]"
              style={{ background: "rgba(0,0,0,.45)" }}
              onClick={() => setIsOpen(false)}
            >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 16 }}
              transition={{
                duration: AnimationConfig.NORMAL,
                ease: AnimationConfig.EASING,
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[calc(100vh-160px)] w-full max-w-3xl flex-col overflow-hidden rounded-[22px]"
              style={{
                transformOrigin: "bottom center",
                // 불투명 서피스 — 유리로 두면 딤 백드롭이 비쳐 라이트 테마에서도
                // 어둡게 보였음. 서피스는 테마별로 흰색/다크로 알아서 전환
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                boxShadow: "0 24px 60px rgba(0,0,0,.28)",
              }}
            >
              {/* header */}
              <div
                className="flex items-start justify-between px-6 py-5 md:px-10 md:py-6"
                style={{ borderBottom: `1px solid ${HAIRLINE}` }}
              >
                <div>
                  <h2 className="text-xl font-semibold md:text-2xl">
                    Chat with Jiho’s AI Assistant
                  </h2>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: MUTED, fontFamily: MONO_STACK }}
                  >
                    Ask anything about my work, skills, or experience
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="shrink-0 rounded-full p-2 transition-opacity hover:opacity-70"
                  style={{ color: MUTED }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 md:px-10 md:py-6">
                {/* quick actions — 입력창 프리필 (라이브 사이트와 동일) */}
                {!response && !loading && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {QUICK_ACTIONS_GENERAL.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => {
                          setInput(action.prompt);
                          textareaRef.current?.focus();
                        }}
                        className="rounded-full px-4 py-2 text-[11px] font-medium transition-all hover:opacity-80"
                        style={{
                          fontFamily: MONO_STACK,
                          border: `1px solid ${HAIRLINE}`,
                          color: SECONDARY,
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* input */}
                <div className="mb-5">
                  <label
                    className="mb-2 block text-xs font-medium"
                    style={{ fontFamily: MONO_STACK }}
                  >
                    Your Question
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submit();
                      }
                    }}
                    placeholder="Type your question..."
                    rows={4}
                    className="w-full resize-none rounded-xl px-4 py-3 text-sm transition-shadow focus:outline-none"
                    style={{
                      minHeight: 100,
                      maxHeight: 300,
                      border: `1px solid ${HAIRLINE}`,
                      background: "var(--bubble, rgba(127,127,127,.08))",
                      color: FOREGROUND,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = `0 0 0 3px ${PRIMARY}33`)
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  />
                </div>

                {/* submit */}
                <button
                  onClick={() => submit()}
                  disabled={!input.trim() || loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: PRIMARY }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send
                    </>
                  )}
                </button>

                {/* loading */}
                {loading && (
                  <div className="mt-6 flex flex-col items-center gap-3 py-8">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ background: `${PRIMARY}14` }}
                    >
                      <Brain
                        size={24}
                        className="animate-pulse"
                        style={{ color: PRIMARY }}
                      />
                    </div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: MUTED, fontFamily: MONO_STACK }}
                    >
                      Thinking...
                    </p>
                  </div>
                )}

                {/* error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-start gap-3 rounded-xl p-4"
                    style={{
                      border: "1px solid rgba(255,59,48,.35)",
                      background: "rgba(255,59,48,.08)",
                    }}
                  >
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0"
                      style={{ color: "#ff3b30" }}
                    />
                    <div>
                      <p className="text-sm">{error}</p>
                      <button
                        onClick={() => submit()}
                        className="mt-2 text-xs font-semibold underline"
                        style={{ color: "#ff3b30", fontFamily: MONO_STACK }}
                      >
                        Try again
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* response — 원샷 카드 */}
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-6"
                  >
                    <div
                      className="rounded-xl p-6"
                      style={{
                        border: `1px solid ${HAIRLINE}`,
                        background: "var(--bubble, rgba(127,127,127,.08))",
                      }}
                    >
                      <div
                        className="space-y-2 text-sm leading-relaxed"
                        style={{ color: SECONDARY }}
                      >
                        {response.content.split("\n").map((line, i) =>
                          line.trim() ? (
                            <p key={i}>
                              <RichText text={line} />
                            </p>
                          ) : null
                        )}
                      </div>
                    </div>

                    {/* follow-ups — 프리필 칩 */}
                    {response.followUps && response.followUps.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {response.followUps.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInput(q);
                              setResponse(null);
                              textareaRef.current?.focus();
                            }}
                            className="rounded-full px-4 py-2 text-left text-[11px] font-medium transition-all hover:opacity-80"
                            style={{
                              fontFamily: MONO_STACK,
                              border: `1px solid ${HAIRLINE}`,
                              color: SECONDARY,
                            }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
