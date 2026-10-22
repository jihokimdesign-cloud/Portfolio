import React, { useEffect, useRef, useState } from "react";
import { ProjectInfo, ProjectStyle, getProjectCover } from "../../lib/ProjectInfo";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import ReactiveTapArea from "../ReactiveTapArea/ReactiveTapArea";
import { AnimationConfig } from "../AnimationConfig";
import { useSiteTheme } from "../../hooks/useSiteTheme";

type Props = {
  projectStyle: ProjectStyle;
  projectInfo: ProjectInfo;
  cardHeight: number;
  isFirstItem: boolean;
  shouldHideTitles: boolean;
};

const TITLE_FONT = '"TikTok Sans", Inter, sans-serif';
const INACTIVE_BG_COLOR = "rgb(37, 55, 52)";

// no em dashes in displayed copy
const cleanCopy = (s?: string) =>
  (s ?? "").replace(/\s*—\s*/g, ", ").trim();

// per-project crop focus for wide thumbs in the 4/3 box
const FOCUS: Record<string, string> = { sidewalk: "18% center" };

/* 수상 칩 + 트로피 팝 — 카드가 처음 보일 때 세션당 1회, 1초 미만의 버스트. */
function AwardChip({ label }: { label: string }) {
  const chipRef = useRef<HTMLDivElement | null>(null);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    const el = chipRef.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || sessionStorage.getItem("trophy-popped")) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sessionStorage.setItem("trophy-popped", "1");
          setPopping(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={chipRef}
      className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
      style={{
        background: "rgba(20, 20, 22, 0.6)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "#fff",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)",
      }}
    >
      <span
        aria-hidden
        className={`relative inline-block${popping ? " trophy-pop" : ""}`}
      >
        🏆
        {popping && (
          <span className="trophy-burst" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="trophy-particle"
                style={{ ["--i" as any]: i }}
              />
            ))}
          </span>
        )}
      </span>
      {label}
    </div>
  );
}

const ProjectGridItem = ({
  projectInfo,
  cardHeight,
  isFirstItem,
  shouldHideTitles,
}: Props) => {
  const siteTheme = useSiteTheme();
  const themeThumbSrc = projectInfo.thumbHtml?.replace("{theme}", siteTheme);
  const hasVideo = projectInfo.previewVideo !== undefined;
  const thumbFocus = FOCUS[projectInfo.slug] ?? "center";

  const [isImageLoaded, setIsImageLoaded] = useState(
    !!projectInfo.thumbHtml || !!projectInfo.thumbImage,
  );
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isLoading = hasVideo ? !isVideoLoaded : !isImageLoaded;

  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // video load
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.readyState >= 1) {
      setIsVideoLoaded(true);
      return;
    }
    const onLoaded = () => setIsVideoLoaded(true);
    vid.addEventListener("loadedmetadata", onLoaded);
    try {
      vid.load();
    } catch {}
    return () => vid.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  // play on hover; otherwise hold first frame
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovering) {
      v.play().catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {}
    }
  }, [isHovering, isVideoLoaded]);

  const title =
    projectInfo.cardTitle ?? projectInfo.hook ?? projectInfo.description;
  const description = cleanCopy(projectInfo.description);
  const tags = projectInfo.tags ?? [];

  return (
    <motion.div>
      <ReactiveTapArea>
        <Link
          href={`/projects/${projectInfo.slug}`}
          scroll={false}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="group block"
        >
          {/* ── thumbnail panel (4/3) ── */}
          <div
            className="relative overflow-hidden rounded-[18px]"
            style={{
              height: cardHeight,
              border: "1px solid var(--hairline)",
              backgroundColor:
                projectInfo.thumbHtml || projectInfo.thumbImage
                  ? "var(--panel-fade)"
                  : INACTIVE_BG_COLOR,
            }}
          >
            {projectInfo.award && <AwardChip label={projectInfo.award} />}
            <motion.div
              className="h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: !isLoading ? 1 : 0 }}
              transition={{
                duration: AnimationConfig.NORMAL,
                ease: AnimationConfig.EASING_DRAMATIC,
              }}
              style={{
                transform: isHovering ? "scale(1.01)" : "scale(1)",
                transition: "transform .4s ease",
              }}
            >
              {projectInfo.thumbHtml ? (
                <iframe
                  key={themeThumbSrc}
                  src={themeThumbSrc}
                  title={projectInfo.title}
                  scrolling="no"
                  className="absolute inset-0 h-full w-full border-0"
                  style={{ pointerEvents: "none" }}
                  onLoad={() => setIsImageLoaded(true)}
                />
              ) : projectInfo.thumbImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={projectInfo.thumbImage}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: thumbFocus }}
                  alt={`${projectInfo.title} thumbnail`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              ) : (
                !hasVideo && (
                  <Image
                    src={getProjectCover(projectInfo.slug)}
                    width={582}
                    height={767}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: thumbFocus }}
                    alt={`${projectInfo.title} thumbnail`}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                )
              )}

              {hasVideo && (
                <video
                  disablePictureInPicture
                  ref={videoRef}
                  src={projectInfo.previewVideo}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: thumbFocus }}
                />
              )}
            </motion.div>
          </div>

          {/* ── text (16px gap below panel) ── */}
          {!shouldHideTitles && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span
                  className="text-[22px] leading-snug lg:text-[24px]"
                  style={{
                    fontFamily: TITLE_FONT,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "var(--title)",
                  }}
                >
                  {title}
                </span>
                <span
                  aria-hidden
                  className="mt-[6px] shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  style={{ color: "var(--fg-muted)" }}
                >
                  &rarr;
                </span>
              </div>
              {description && (
                <p
                  className="max-w-[46ch] text-[15px] leading-relaxed lg:text-[16px]"
                  style={{ color: "var(--fg-secondary)", margin: 0 }}
                >
                  {description}
                </p>
              )}
              {tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="sw-tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </Link>
      </ReactiveTapArea>
    </motion.div>
  );
};

export default ProjectGridItem;
