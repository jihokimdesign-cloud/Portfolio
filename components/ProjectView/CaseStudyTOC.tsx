// 케이스 스터디 섹션 레일 — 참조 템플릿의 .rail 스타일(번호 01–06 + 짧은 라벨,
// 활성 항목 번호는 --accent). 섹션은 same-origin iframe 안, 스크롤은 부모
// ScrollContainer(네이티브 overflow)에서 일어난다. body 포털 후 iframe/스크롤
// 컨테이너를 찾아 좌표를 계산한다. 미니맵/틱 스크롤바는 제거.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

export default function CaseStudyTOC({ accent }: { accent?: string }) {
  const [mounted, setMounted] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false); // 히어로 지난 뒤 표시
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const scrollerRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let stop = false;
    const collect = () => {
      if (stop) return;
      const iframe = document.querySelector("iframe") as HTMLIFrameElement | null;
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
              ".eyebrow, [class*='uppercase'], .text-xs"
            ) as HTMLElement | null;
            const h2 = s.querySelector("h2") as HTMLElement | null;
            let raw = (eyebrow?.textContent || h2?.textContent || s.id).trim();
            // strip a leading "01"/"1." index so the label reads clean
            raw = raw.replace(/^\s*\d+\s*[.·-]?\s*/, "").replace(/\s+/g, " ");
            return { id: s.id, label: raw.slice(0, 22) };
          });
          setSections((prev) => (prev.length === list.length ? prev : list));
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

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;
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
      // 히어로(셸)를 지나 본문(iframe)이 뷰포트 상단 근처에 오면 표시
      setVisible(iframeTop < window.innerHeight * 0.4);
    };
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

  return createPortal(
    <nav
      className="case-rail"
      aria-label="Sections"
      style={{
        ["--accent" as any]: accent || "var(--accent)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: `translateX(${visible ? 0 : -8}px)`,
      }}
    >
      <ol>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              onClick={() => jump(s.id)}
              className={i === active ? "on" : undefined}
            >
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>,
    document.body
  );
}
