import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

export type TimelineItem = {
  date: string;
  title: string;
  org?: string;
  orgHref?: string;
  desc?: string;
  sub?: ReactNode[];
  now?: boolean;
};

/**
 * Oldest at the top, newest at the bottom.
 * A dark line fills the grey rail as you scroll; items the line has reached
 * get a filled dot and full-strength text. At the very bottom it stops on the last dot.
 * `scrollEl` = the sheet's scroll container; omit on the full /about page (uses window).
 */
export default function Timeline({ items, scrollEl }: { items: TimelineItem[]; scrollEl?: HTMLElement | null }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ol = ref.current;
    if (!ol) return;
    const target: HTMLElement | Window = scrollEl ?? window;
    let raf = 0;

    const update = () => {
      const tr = ol.getBoundingClientRect();
      const lis = Array.from(ol.children) as HTMLElement[];
      const dots = lis.map((li) => {
        const d = li.querySelector(".jk-tl-dot")!.getBoundingClientRect();
        return d.top + d.height / 2 - tr.top;
      });
      if (!dots.length) return;
      const first = dots[0];
      const last = dots[dots.length - 1];
      ol.style.setProperty("--t0", `${first}px`);
      ol.style.setProperty("--b0", `${tr.height - last}px`);

      const reading = window.innerHeight * 0.62 - tr.top;
      const atBottom = scrollEl
        ? scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 4
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      const end = atBottom ? last : Math.max(first, Math.min(last, reading));
      ol.style.setProperty("--fh", `${Math.max(0, end - first)}px`);
      lis.forEach((li, i) => li.classList.toggle("on", dots[i] <= end + 1));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollEl]);

  return (
    <ol className="jk-tl" ref={ref} style={{} as CSSProperties}>
      {items.map((it) => (
        <li key={`${it.date}-${it.title}`} className={it.now ? "now" : undefined}>
          <span className="jk-tl-dot" aria-hidden="true" />
          <time>{it.date}</time>
          <div className="jk-tl-txt">
            <h3>{it.title}</h3>
            {it.org && (
              <p className="jk-tl-org">
                {it.orgHref ? (
                  <a href={it.orgHref} target="_blank" rel="noreferrer">{it.org}</a>
                ) : (
                  it.org
                )}
              </p>
            )}
            {it.desc && <p>{it.desc}</p>}
            {it.sub && (
              <ul className="jk-tl-sub">
                {it.sub.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
