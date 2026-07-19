import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";

const ACCENT = "#F97030";

// 메인 GlassNav 옆에 앉는 리크루터 모드 토글 필.
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
      className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition-all hover:opacity-90"
      style={{
        border: `1px solid ${on ? ACCENT : "var(--glass-border)"}`,
        boxShadow: "var(--liquid-rim), var(--glass-shadow)",
        color: on ? "#fff" : "var(--fg-secondary)",
        background: on ? ACCENT : undefined,
      }}
    >
      <BriefcaseBusiness size={14} aria-hidden />
      Recruiter mode
    </button>
  );
}
