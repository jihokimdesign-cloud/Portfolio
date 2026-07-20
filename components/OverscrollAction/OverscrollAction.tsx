import { useSpring, motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";

type Props = {
  onTrigger?: () => void;
};

const OverscrollAction = ({ onTrigger }: Props) => {
  const { scrollYProgress, scrollContainerRef } = useContainerScroll();
  const overScroll = useSpring(0, { stiffness: 1500, damping: 200 });
  const maxDist = 500;
  const progress = useTransform(overScroll, [0, maxDist], [0, 1]);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const unobserve = scrollYProgress.onChange((val) => {
      if (val <= 0) {
        setIsActive(true);
        return;
      }
      setIsActive(false);
    });
    return () => {
      unobserve();
    };
  }, [scrollYProgress]);

  useEffect(() => {
    if (!isActive) return;

    console.log("active");

    const handleWheel = (e: WheelEvent) => {
      overScroll.set(overScroll.get() - e.deltaY);
      // console.log(overScroll.get());
    };
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      overScroll.set(0);
    };
  }, [isActive, scrollContainerRef]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-row z-[10000] pointer-events-none">
      <motion.div
        className="w-24 h-4 bg-white"
        style={{ scaleX: progress }}
      ></motion.div>
    </div>
  );
};

export default OverscrollAction;
