// 케이스 스터디 목차 — 좌측 섹션 내비(스크롤 스파이) + 우측 미니맵.
// 섹션은 same-origin iframe 안에 있고 스크롤은 부모 ScrollContainer(네이티브
// overflow-y-auto)에서 일어난다. body 포털(ProjectView transform 회피) 후
// iframe/스크롤 컨테이너를 DOM에서 찾아 좌표를 계산한다.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

type Section = { id: string; label: string };

function findScroller(from: HTMLElement | null): HTMLElement | null {
  let el = from?.parentElement || null;
  while (el) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight)
      return el;
    el = el.parentElement;
  }
  return null;
}

export default function CaseStudyTOC() {
  const [mounted, setMounted] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 전체 스크롤 진행
  const [visible, setVisible] = useState(false); // 히어로 지난 뒤 표시
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const scrollerRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // iframe / 섹션 / 스크롤 컨테이너 수집 (로드·리사이즈에 대응해 폴링)
  useEffect(() => {
    if (!mounted) return;
    let stop = false;
    const collect = () => {
      if (stop) return;
      const iframe = document.querySelector(
        "iframe"
      ) as HTMLIFrameElement | null;
      if (!iframe) return;
      iframeRef.current = iframe;
      scrollerRef.current = findScroller(iframe);
      try {
        const doc = iframe.contentDocument;
        const secs = Array.from(
          doc?.querySelectorAll("section[id]") || []
        ) as HTMLElement[];
        if (secs.length) {
          const list = secs.map((s) => {
            const eyebrow = s.querySelector(
              '[class*="uppercase"], .text-xs, .text-\\[10px\\]'
            ) as HTMLElement | null;
            const h2 = s.querySelector("h2") as HTMLElement | null;
            const raw = (eyebrow?.textContent || h2?.textContent || s.id).trim();
            return { id: s.id, label: raw.replace(/\s+/g, " ").slice(0, 32) };
          });
          setSections((prev) =>
            prev.length === list.length ? prev : list
          );
        }
      } catch {}
    };
    collect();
    const t = setInterval(collect, 800);
    const stopT = setTimeout(() => clearInterval(t), 16000);
    return () => {
      stop = true;
      clearInterval(t);
      clearTimeout(stopT);
    };
  }, [mounted]);

  // 스크롤 스파이 + 진행도
  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      const iframe = iframeRef.current;
      const scroller = scrollerRef.current;
      if (!iframe || !scroller) return;
      let doc: Document | null = null;
      try {
        doc = iframe.contentDocument;
      } catch {
        return;
      }
      if (!doc) return;
      const iframeTop = iframe.getBoundingClientRect().top;
      const threshold = window.innerHeight * 0.35;
      let cur = 0;
      sections.forEach((s, i) => {
        const el = doc!.getElementById(s.id);
        if (!el) return;
        const top = iframeTop + el.getBoundingClientRect().top;
        if (top <= threshold) cur = i;
      });
      setActive(cur);
      const max = scroller.scrollHeight - scroller.clientHeight;
      setProgress(max > 0 ? Math.min(1, scroller.scrollTop / max) : 0);
      // 히어로를 지나 본문에 들어오면 뜬다
      setVisible(scroller.scrollTop > window.innerHeight * 0.75);
    };
    const scroller = scrollerRef.current || window;
    const target: any = scrollerRef.current || window;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mounted, sections]);

  const jump = (id: string) => {
    const iframe = iframeRef.current;
    const scroller = scrollerRef.current;
    if (!iframe || !scroller) return;
    try {
      const el = iframe.contentDocument?.getElementById(id);
      if (!el) return;
      const iframeTop = iframe.getBoundingClientRect().top;
      const target =
        scroller.scrollTop + iframeTop + el.getBoundingClientRect().top - 80;
      scroller.scrollTo({ top: target, behavior: "smooth" });
    } catch {}
  };

  if (!mounted || sections.length < 2) return null;

  // 미니맵: 섹션당 롱틱 1 + 숏틱 3, 진행도 근처는 살짝 확장
  const rows: { long: boolean; sec: number }[] = [];
  sections.forEach((_, i) => {
    rows.push({ long: true, sec: i });
    for (let k = 0; k < 3; k++) rows.push({ long: false, sec: i });
  });

  return createPortal(
    <div style={{ fontFamily: FONT_STACK }}>
      {/* 좌측 섹션 내비 (넓은 화면만) — 본문 진입 후 페이드인 */}
      <nav
        className="fixed left-6 top-1/2 z-[140] hidden -translate-y-1/2 flex-col gap-3 xl:flex"
        aria-label="Sections"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transform: `translateY(-50%) translateX(${visible ? 0 : -8}px)`,
          transition: "opacity .35s ease, transform .35s ease",
        }}
      >
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => jump(s.id)}
            className="text-left text-[13px] leading-tight transition-opacity"
            style={{
              color: "var(--fg)",
              opacity: i === active ? 1 : 0.4,
              maxWidth: 160,
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* 우측 미니맵 — 본문 진입 후 페이드인 */}
      <div
        className="fixed right-4 top-1/2 z-[140] hidden -translate-y-1/2 flex-col items-end gap-1 md:flex"
        aria-hidden
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity .35s ease",
        }}
      >
        {rows.map((r, i) => {
          const near = Math.abs(r.sec - active) === 0;
          const scale =
            r.sec === active ? (r.long ? 1 : 1.4) : 1;
          return (
            <div
              key={i}
              style={{
                width: r.long ? 20 : 10,
                height: 2,
                borderRadius: 1,
                transformOrigin: "100% 0",
                transform: `scaleX(${scale})`,
                transition: "transform .15s linear, background-color .2s",
                background:
                  r.sec <= active
                    ? "var(--fg-muted)"
                    : "var(--hairline)",
                opacity: near ? 1 : 0.7,
              }}
            />
          );
        })}
      </div>
    </div>,
    document.body
  );
}
