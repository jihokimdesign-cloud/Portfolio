import { motion } from "framer-motion";
import React, { Children, MutableRefObject, useRef, useState } from "react";
import { useBoundingBox } from "../../hooks/useBoundingClientRect";
import { AnimationConfig } from "../AnimationConfig";
import ReactiveTapArea from "../ReactiveTapArea/ReactiveTapArea";
import { Caption } from "./Caption";

type Props = {
  children: React.ReactNode;
  label: string;
  text: string;
};

const SlideShow = ({ children, label, text }: Props) => {
  const [isInView, setIsInView] = useState(false);
  const [boundRef, bound] = useBoundingBox<HTMLDivElement>([isInView]);
  const [currentPage, setCurrentPage] = useState(0);

  const arrayChildren = Children.toArray(children);

  const hasPrev = currentPage - 1 >= 0;
  const hasNext = currentPage + 1 < arrayChildren.length;

  const handleNext = () => {
    if (hasNext) {
      setCurrentPage(currentPage + 1);
      return;
    }
    setCurrentPage(0);
  };
  const EXIT_OFFSET = 50;

  return (
    <motion.figure
      className="relative w-full overflow-x-hidden rounded-xl"
      ref={boundRef}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
    >
      <ReactiveTapArea>
        {arrayChildren.map((child, index) => (
          <motion.div
            key={index}
            className={index === 0 ? "" : "absolute left-0 top-0"}
            animate={{
              x:
                currentPage === index
                  ? 0
                  : currentPage > index
                  ? -EXIT_OFFSET
                  : EXIT_OFFSET,
              opacity: currentPage === index ? 1 : 0,
            }}
            style={{
              width: bound.width,
            }}
            transition={{
              duration: AnimationConfig.NORMAL,
              ease: AnimationConfig.EASING,
            }}
          >
            {child}
          </motion.div>
        ))}
        <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-row w-full h-full">
          <div
            className={"w-full h-full"}
            style={{
              cursor: "e-resize",
            }}
            onClick={handleNext}
          />
        </div>
        <Caption label={label} text={text} wideSpacing={false} overlay={true} />
      </ReactiveTapArea>
    </motion.figure>
  );
};

export default SlideShow;
