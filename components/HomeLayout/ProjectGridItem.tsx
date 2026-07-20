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
  const [isImageLoaded, setIsImageLoaded] = useState(!!projectInfo.thumbHtml);
  const siteTheme = useSiteTheme();
  const themeThumbSrc = projectInfo.thumbHtml?.replace("{theme}", siteTheme);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const hasVideo = projectInfo.previewVideo !== undefined;
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

  // 비디오는 항상 자동재생 (호버 상호작용 제거)
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.play().catch(() => {});
  }, [isVideoLoaded]);
  return (
    <motion.div
      style={{
        gridColumnStart: isWide ? 1 : "auto",
        gridColumnEnd: isWide ? 3 : "auto",
      }}
    >
      <ReactiveTapArea>
        <Link href={`projects/${projectInfo.slug}`} scroll={false}>
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
              ) : (
                !hasVideo && (
                  <Image
                    src={getProjectCover(projectInfo.slug)}
                    width={582}
                    height={767}
                    className={
                      isFirstItem
                        ? "w-full object-cover object-center"
                        : "w-full "
                    }
                    style={isFirstItem ? { height: cardHeight } : undefined}
                    alt={""}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                )
              )}

              {hasVideo && (
                <motion.video
                  disablePictureInPicture
                  style={{ height: cardHeight }}
                  ref={videoRef}
                  src={projectInfo.previewVideo}
                  preload="metadata"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full object-cover object-center absolute top-0 left-0 right-0"
                />
              )}
            </motion.div>
          </div>

          {/* 타이틀 · 카테고리 — 박스 아래, 가까이 묶어서(좌우로 벌리지 않음) */}
          {!shouldHideTitles && (
            <div className="mt-2.5 flex items-baseline justify-start gap-3 px-1">
              <span
                className="text-sm leading-tight lg:text-base"
                style={{ color: "var(--title)" }}
              >
                {projectInfo.title}
              </span>
              <span
                className="text-right text-sm leading-tight lg:text-base"
                style={{ color: "var(--fg-muted)" }}
              >
                {projectInfo.tags?.join(" · ")}
              </span>
            </div>
          )}
        </Link>
      </ReactiveTapArea>
    </motion.div>
  );
};

export default ProjectGridItem;
