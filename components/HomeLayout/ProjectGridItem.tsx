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

type Props = {
  projectStyle: ProjectStyle;
  projectInfo: ProjectInfo;
  projectRow: number;
  isWide: boolean;
  bentoClass: string;
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
  bentoClass,
  isFirstItem,
  shouldHideTitles,
}: Props) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const hasVideo = projectInfo.previewVideo !== undefined;
  const isLoading = useMemo(
    () => (isFirstItem && hasVideo ? !isVideoLoaded : !isImageLoaded),
    [isFirstItem, hasVideo, isVideoLoaded, isImageLoaded],
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

  // video loading mechanism
  useEffect(() => {
    if (!videoRef.current) return;

    if (isFirstItem) {
      videoRef.current.play();
      return;
    }

    if (isHovering) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isHovering, isFirstItem]);
  return (
    <motion.div
      className={`h-full ${bentoClass}`}
    >
      <ReactiveTapArea className="h-full">
        <div className="relative h-full">
          {/* rainbow bloom behind the card (soft halo) */}
          <div
            aria-hidden
            className="rainbow-ring pointer-events-none absolute -inset-[2px] rounded-[13px]"
            style={{
              filter: "blur(10px)",
              opacity: isHovering ? 0.45 : 0,
              transition: "opacity .35s ease",
            }}
          />
          {/* crisp 2px rainbow stroke */}
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
        <motion.div
          ref={containerRef}
          className="relative h-full overflow-hidden rounded-xl"
          style={{
            backgroundColor: INACTIVE_BG_COLOR,
          }}
        >
          <Link
            href={`projects/${projectInfo.slug}`}
            scroll={false}
            className="block h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: !isLoading ? 1 : 0,
              }}
              transition={{
                duration: AnimationConfig.NORMAL,
                ease: AnimationConfig.EASING_DRAMATIC,
              }}
              className="h-full"
            >
              {(!isFirstItem || !hasVideo) && (
                <Image
                  src={getProjectCover(projectInfo.slug)}
                  width={582}
                  height={767}
                  className="h-full w-full object-cover object-center"
                  alt={""}
                  onLoad={() => setIsImageLoaded(true)}
                />
              )}

              {projectInfo.previewVideo !== undefined && (
                <motion.video
                  disablePictureInPicture
                  style={{
                    opacity: isHovering || isFirstItem ? 1 : 0,
                    height: "100%",
                  }}
                  ref={videoRef}
                  src={projectInfo.previewVideo}
                  preload="metadata"
                  autoPlay
                  muted
                  loop
                  className="w-full object-cover object-center absolute top-0 left-0 right-0"
                />
              )}
            </motion.div>
            <motion.div
              className="absolute top-0 left-0 right-0 mx-4 my-3 text-sm lg:text-base tracking-tight grid grid-cols-2"
              style={{
                color: projectStyle.getTextColor(),
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: !shouldHideTitles && !isLoading ? 1 : 0,
                }}
                className="mb-1 leading-tight"
              >
                {projectInfo.title}
              </motion.div>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: !shouldHideTitles && !isLoading ? 1 : 0,
                }}
                className="opacity-60 leading-tight"
              >
                {!isHovering
                  ? projectInfo.tags?.map((tag, index) => (
                      <div className="" key={index}>
                        {tag}
                      </div>
                    ))
                  : projectInfo.description}
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
        </div>
      </ReactiveTapArea>
    </motion.div>
  );
};

export default ProjectGridItem;
