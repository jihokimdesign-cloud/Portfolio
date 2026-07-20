import {
  motion,
  useAnimation,
} from "framer-motion";
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimationConfig } from "../AnimationConfig";
import ClientOnlyPortal from "../ClientOnlyPortal/ClientOnlyPortal";
import { ProgressRing } from "./ProgressRing";
import useStateRef from "../../hooks/useStateRef";
import { clamp } from "../../lib/clamp";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { fancyTimeFormat } from "../../lib/fancyTimeFormat";

type Props = {
  playerRef: MutableRefObject<HTMLVideoElement>;
  isScrubbing: boolean;
  fill: string;
  idleTimer?: number;
};

// const RADIUS = 24; // default is 24
const RADIUS = 36;

const VideoProgressCursor = ({
  playerRef,
  isScrubbing,
  fill = "#FFF",
  idleTimer = 500,
}: Props) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const timeString = useMemo(() => fancyTimeFormat(currentTime), [currentTime]);

  const { scrollY } = useContainerScroll();

  const anim = useAnimation();

  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering, isHoveringRef] = useStateRef(false);

  const isScrubbingRef = useRef(false);
  const cursorPosRef = useRef({ x: 0, y: 0 });

  const debounceHideTimer = useRef<ReturnType<typeof setTimeout>>();

  const startHideCursorTimerDebounced = () => {
    setIsActive(true);
    // auto hide
    if (debounceHideTimer.current) {
      clearTimeout(debounceHideTimer.current);
    }
    debounceHideTimer.current = setTimeout(() => {
      // don't hide when it is scurbbing
      if (isScrubbingRef.current) {
        startHideCursorTimerDebounced();
        return;
      }
      setIsActive(false);
    }, idleTimer);
  };

  useEffect(() => {
    isScrubbingRef.current = isScrubbing;

    if (isScrubbing) setIsActive(true);
  }, [isScrubbing]);

  useEffect(() => {
    const cleanup = scrollY.onChange(() => {
      setIsActive(false);
    });

    return () => {
      cleanup();
    };
  }, [scrollY]);

  useEffect(() => {
    if (isActive) {
      anim.start({
        opacity: 1,
        // scale: .7,
        transition: {
          duration: AnimationConfig.NORMAL,
          ease: AnimationConfig.EASING,
        },
      });

      return;
    }

    clearTimeout(debounceHideTimer.current);
    anim.start({
      opacity: 0,
      // scale: .7,
      // x: vidBounds.left + vidBounds.width / 2,
      // y: vidBounds.top + vidBounds.height / 2,
      transition: {
        duration: AnimationConfig.NORMAL,
        ease: AnimationConfig.EASING,
      },
    });
  }, [isActive, isHovering]);

  const getClampedMousePosition = (
    vidBounds: { left: number; top: number; right: number; bottom: number },
    positionX: number,
    positionY: number,
    edgeMargin = RADIUS + 4
  ) => {
    return {
      x: clamp(
        positionX,
        vidBounds.left + edgeMargin,
        vidBounds.right - edgeMargin
      ),
      y: clamp(
        positionY,
        vidBounds.top + edgeMargin,
        vidBounds.bottom - edgeMargin
      ),
    };
  };

  useEffect(() => {
    const handlePointerEnter = (e: MouseEvent) => {
      if (!playerRef.current) return;

      setIsActive(true);
      setIsHovering(true);

      const vidBounds = playerRef.current.getBoundingClientRect();
      const newPos = getClampedMousePosition(vidBounds, e.clientX, e.clientY);

      anim.set({
        x: newPos.x - RADIUS,
        y: newPos.y - RADIUS,
        opacity: 0,
      });
    };
    const handlePointerMove = (e: MouseEvent) => {
      if (!playerRef.current) return;

      cursorPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      if (isHoveringRef.current === false || isScrubbingRef.current === true)
        return;

      startHideCursorTimerDebounced();

      const vidBounds = playerRef.current.getBoundingClientRect();
      const newPos = getClampedMousePosition(vidBounds, e.clientX, e.clientY);

      anim.start({
        x: newPos.x - RADIUS,
        y: newPos.y - RADIUS,
        transition: {
          duration: 0.25,
          ease: AnimationConfig.EASING,
        },
      });
    };
    const handlePointerLeave = (e: MouseEvent) => {
      if (!playerRef.current) return;

      setIsHovering(false);
      setIsActive(false);

      // setMouseOffset({
      //   x: vidBounds.width / 2,
      //   y: vidBounds.height / 2,
      // });
    };

    const handleScroll = () => {
      startHideCursorTimerDebounced();
    };

    playerRef.current.addEventListener("pointerenter", handlePointerEnter);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("scroll", handleScroll);
    playerRef.current.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (!playerRef.current) return;

      playerRef.current.removeEventListener("pointerenter", handlePointerEnter);
      window.removeEventListener("pointermove", handlePointerMove);
      window.addEventListener("scroll", handleScroll);
      playerRef.current.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [playerRef.current]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setProgress(
        (playerRef.current.currentTime / playerRef.current.duration) * 100
      );
      setCurrentTime(playerRef.current.currentTime);
    }, 32);

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const INITIAL_SCALE = .7;
  const EXPANDED_SCALE = 1;
  useEffect(() => {
    if (isScrubbing) {
      anim.start({
        // x: vidBounds.left + vidBounds.width / 2 - RADIUS,
        // y: vidBounds.top + vidBounds.height / 2 - RADIUS,
        scale: EXPANDED_SCALE,
        transition: {
          duration: AnimationConfig.VERY_FAST,
          ease: AnimationConfig.EASING,
        },
      });
      return;
    }

    // const newPos = getClampedMousePosition(
    //   vidBounds,
    //   cursorPosRef.current.x,
    //   cursorPosRef.current.y
    // );
    anim.start({
      // x: newPos.x - RADIUS,
      // y: newPos.y - RADIUS,
      scale: INITIAL_SCALE,
      transition: {
        duration: AnimationConfig.VERY_FAST,
        ease: AnimationConfig.EASING,
      },
    });
  }, [isScrubbing, playerRef]);

  // the feedback of scrubbing

  const [shouldEmphasiseLeft, setShouldEmphasiseLeft] = useState(false);
  const [shouldEmphasiseRight, setShouldEmphasiseRight] = useState(false);
  const lastProgress = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function reset() {
      setShouldEmphasiseLeft(false);
      setShouldEmphasiseRight(false);
    }

    if (!isScrubbing) {
      reset();
      return;
    }

    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(reset, 100);

    if (progress > lastProgress.current) {
      setShouldEmphasiseLeft(false);
      setShouldEmphasiseRight(true);
    } else {
      setShouldEmphasiseLeft(true);
      setShouldEmphasiseRight(false);
    }
    lastProgress.current = progress;
  }, [isScrubbing, progress]);

  return (
    <ClientOnlyPortal selector="body">
      <motion.div
        className="fixed left-0 z-[100000] pointer-events-none opacity-0 backdrop-blur rounded-full "
        initial={{
          backgroundColor: "rgba(100,100,100,.4)",
          scale: INITIAL_SCALE
        }}
        animate={anim}
      >
        <ArrowLeft
          isExpanded={isScrubbing}
          isActive={isActive}
          fill={fill}
          shouldEmphasise={shouldEmphasiseLeft}
        />
        <div>
          <ProgressRing
            progress={progress}
            strokeColor={fill}
            radius={RADIUS}
            stroke={isScrubbing ? 3 : 4}
          />
        </div>
        {/* <motion.div
          className="w-full h-full top-0 left-0 absolute rounded-full backdrop-blur-lg"
          style={{
            backgroundColor: fill,
            width: RADIUS * 2,
            height: RADIUS * 2,
          }}
          animate={{
            scale: isActive ? 0.9 : 0.7,
            opacity: isActive ? 0.2 : 0,
            transition: {
              duration: AnimationConfig.FAST,
              ease: AnimationConfig.EASING,
            },
          }}
        /> */}
        <motion.div
          animate={{
            opacity: isScrubbing ? 1 : 0,
            transition: {
              duration: AnimationConfig.FAST,
              ease: AnimationConfig.EASING,
            },
          }}
          className="w-full text-white text-xs text-center absolute top-7"
        >
          {timeString}
        </motion.div>
        <ArrowRight
          isExpanded={isScrubbing}
          fill={fill}
          isActive={isActive}
          shouldEmphasise={shouldEmphasiseRight}
        />
      </motion.div>
    </ClientOnlyPortal>
  );
};

