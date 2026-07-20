// 라이브 사이트(jihokim.me)의 ChatModal 구조를 리퀴드 글래스로 재해석한 버전.
// 중앙 대형 모달 + 백드롭, 퀵 액션은 입력창 프리필, 원샷 응답 카드(매치 %는
// 점수별 색상), 리크루터 모드는 스킬 필 멀티셀렉트. 스레드형 챗이 아니다.
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Brain,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  QUICK_ACTIONS_GENERAL,
  QUICK_ACTIONS_RECRUITER,
  SKILL_PILLS,
} from "../lib/constants";
import type { ChatResponse } from "../types";
import { AnimationConfig } from "./AnimationConfig";

const PRIMARY = "#0071e3";
const ACCENT = "#F97030"; // 사이트 메인 오렌지 — 리크루터 액션에 사용
const SUCCESS = "#34c759"; // 매치 80%+
const WARNING = "#ffcc00"; // 매치 60%+
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

/* 모달 중앙의 리크루터 스위치 — 나브 토글과 같은 문법 */
function RecruiterSwitch({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px]"
      style={{
        border: `1px solid ${on ? ACCENT : "var(--glass-border)"}`,
        color: on ? FOREGROUND : SECONDARY,
      }}
    >
      Recruiter
      <span
        aria-hidden
        className="relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors duration-200"
        style={{ background: on ? ACCENT : "var(--hairline)" }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-[left] duration-200"
          style={{ left: on ? 18 : 2, boxShadow: "0 1px 3px rgba(0,0,0,.25)" }}
        />
      </span>
    </button>
  );
}

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
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

  // 닫거나 모드를 바꾸면 원샷 응답 초기화 (라이브 사이트와 동일)
  useEffect(() => {
    if (!isOpen) {
      setResponse(null);
      setError(null);
    }
  }, [isOpen]);
  useEffect(() => {
    setResponse(null);
    setError(null);
  }, [isRecruiter]);

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
          body: JSON.stringify({
            message,
            mode: isRecruiter ? "recruiter" : "general",
            selectedSkills: isRecruiter ? selectedSkills : [],
          }),
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
    [input, loading, isRecruiter, selectedSkills]
  );

  const toggleSkill = (skill: string) =>
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );

  // 레인보우 스윕 전환 — 진입은 왼→오, 해제는 반대 방향으로 되감기
  const [sweepDir, setSweepDir] = useState<"fwd" | "rev" | null>(null);
  const prevRecruiter = useRef(false);
  useEffect(() => {
    const was = prevRecruiter.current;
    prevRecruiter.current = isRecruiter;
    if (isRecruiter !== was) {
      setSweepDir(isRecruiter ? "fwd" : "rev");
      const t = setTimeout(() => setSweepDir(null), 2100);
      return () => clearTimeout(t);
    }
  }, [isRecruiter]);

  // 히어로 입력/나브에서 열기 — 질문이 있으면 바로 제출
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.mode === "recruiter") setIsRecruiter(true);
      setIsOpen(true);
      if (detail?.message) {
        setInput(detail.message);
        submit(detail.message);
      }
    };
    window.addEventListener("jiho-chat-open", onOpen);
    return () => window.removeEventListener("jiho-chat-open", onOpen);
  }, [submit]);

  // 나브 토글 ↔ 모달 내부 스위치 양방향 동기화
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

  const quickActions = isRecruiter
    ? QUICK_ACTIONS_RECRUITER
    : QUICK_ACTIONS_GENERAL;
  const matchTint =
    response?.matchPercentage !== undefined
      ? response.matchPercentage >= 80
        ? SUCCESS
        : response.matchPercentage >= 60
        ? WARNING
        : null
      : null;

  return createPortal(
    <div style={{ fontFamily: FONT_STACK, color: FOREGROUND }}>
      {/* ── 리크루터 전환: 검은 화면 위로 무지개가 천천히 지나간다 ── */}
      {sweepDir && (
        <div
          aria-hidden
          className="rainbow-sweep-screen pointer-events-none fixed inset-0 z-[300] overflow-hidden"
        >
          <div
            className={`rainbow-sweep-band${
              sweepDir === "rev" ? " rainbow-sweep-band--reverse" : ""
            }`}
          />
        </div>
      )}
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
              className="liquid-glass flex max-h-[calc(100vh-160px)] w-full max-w-3xl flex-col overflow-hidden rounded-[22px]"
              style={{
                transformOrigin: "bottom center",
                border: "1px solid var(--glass-border)",
                boxShadow: "var(--liquid-rim), var(--glass-shadow)",
              }}
            >
              {/* header */}
              <div
                className="flex items-start justify-between px-6 py-5 md:px-10 md:py-6"
                style={{ borderBottom: `1px solid ${HAIRLINE}` }}
              >
                <div>
                  <h2 className="text-xl font-semibold md:text-2xl">
                    {isRecruiter
                      ? "AI-Powered Job Match Analysis"
                      : "Chat with Jiho’s AI Assistant"}
                  </h2>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: MUTED, fontFamily: MONO_STACK }}
                  >
                    {isRecruiter
                      ? "Paste a job description to see how well I match your role"
                      : "Ask anything about my work, skills, or experience"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <RecruiterSwitch on={isRecruiter} onChange={setIsRecruiter} />
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                    className="rounded-full p-2 transition-opacity hover:opacity-70"
                    style={{ color: MUTED }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 md:px-10 md:py-6">
                {/* skill pills — recruiter only */}
                {isRecruiter && (
                  <div className="mb-5">
                    <p
                      className="mb-2.5 text-xs font-medium"
                      style={{ color: MUTED, fontFamily: MONO_STACK }}
                    >
                      Highlight Specific Skills (Optional)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_PILLS.map((skill) => {
                        const active = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            aria-pressed={active}
                            className="rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all"
                            style={{
                              fontFamily: MONO_STACK,
                              ...(active
                                ? {
                                    background: `${ACCENT}22`,
                                    color: ACCENT,
                                    boxShadow: `inset 0 0 0 1px ${ACCENT}55`,
                                  }
                                : {
                                    border: `1px solid ${HAIRLINE}`,
                                    color: SECONDARY,
                                  }),
                            }}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* quick actions — 입력창 프리필 (라이브 사이트와 동일) */}
                {!response && !loading && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {quickActions.map((action) => (
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
                    {isRecruiter ? "Job Description" : "Your Question"}
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
                    placeholder={
                      isRecruiter
                        ? "Paste the job description here..."
                        : "Type your question..."
                    }
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
                      (e.currentTarget.style.boxShadow = `0 0 0 3px ${
                        isRecruiter ? ACCENT : PRIMARY
                      }33`)
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  />
                </div>

                {/* submit */}
                <button
                  onClick={() => submit()}
                  disabled={!input.trim() || loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: isRecruiter ? ACCENT : PRIMARY }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {isRecruiter ? "Analyze Match" : "Send"}
                    </>
                  )}
                </button>

                {/* loading */}
                {loading && (
                  <div className="mt-6 flex flex-col items-center gap-3 py-8">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        background: `${isRecruiter ? ACCENT : PRIMARY}14`,
                      }}
                    >
                      <Brain
                        size={24}
                        className="animate-pulse"
                        style={{ color: isRecruiter ? ACCENT : PRIMARY }}
                      />
                    </div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: MUTED, fontFamily: MONO_STACK }}
                    >
                      {isRecruiter ? "Analyzing job match..." : "Thinking..."}
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
                        border: `1px solid ${
                          matchTint ? `${matchTint}59` : HAIRLINE
                        }`,
                        background: matchTint
                          ? `${matchTint}0d`
                          : "var(--bubble, rgba(127,127,127,.08))",
                      }}
                    >
                      {response.matchPercentage !== undefined && (
                        <div className="mb-4 flex items-center gap-3">
                          <Sparkles
                            size={20}
                            style={{ color: matchTint ?? MUTED }}
                          />
                          <span className="text-4xl font-bold">
                            {response.matchPercentage}%
                          </span>
                          {response.matchLevel && (
                            <span
                              className="rounded-full px-3 py-1 text-xs font-semibold"
                              style={{
                                fontFamily: MONO_STACK,
                                background: `${matchTint ?? MUTED}1a`,
                                color: matchTint ?? MUTED,
                              }}
                            >
                              {response.matchLevel}
                            </span>
                          )}
                        </div>
                      )}
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
