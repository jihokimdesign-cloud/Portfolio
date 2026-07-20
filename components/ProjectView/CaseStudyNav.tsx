// 케이스 스터디 하단 리퀴드 글래스 도크 — 홈 아이콘 + 라이트/다크 토글.
// ScrollContainer의 transform 서브트리 안에선 fixed가 뷰포트에 안 붙으므로
// body로 포털. 자체 #liquid-lens 필터 포함(케이스 페이지엔 GlassNav 없음).
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Home } from "lucide-react";
import ModeSwitch from "../ModeSwitch";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

function ThemeSwitch() {
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
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return <ModeSwitch checked={dark} onChange={apply} width={52} />;
}

export default function CaseStudyNav() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-x-0 bottom-4 z-[150] flex justify-center px-4"
      style={{ fontFamily: FONT_STACK }}
    >
      {/* liquid-glass 굴절용 변위 맵 (GlassNav와 동일) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter
          id="liquid-lens"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.009"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="110"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div
        className="liquid-glass flex items-center gap-1 rounded-full px-2 py-1.5"
        style={{
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--liquid-rim), var(--glass-shadow)",
          color: "var(--fg)",
        }}
      >
        <Link
          href="/"
          aria-label="Home"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-70"
          style={{ color: "var(--fg-secondary)" }}
        >
          <Home size={17} />
        </Link>
        <span
          className="mx-1 h-4 w-px"
          style={{ background: "var(--glass-border)" }}
          aria-hidden
        />
        <div className="px-1">
          <ThemeSwitch />
        </div>
      </div>
    </div>,
    document.body
  );
}
