// "Next project" card at the end of a case — markup for the existing
// .jk-cases / .jk-case stylesheet, reusing the next project's Home media.
import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  description: string;
  thumbHtml?: string;
  previewVideo?: string;
  thumbImage?: string;
  cover?: string;
};

const MEDIA_STYLE: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover",
  border: 0,
};

export default function CaseNextCard({
  slug,
  title,
  description,
  thumbHtml,
  previewVideo,
  thumbImage,
  cover,
}: Props) {
  // follow the page theme (case pages open dark; the dock toggle flips <html>)
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  let media: React.ReactNode;
  if (thumbHtml) {
    media = (
      <iframe
        key={theme}
        src={thumbHtml.replace("{theme}", theme)}
        title={`${title} preview`}
        scrolling="no"
        tabIndex={-1}
        style={{ ...MEDIA_STYLE, pointerEvents: "none" }}
      />
    );
  } else if (previewVideo) {
    media = (
      <video
        src={previewVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={MEDIA_STYLE}
      />
    );
  } else {
    media = <img src={thumbImage || cover} alt="" style={MEDIA_STYLE} />;
  }

  return (
    <div
      className="jk-cases"
      style={{ gridTemplateColumns: "1fr", rowGap: 0, marginTop: 96 }}
    >
      <p
        style={{
          gridColumn: "1 / -1",
          margin: "0 0 18px",
          fontSize: 13,
          fontWeight: 510,
          letterSpacing: ".04em",
          textTransform: "uppercase",
          color: "var(--jk-fg-3)",
        }}
      >
        Next project
      </p>
      <Link className="jk-case" href={`/projects/${slug}`} scroll={false}>
        <div className="jk-case-body">
          <h3 className="jk-case-title">
            {title}
            <svg className="jk-case-arrow" viewBox="0 0 16 16" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </h3>
          <p className="jk-case-desc">{description}</p>
        </div>
        <div className="jk-case-media">{media}</div>
      </Link>
    </div>
  );
}
