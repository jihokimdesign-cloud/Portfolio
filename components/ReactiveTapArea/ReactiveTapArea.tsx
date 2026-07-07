import { motion } from "framer-motion";
import React, { useState } from "react";
import { AnimationConfig } from "../AnimationConfig";

type Props = {
  children: React.ReactNode;
  className?: string;
  motionScaleFactor?: number;
  lockX?: boolean;
  startFromCenter?: boolean;
};

const ReactiveTapArea = ({
  children,
  className,
  motionScaleFactor = 1,
  lockX,
  startFromCenter,
}: Props) => {
  const [cursorOffsetFromCenter, setCursorOffsetFromCenter] = useState({
    x: 0,
    y: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className={className}
      onMouseDown={(e) => {
        setIsDragging(true);

        if (startFromCenter) {
          setCursorOffsetFromCenter({
            x: 0,
            y: 0,
          });
          return;
        }

        const target = e.currentTarget as HTMLDivElement;
        const bounds = target.getBoundingClientRect();
        setCursorOffsetFromCenter({
          x: (e.clientX - bounds.x) / bounds.width - 0.5,
          y: (e.clientY - bounds.y) / bounds.height - 0.5,
        });
      }}
      onMouseMove={(e) => {
        if (!isDragging) return;

        const target = e.currentTarget as HTMLDivElement;
        const bounds = target.getBoundingClientRect();

        const newX = e.movementX / bounds.width + cursorOffsetFromCenter.x;
        const newY = e.movementY / bounds.height + cursorOffsetFromCenter.y;

        setCursorOffsetFromCenter({
          x: newX,
          y: lockX ? cursorOffsetFromCenter.y : newY,
        });
      }}
      onMouseUp={(e) => {
        setIsDragging(false);
      }}
    >
      <motion.div
        style={{
          transformPerspective: `100vw`,
          translateZ: "0vw",
        }}
        whileTap={{
          rotateY: cursorOffsetFromCenter.x * 5 * motionScaleFactor,
          rotateX: -cursorOffsetFromCenter.y * 7 * motionScaleFactor,
          // translateZ: `-.${5}vw`,
          scale: 0.99,
        }}
        transition={{
          duration: AnimationConfig.FAST,
          ease: AnimationConfig.EASING,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ReactiveTapArea;
