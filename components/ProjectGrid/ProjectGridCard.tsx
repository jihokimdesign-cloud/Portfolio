import { motion, MotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useBoundingBox } from "../../hooks/useBoundingClientRect";
import { AnimationConfig } from "../AnimationConfig";
import {
  getProjectCover,
  ProjectInfo,
  ProjectStyle,
} from "../../lib/ProjectInfo";
import { useHomeScrollPosition } from "../HomeScrollPositionContext";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { usePageTransition } from "../PageTransition/PageTransitionContext";
import { useWindowDimension } from "../../hooks/useWindowDimension";

const INACTIVE_TEXT_COLOR = "rgb(159, 238, 220)";
const INACTIVE_BG_COLOR = "rgb(37, 55, 52)";

type Props = {
  isActive: boolean;
  index: number;
  projectInfo: ProjectInfo;
  projectStyle: ProjectStyle;
  opacity: MotionValue;
  height: MotionValue;
  parallaxY: MotionValue;
  cardRef: MutableRefObject<HTMLDivElement>;
};

const ProjectGridCard = ({
  projectInfo,
  projectStyle,
  opacity,
  parallaxY,
  height,
  isActive,
  cardRef,
  index,
}: Props) => {
  const [cursorOffsetFromCenter, setCursorOffsetFromCenter] = useState({
    x: 0,
    y: 0,
  });

  const windowDimension = useWindowDimension();
  const cardYOffset = useMemo(() => {
    if (typeof window === "undefined") return 500;
    return windowDimension.height * 0;
  }, [windowDimension.height]);

  const [isHovering, setIsHovering] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { prevCardRef } = usePageTransition();

  // const mouseDelta = useRef(0);
  // const prevMousePos = useRef({ x: 0, y: 0 });
  // const handleMouseEnter = (e: React.MouseEvent) => {
  //   prevMousePos.current.x = e.clientX;
  //   prevMousePos.current.y = e.clientY;
  // };
  // const handleMouseMove = useCallback(
  //   (e: React.MouseEvent) => {
  //     const currX = e.clientX;
  //     const currY = e.clientY;

  //     const delta =
  //       Math.pow(prevMousePos.current.x - currX, 2) +
  //       Math.pow(prevMousePos.current.y - currY, 2);

  //     if (delta > 30) videoRef.current.currentTime += delta * 0.0005;

  //     prevMousePos.current.x = currX;
  //     prevMousePos.current.y = currY;
  //   },
  //   [isHovering]
  // );

  const videoRef = useRef() as MutableRefObject<HTMLVideoElement>;
  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovering) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isHovering]);

  return (
    <Link href={`projects/${projectInfo.slug}`} scroll={false} legacyBehavior>
      <a
        className="relative block h-full"
        onMouseDown={(e) => {
          const target = e.currentTarget as HTMLAnchorElement;
          const bounds = target.getBoundingClientRect();
          setCursorOffsetFromCenter({
            x: (e.clientX - bounds.x) / bounds.width - 0.5,
            y: (e.clientY - bounds.y) / bounds.height - 0.5,
          });
        }}
        // onClickCapture={(e) => {
        //   prevCardRef.current = cardRef.current;
        // }}
        style={{
          pointerEvents: isActive ? "all" : "none",
          cursor: isActive ? "pointer" : "auto",
        }}
        // onMouseMove={handleMouseMove}
        onMouseEnter={(e) => {
          setIsHovering(true);
          // handleMouseEnter(e);
        }}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          style={{
            transformPerspective: "100vw",
            translateZ: "0vw",
          }}
          whileTap={{
            rotateY: cursorOffsetFromCenter.x * 10,
            rotateX: -cursorOffsetFromCenter.y * 10,
            translateZ: "-2vw",
          }}
          transition={{
            duration: AnimationConfig.FAST,
            ease: AnimationConfig.EASING,
          }}
        >
          <motion.div
            className="relative flex flex-col items-center h-full rounded-xl overflow-hidden"
            style={{
              opacity: opacity,
              height: height,
              // maskImage: "-webkit-radial-gradient(white, black)",
              willChange: "height, opacity",
              backgroundColor: INACTIVE_BG_COLOR,
            }}
            animate={{
              y: isActive ? 0 : cardYOffset,
              // scale: isActive ? 1 : 0.98,
            }}
            transition={{
              duration: isActive ? 0.4 : AnimationConfig.FAST,
              ease: isActive
                ? AnimationConfig.EASING_DRAMATIC
                : AnimationConfig.EASING,
              // delay: isActive ? index * 0.05 : 0,
            }}
            ref={cardRef}
          >
            <motion.div
              className="w-full h-full"
              style={{ y: parallaxY, willChange: "transform" }}
              initial={{
                opacity: 0,
                scale: 1,
              }}
              animate={{
                opacity: isActive && isImageLoaded ? 1 : 0,
                transition: {
                  duration: isActive ? 1 : AnimationConfig.NORMAL,
                  ease: AnimationConfig.EASING,
                },
              }}
              whileTap={
                {
                  // scale: 1.03,
                }
              }
              transition={{
                duration: AnimationConfig.FAST,
                ease: AnimationConfig.EASING,
              }}
            >
              <motion.div
                animate={{
                  opacity: 1,
                  scale: isHovering ? 1.1 : 1,
                }}
                transition={{
                  duration: AnimationConfig.SLOW,
                  ease: AnimationConfig.EASING_DRAMATIC,
                }}
              >
                <Image
                  src={getProjectCover(projectInfo.slug)}
                  width={582}
                  height={767}
                  className="w-full "
                  alt={""}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </motion.div>
              {projectInfo.previewVideo && (
                <motion.video
                  disablePictureInPicture
                  transition={{
                    duration: AnimationConfig.SLOW,
                    ease: AnimationConfig.EASING_DRAMATIC,
                  }}
                  animate={{
                    // y: parallaxY,
                    // willChange: "transform",
                    // display: isHovering ? "block" : "none",
                    // visibility: isHovering ? "visible" : "hidden",
                    opacity: isHovering ? 1 : 0,
                    scale: isHovering ? 1.05 : 1,
                  }}
                  ref={videoRef}
                  src={projectInfo.previewVideo}
                  autoPlay
                  muted
                  loop
                  className="w-full object-cover object-center absolute top-0 left-0 right-0"
                />
              )}
            </motion.div>
            {/* <motion.img /> */}

            {/* content */}
            <motion.div
              className="absolute left-0 right-0 top-0 pointer-events-none"
              style={{ color: projectStyle.getTextColor() }}
              // initial={{
              //   opacity: isActive ? 1 : 0,
              // }}
              animate={{
                opacity: isActive && isImageLoaded ? 1 : 0,
                transition: {
                  duration: isActive ? 1 : AnimationConfig.NORMAL,
                  ease: AnimationConfig.EASING,
                },
              }}
            >
              <div className="grid grid-cols-2 py-3 px-4">
                {/* 
                
                  Removing hover state:
                  - Viewer cares about your contribution more
                  - The visual intriuging enough
                  - Text not giving much to be a deciding factor
              
                */}
                <div className="leading-tight">{projectInfo.title}</div>
                <div className="leading-tight">
                  {!isHovering &&
                    projectInfo.tags &&
                    projectInfo.tags.map((tag, index) => {
                      return <div key={index}>{tag}</div>;
                    })}
                  {isHovering && projectInfo.description}
                </div>
                {/* </>
                )} */}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </a>
    </Link>
  );
};

export default ProjectGridCard;