type ArrowProps = {
  isExpanded: boolean;
  isActive: boolean;
  fill?: string;
  shouldEmphasise: boolean;
};

const ARROW_OFFSET = 18;

const ArrowLeft = ({
  isExpanded,
  isActive: isShowing,
  fill,
  shouldEmphasise,
}: ArrowProps) => {
  return (
    <motion.svg
      // className="absolute -left-[14px] top-[12px]"
      className="absolute"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        left: -12 + ARROW_OFFSET,
        top: RADIUS - 12,
      }}
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        opacity: isExpanded ? (shouldEmphasise ? 1 : 0.3) : 0,
        // opacity: isExpanded ? (shouldEmphasise ? 1 : 0.6) : 0.6,
        x: isShowing ? (isExpanded ? (shouldEmphasise ? -1 : 0) : 0) : 12,
        // scale: shouldEmphasise ? 1.3 :   1,
        transition: {
          ease: AnimationConfig.EASING,
          duration: AnimationConfig.FAST,
          // delay: 0.1,
        },
      }}
    >
      <path
        d="M12.3004 15.3L9.70039 12.7C9.60039 12.6 9.52539 12.4917 9.47539 12.375C9.42539 12.2583 9.40039 12.1333 9.40039 12C9.40039 11.8667 9.42539 11.7417 9.47539 11.625C9.52539 11.5083 9.60039 11.4 9.70039 11.3L12.3004 8.70001C12.6171 8.38335 12.9794 8.31268 13.3874 8.48801C13.7961 8.66268 14.0004 8.97501 14.0004 9.42501V14.575C14.0004 15.025 13.7961 15.3373 13.3874 15.512C12.9794 15.6873 12.6171 15.6167 12.3004 15.3V15.3Z"
        fill={fill}
      />
    </motion.svg>
  );
};
const ArrowRight = ({
  isExpanded,
  isActive: isShowing,
  fill = "#FFF",
  shouldEmphasise,
}: ArrowProps) => (
  <motion.svg
    // className="absolute left-[38px] top-[12px]"
    className="absolute"
    style={{
      left: RADIUS * 2 - 12 - ARROW_OFFSET,
      top: RADIUS - 12,
    }}
    animate={{
      opacity: isExpanded ? (shouldEmphasise ? 1 : 0.3) : 0,
      // opacity: isExpanded ? (shouldEmphasise ? 1 : 0.6) : 0.6,
      x: isShowing ? (isExpanded ? (shouldEmphasise ? 1 : 0) : -0) : -12,
      // scale: shouldEmphasise ? 1.3 : 1,
      transition: {
        ease: AnimationConfig.EASING,
        duration: AnimationConfig.FAST,
        // delay: 0.1,
      },
    }}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.7 15.3C11.3833 15.6167 11.021 15.6873 10.613 15.512C10.2043 15.3373 10 15.025 10 14.575V9.42501C10 8.97501 10.2043 8.66268 10.613 8.48801C11.021 8.31268 11.3833 8.38335 11.7 8.70001L14.3 11.3C14.4 11.4 14.475 11.5083 14.525 11.625C14.575 11.7417 14.6 11.8667 14.6 12C14.6 12.1333 14.575 12.2583 14.525 12.375C14.475 12.4917 14.4 12.6 14.3 12.7L11.7 15.3Z"
      fill={fill}
    />
  </motion.svg>
);

const pauseIcon = ({ fill = "#FFF" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14 19V5H18V19H14ZM6 19V5H10V19H6Z" fill={fill} />
  </svg>
);
const playIcon = ({ fill = "#FFF" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5.14062V19.1406L19 12.1406L8 5.14062Z" fill={fill} />
  </svg>
);

export default VideoProgressCursor;
