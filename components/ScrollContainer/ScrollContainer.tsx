import { motion, MotionValue, useIsPresent, useScroll } from "framer-motion";
import React, {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useWindowDimension } from "../../hooks/useWindowDimension";

type Props = {
  children: React.ReactNode;
  zIndex?: number;
};

export enum ScrollDirection {
  DOWN,
  UP,
}

interface ScrollContextInfo {
  scrollWidth: number;
  scrollHeight: number;
  scrollX: MotionValue;
  scrollY: MotionValue;
  scrollXProgress: MotionValue;
  scrollYProgress: MotionValue;
  scrollDirection: ScrollDirection;
  setCanScroll: Dispatch<SetStateAction<boolean>>;
  scrollContainerRef: MutableRefObject<HTMLDivElement>;
}

export const ScrollContext = createContext<ScrollContextInfo>({
  scrollWidth: 0,
  scrollHeight: 0,
  scrollX: new MotionValue(),
  scrollY: new MotionValue(),
  scrollXProgress: new MotionValue(),
  scrollYProgress: new MotionValue(),
  scrollDirection: ScrollDirection.DOWN,
  scrollContainerRef: undefined as unknown as MutableRefObject<HTMLDivElement>,
  setCanScroll: () => {},
});

export const ScrollContainer = ({ children, zIndex = 0 }: Props) => {
  const scrollContainerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [canScroll, setCanScroll] = useState(true);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(
    ScrollDirection.DOWN
  );
  const { scrollX, scrollY, scrollXProgress, scrollYProgress } = useScroll({
    container: scrollContainerRef,
  });

  const windowDim = useWindowDimension();
  useEffect(() => {
    setScrollWidth(scrollContainerRef.current.scrollWidth);
    setScrollHeight(scrollContainerRef.current.scrollHeight);
  }, [windowDim]);

  useEffect(() => {
    const unobserveScrollY = scrollY.onChange((val) => {
      if (val > scrollY.getPrevious()) {
        setScrollDirection(ScrollDirection.DOWN);
        return;
      }
      setScrollDirection(ScrollDirection.UP);
    });

    return () => {
      unobserveScrollY();
    };
  }, []);

  const isPresent = useIsPresent();

  return (
    <ScrollContext.Provider
      value={{
        scrollWidth,
        scrollHeight,
        scrollX,
        scrollY,
        scrollXProgress,
        scrollYProgress,
        setCanScroll,
        scrollDirection,
        scrollContainerRef,
      }}
    >
      <motion.div
        className={`fixed left-0 top-0 right-0 bottom-0 h-screen overflow-x-hidden ${
          canScroll ? "overflow-y-auto" : "overflow-y-hidden"
        } `}
        ref={scrollContainerRef}
        style={{
          zIndex: zIndex,
          // overflowY: isPresent ? "inherit" : "scroll",
          pointerEvents: isPresent ? "all" : "none",
        }}
      >
        {children}
      </motion.div>
    </ScrollContext.Provider>
  );
};

export const useContainerScroll = () => {
  return useContext(ScrollContext);
};
