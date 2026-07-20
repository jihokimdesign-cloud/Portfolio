import { motion } from "framer-motion";
import React, {
  MutableRefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { Figure } from "./FigureWrapper";
import VideoProgressCursor from "../VideoProgressCursor/VideoProgressCursor";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import { clamp } from "../../lib/clamp";

type HoveringVideoTarget = HTMLVideoElement | null;
type VideoContextProps = {
  hoveringVideo: HoveringVideoTarget;
  setHoveringVideo: (target: HoveringVideoTarget) => void;
  clearHoveringVideo: () => void;
};
export const VideoHoverContext = createContext<VideoContextProps>({
  hoveringVideo: null,
  setHoveringVideo: () => { },
  clearHoveringVideo: () => { },
});
export const VideoHoverContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hoveringVideo, setHoveringVideo] = useState<HoveringVideoTarget>(null);
  const clearHoveringVideo = () => setHoveringVideo(null);

  return (
    <VideoHoverContext.Provider
      value={{ hoveringVideo, setHoveringVideo, clearHoveringVideo }}
    >
      {children}
    </VideoHoverContext.Provider>
  );
};

type Props = {
  src: string;
  width: number;
  height: number;
  seekOnScroll: boolean;
  canScrub?: boolean;
  fillHeight?: boolean;
  frameRate: number;
  rowSpan?: number;
  children?: React.ReactNode;
  darkMode: boolean;
  preload: string;
  cursorColor?: string;
};

const Video = ({
  src,
  width,
  height,
  seekOnScroll,
  canScrub = true,
  frameRate = 12,
  fillHeight,
  children,
  rowSpan = 1,
  preload = "metadata",
  darkMode,
  cursorColor = "#EEE",
}: Props) => {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const playerRef = useRef() as MutableRefObject<HTMLVideoElement>;
  const { scrollY } = useContainerScroll();
  const windowDimension = useWindowDimension();

  const { clearHoveringVideo, setHoveringVideo, hoveringVideo } =
    useContext(VideoHoverContext);

  useEffect(() => {
    if (hoveringVideo === null) {
      if (isInView) {
        setShouldPlay(true);
        return;
      }
      setShouldPlay(false);
    }

    if (!isInView) return;
    if (hoveringVideo === playerRef.current) {
      setShouldPlay(true);
      return;
    }
    setShouldPlay(false);
  }, [isInView, hoveringVideo]);

  useEffect(() => {
    if (!seekOnScroll) return;

    const unobserveScroll = scrollY.onChange((scrollPos) => {
      // const offset = Math.abs(initialScrollPos - scrollPos);
      // const adjustedOffset = offset / 3000;

      const vidDuration = playerRef.current.duration;
      if (!vidDuration) return;

      const totalFrames = Math.ceil(vidDuration / (1 / frameRate));

      // const totalScroll = window.innerHeight * 2;
      const pixelPerFrame = 200;

      const targetFrame = Math.round(scrollPos / pixelPerFrame);

      setCurrentFrame(targetFrame % totalFrames);
    });

    return () => {
      unobserveScroll();
    };
  }, [seekOnScroll, frameRate]);

  useEffect(() => {
    if (!seekOnScroll) return;
    if (!isInView) return;

    const animFrame = requestAnimationFrame(() => {
      if (!playerRef.current) return;

      playerRef.current.currentTime = currentFrame / frameRate;
    });
    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [currentFrame, seekOnScroll, isInView]);

  useEffect(() => {
    if (!playerRef.current || seekOnScroll) return;

    if (shouldPlay) {
      playerRef.current.play();
      return;
    }
    playerRef.current.pause();
  }, [shouldPlay, playerRef, seekOnScroll]);

  const [isScrubbing, setIsScrubbing] = useState(false);

  useEffect(() => {
    if (seekOnScroll || !canScrub) return;

    let prevTouchX = 0;
    let isUsingTouch = false;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      isUsingTouch = true;
      prevTouchX = e.touches[0].clientX;
      handleDragStart();
    };
    const handleTouchMove = (e: TouchEvent) => {
      const offset = e.touches[0].clientX - prevTouchX;
      updateScrub(offset * 0.5);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      isUsingTouch = false;
      handleDragEnd();
    };

    const handleDragStart = () => {
      isDragging = true;
      playerRef.current.pause();
      setIsScrubbing(true);
    };
    const handleDragMove = (e: PointerEvent) => {
      if (isUsingTouch) return;
      if (!isDragging || !playerRef.current || !playerRef.current.duration)
        return;

      const offset = e.movementX;
      updateScrub(offset);
    };

    const updateScrub = (offset: number) => {
      const newTime = playerRef.current.currentTime + offset / 100;
      // const overflowTime = newTime - playerRef.current.duration;

      // if (overflowTime > 0) {
      //   playerRef.current.currentTime = overflowTime;
      //   return;
      // }

      // if (newTime < 0) {
      //   playerRef.current.currentTime = playerRef.current.duration + newTime;
      //   return;
      // }

      playerRef.current.currentTime = clamp(
        newTime,
        0,
        playerRef.current.duration
      );
    };
    const handleDragEnd = () => {
      isDragging = false;
      playerRef.current.play();
      setIsScrubbing(false);
    };

    playerRef.current.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);

    playerRef.current.addEventListener("pointerdown", handleDragStart);
    window.addEventListener("pointermove", handleDragMove);
    playerRef.current.addEventListener("pointerup", handleDragEnd);

    return () => {
      if (!playerRef.current) return;

      playerRef.current.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);

      playerRef.current.removeEventListener("pointerdown", handleDragStart);
      window.removeEventListener("pointermove", handleDragMove);
      playerRef.current.removeEventListener("pointerup", handleDragEnd);
    };
  }, [playerRef.current, windowDimension.width, seekOnScroll, canScrub]);

  useEffect(() => {
    if (!playerRef.current?.requestPointerLock || !document.exitPointerLock)
      return;

    if (!isScrubbing) {
      document.exitPointerLock();
      return;
    }
    playerRef.current.requestPointerLock();
  }, [isScrubbing]);

  return (
    <Figure rowSpan={rowSpan}>
      {!seekOnScroll && canScrub && (
        <VideoProgressCursor
          playerRef={playerRef}
          isScrubbing={isScrubbing}
          // fill={"rgb(242, 84, 16)"}
          fill={cursorColor}
          idleTimer={500}
        />
      )}
      {/* <ReactiveTapArea
        className={`w-full ${fillHeight ? "md:h-full" : ""} md:object-cover`}
        // startFromCenter
      > */}
      <motion.video
        onMouseEnter={() => canScrub && setHoveringVideo(playerRef.current)}
        onMouseLeave={() => canScrub && clearHoveringVideo()}
        className={`w-full ${fillHeight ? "md:h-full" : ""
          } md:object-cover rounded-xl touch-pan-y`}
        ref={playerRef}
        style={{
          visibility: isInView ? "visible" : "hidden",
          cursor: seekOnScroll || !canScrub ? "auto" : "grab",
        }}
        animate={{
          opacity: seekOnScroll || shouldPlay ? 1 : 0.5,
          transition: {
            duration: 0.2,
            ease: "linear",
          },
        }}
        onViewportEnter={() => setIsInView(true)}
        onViewportLeave={() => setIsInView(false)}
        // whileTap={{
        //   scale: 1.01,
        // }}
        src={src}
        width={width}
        height={height}
        preload={seekOnScroll ? "auto" : preload}
        autoPlay={seekOnScroll ? false : true}
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
      />
      {children}
      {/* </ReactiveTapArea> */}
    </Figure>
  );
};

export default Video;
