import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ProjectInfo,
  ProjectStyle,
  getProjectCover,
} from "../../lib/ProjectInfo";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import Link from "next/link";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import ReactiveTapArea from "../ReactiveTapArea/ReactiveTapArea";
import { AnimationConfig } from "../AnimationConfig";
import { useMotionValueSwitch } from "../../hooks/useMotionValueSwitch";
import { useSiteTheme } from "../../hooks/useSiteTheme";

type Props = {
  projectStyle: ProjectStyle;
  projectInfo: ProjectInfo;
  projectRow: number;
  isWide: boolean;
  cardHeight: number;
  firstRowHeight: number;
  topOffset: number;
  isFirstItem: boolean;
  shouldHideTitles: boolean;
};

const INACTIVE_BG_COLOR = "rgb(37, 55, 52)";

/* 수상 칩 + 트로피 팝 — 카드가 처음 보일 때 세션당 1회, 1초 미만의 버스트.
   prefers-reduced-motion이면 정적 칩만 보여준다. */
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
              <span key={i} className="trophy-particle" style={{ ["--i" as any]: i }} />
            ))}
          </span>
        )}
      </span>
      {label}
    </div>
  );
}

const TRANSPARENT_IMAGE = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`;

const ProjectGridItem = ({
  projectInfo,
  projectStyle,
  projectRow,
  firstRowHeight,
  cardHeight,
  topOffset,
  isWide,
  isFirstItem,
  shouldHideTitles,
}: Props) => {
  const [isImageLoaded, setIsImageLoaded] = useState(
    !!projectInfo.thumbHtml || !!projectInfo.thumbImage,
  );
  const siteTheme = useSiteTheme();
  const themeThumbSrc = projectInfo.thumbHtml?.replace("{theme}", siteTheme);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const hasVideo = projectInfo.previewVideo !== undefined;
  // 와이드 UI 영상을 세로 카드에 담을 때 크롭 초점. Sidewalk은 왼쪽(필터+
  // 첫 열 카드)이 온전히 보이게 좌측 편향, 나머지는 중앙.
  const thumbFocus =
    projectInfo.slug === "sidewalk" ? "18% center" : "center";
  const isLoading = useMemo(
    () => (hasVideo ? !isVideoLoaded : !isImageLoaded),
    [hasVideo, isVideoLoaded, isImageLoaded],
  );

  const [isHovering, setIsHovering] = useState(false);

  const { scrollY } = useContainerScroll();
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;

  const projectGridGap = 16 / 2;
  const marginTop = 16;
  const firstRow = useMemo(
    () => firstRowHeight + projectGridGap,
    [firstRowHeight, projectGridGap],
  );
  const beginShrinkPos = useMemo(() => {
    return (
      firstRow +
      (projectRow - 1) * (cardHeight + projectGridGap) -
      marginTop +
      topOffset
    );
  }, [cardHeight, firstRow, projectGridGap, projectRow, topOffset]);
  const endShrinkPos = useMemo(() => {
    return beginShrinkPos + cardHeight;
  }, [beginShrinkPos, cardHeight]);
  const boxContainerHeight = useMemo(() => cardHeight, [cardHeight]);
  const boxTransitionOutProgress = useTransform(
    scrollY,
    [beginShrinkPos, endShrinkPos],
    [1, 0],
  );

  const boxHeight = useTransform(boxTransitionOutProgress, (val) => {
    return val * boxContainerHeight;
  });
  const parallaxY = useTransform(boxTransitionOutProgress, (val) => {
    return (1 - val) * -boxContainerHeight * 1;
  });

  const headingOpacity = useTransform(
    boxTransitionOutProgress,
    [0.2, 0.1],
    [1, 0],
  );

  const videoRef = useRef() as MutableRefObject<HTMLVideoElement>;

  // video loading mechanism
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.readyState === 4) {
      setIsVideoLoaded(true);
      return;
    }
    const handleVideoLoaded = () => {
      setIsVideoLoaded(true);
      console.log("video is now loaded");
    };
    vid.addEventListener("loadedmetadata", handleVideoLoaded);
    try {
      vid.load();
    } catch (e) {
      console.warn(e);
    }

    return () => {
      vid.removeEventListener("loadedmetadata", handleVideoLoaded);
    };
  }, [videoRef]);

  // 호버 시 재생, 벗어나면 정지(첫 프레임 유지). 피처드 타일은 항상 재생.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovering || isFirstItem) {
      v.play().catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {}
    }
  }, [isHovering, isFirstItem, isVideoLoaded]);
  return (
    <motion.div
      style={{
        gridColumnStart: isWide ? 1 : "auto",
        gridColumnEnd: isWide ? 3 : "auto",
      }}
    >
      <ReactiveTapArea>
        <Link
          href={`projects/${projectInfo.slug}`}
          scroll={false}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative">
          {/* 무지개 후광 (호버) */}
          <div
            aria-hidden
            className="rainbow-ring pointer-events-none absolute -inset-[2px] rounded-[13px]"
            style={{
              filter: "blur(10px)",
              opacity: isHovering ? 0.45 : 0,
              transition: "opacity .35s ease",
            }}
          />
          {/* 무지개 1px 스트로크 (호버) */}
          <div
            aria-hidden
            className="rainbow-ring pointer-events-none absolute -inset-[1px] rounded-[13px]"
            style={{
              padding: "1px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              opacity: isHovering ? 1 : 0,
              transition: "opacity .35s ease",
            }}
          />
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-xl"
            style={{
              height: cardHeight,
              backgroundColor: projectInfo.thumbHtml
                ? "#EDF0F3"
                : INACTIVE_BG_COLOR,
            }}
          >
            {projectInfo.award && <AwardChip label={projectInfo.award} />}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: !isLoading ? 1 : 0 }}
              transition={{
                duration: AnimationConfig.NORMAL,
                ease: AnimationConfig.EASING_DRAMATIC,
              }}
            >
              {projectInfo.thumbHtml ? (
                // 애니메이션 HTML 썸네일 — {theme} 토큰은 테마별 파일로 스위칭
                <iframe
                  key={themeThumbSrc}
                  src={themeThumbSrc}
                  title={projectInfo.title}
                  scrolling="no"
                  className="block w-full border-0"
                  style={{ height: cardHeight, pointerEvents: "none" }}
                  onLoad={() => setIsImageLoaded(true)}
                />
              ) : projectInfo.thumbImage ? (
                // 정적/애니 이미지 썸네일 — 박스를 가득 채운다(크롭)
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={projectInfo.thumbImage}
                  className="w-full object-cover object-center"
                  style={{ height: cardHeight }}
                  alt={`${projectInfo.title} case study thumbnail`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              ) : (
                !hasVideo && (
                  <Image
                    src={getProjectCover(projectInfo.slug)}
                    width={582}
                    height={767}
                    className="w-full object-cover object-center"
                    style={{ height: cardHeight }}
                    alt={`${projectInfo.title} case study thumbnail`}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                )
              )}

              {hasVideo && (
                <motion.video
                  disablePictureInPicture
                  style={{ height: cardHeight, objectPosition: thumbFocus }}
                  ref={videoRef}
                  src={projectInfo.previewVideo}
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  className="w-full object-cover absolute top-0 left-0 right-0"
                />
              )}
            </motion.div>
          </div>
          </div>

          {/* 훅 라인이 1행 타이틀 — 회사명이 아니라 '무엇을 했는지'가 먼저.
              프로젝트명 · 카테고리는 보조 라벨로 아래에 작게 */}
          {!shouldHideTitles && (
            <div className="mt-2.5 flex flex-col gap-0.5 px-1">
              <span
                className="text-sm leading-snug lg:text-base"
                style={{ color: "var(--title)" }}
              >
                {projectInfo.cardTitle ??
                  projectInfo.hook ??
                  projectInfo.description}
              </span>
              <span
                className="text-xs leading-tight lg:text-sm"
                style={{ color: "var(--fg-muted)" }}
              >
                {projectInfo.cardMeta ??
                  `${projectInfo.title}${
                    projectInfo.tags?.length
                      ? ` · ${projectInfo.tags.join(" · ")}`
                      : ""
                  }`}
              </span>
            </div>
          )}
        </Link>
      </ReactiveTapArea>
    </motion.div>
  );
};

export default ProjectGridItem;
