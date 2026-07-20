import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";

const ACCENT = "#F97030";

// 메인 GlassNav 옆의 리크루터 모드 토글 — 라벨 + 슬라이딩 스위치 UI.
// 켜면 챗 패널이 잡 매치 모드로 열리고, 끄면 일반 모드로 돌아간다.
// 패널 안에서 모드를 바꿔도 "jiho-chat-mode-changed"로 동기화된다.
export default function RecruiterNav() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = (e: Event) =>
      setOn(Boolean((e as CustomEvent).detail?.recruiter));
    window.addEventListener("jiho-chat-mode-changed", sync);
    return () => window.removeEventListener("jiho-chat-mode-changed", sync);
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (next) {
      window.dispatchEvent(
        new CustomEvent("jiho-chat-open", { detail: { mode: "recruiter" } })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent("jiho-chat-mode", { detail: { recruiter: false } })
      );
    }
  };

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={on}
      aria-label="Recruiter mode"
      className="liquid-glass flex items-center gap-2.5 rounded-full py-2 pl-4 pr-2.5 text-[13px] transition-opacity hover:opacity-90"
      style={{
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--liquid-rim), var(--glass-shadow)",
        color: on ? "var(--fg)" : "var(--fg-secondary)",
      }}
    >
      <BriefcaseBusiness size={14} aria-hidden />
      Recruiter mode
      {/* 슬라이딩 스위치 */}
      <span
        aria-hidden
        className="relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors duration-200"
        style={{
          background: on ? ACCENT : "var(--hairline)",
        }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-[left] duration-200"
          style={{
            left: on ? 18 : 2,
            boxShadow: "0 1px 3px rgba(0,0,0,.25)",
          }}
        />
      </span>
    </button>
  );
}
