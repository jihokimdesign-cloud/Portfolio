// 옛 라이브 사이트 케이스 스터디(정적 embed 변형)를 리디자인 셸의 히어로와
// 넥스트 프로젝트 푸터 사이에 in-flow로 끼워넣는 자동 높이 iframe.
// same-origin이라 contentDocument 높이를 직접 읽어 동기화한다.
import { useEffect, useRef, useState } from "react";

export default function LegacyEmbed({ src }: { src: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);
  const [dark, setDark] = useState(false);

  // 사이트 테마를 iframe 문서에 주입 (embed의 html[data-theme=dark] CSS가 반응)
  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const apply = () => {
      const theme =
        document.documentElement.dataset.theme === "light" ? "light" : "dark";
      setDark(theme === "dark");
      try {
        const doc = iframe.contentDocument;
        if (doc?.documentElement) doc.documentElement.dataset.theme = theme;
      } catch {}
    };
    apply();
    iframe.addEventListener("load", apply);
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      iframe.removeEventListener("load", apply);
      mo.disconnect();
    };
  }, [src]);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const measure = () => {
      try {
        const doc = iframe.contentDocument;
        const h = doc?.documentElement?.scrollHeight;
        if (h && h > 0) setHeight(h);
      } catch {}
    };
    iframe.addEventListener("load", measure);
    // 이미지/폰트가 순차 로드되므로 잠시 폴링으로 따라간다
    const t = setInterval(measure, 500);
    const stop = setTimeout(() => clearInterval(t), 15000);
    return () => {
      iframe.removeEventListener("load", measure);
      clearInterval(t);
      clearTimeout(stop);
    };
  }, [src]);

  return (
    <div className="col-span-full -mx-6 2xl:-mx-16 mt-2">
      <iframe
        ref={ref}
        src={src}
        title="Case study"
        scrolling="no"
        className="w-full border-0"
        style={{
          height,
          display: "block",
          background: dark ? "#0e0e10" : "#ffffff",
        }}
      />
    </div>
  );
}
