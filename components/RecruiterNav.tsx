import { BriefcaseBusiness } from "lucide-react";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

// 우상단 보조 나브 — 메인 GlassNav와 같은 리퀴드 글래스 필.
// 클릭하면 챗 패널을 리크루터(잡 매치) 모드로 연다.
export default function RecruiterNav() {
  return (
    <div
      className="fixed right-4 top-4 z-[150]"
      style={{ fontFamily: FONT_STACK }}
    >
      <button
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("jiho-chat-open", { detail: { mode: "recruiter" } })
          )
        }
        className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition-opacity hover:opacity-80"
        style={{
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--liquid-rim), var(--glass-shadow)",
          color: "var(--fg-secondary)",
        }}
      >
        <BriefcaseBusiness size={14} aria-hidden />
        Recruiter mode
      </button>
    </div>
  );
}
