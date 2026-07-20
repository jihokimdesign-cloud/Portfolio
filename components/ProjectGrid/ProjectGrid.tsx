import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import { AnimationConfig } from "../AnimationConfig";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { getProjectInfo, getProjectStyle } from "../../lib/ProjectInfo";
import { ProjectGridItem } from "./ProjectGridItem";
import { useBoundingBox } from "../../hooks/useBoundingClientRect";
import { breakpoints } from "../../hooks/useBreakpoints";
import { useHomeScrollPosition } from "../HomeScrollPositionContext";
import debounce from "../../lib/debounce";
import useIsFirstRender from "../../hooks/useIsFirstRender";

type Props = {
  isViewing: boolean;
  projects: any[];
};
const ProjectGrid = ({ isViewing, projects }: Props) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [gridCols, setGridCols] = useState(3);
  const { scrollY } = useContainerScroll();

  const windowDimension = useWindowDimension();
  useEffect(() => {
    if (windowDimension.width > breakpoints.lg) {
      setGridCols(3);
      return;
    }
    if (windowDimension.width > breakpoints.md) {
      setGridCols(2);
      return;
    }
    setGridCols(1);
  }, [windowDimension.width]);

  const [containerRef, bounds] = useBoundingBox<HTMLDivElement>([]);

  const [transformOrigin, setTransformOrigin] = useState("center");
  useEffect(() => {
    const updateTransformOrigin = debounce((value: number) => {
      setTransformOrigin(`center ${value + windowDimension.height / 2}px`);
    }, 32);
    const unobserve = scrollY.onChange(updateTransformOrigin);
    return () => {
      unobserve();
    };
  }, []);

  // const transformOrigin = useTransform(
  //   scrollY,
  //   (value) => `center ${value + windowDimension.height / 2}px`
  // );

  const isTransitioningIn = useIsFirstRender();

  return (
    <>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 z-20 px-4 md:px-6 pb-8"
        ref={containerRef}
        style={{
          transformOrigin: transformOrigin,
        }}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          scale: 0.9,
        }}
        transition={{
          duration: AnimationConfig.NORMAL,
          ease: isTransitioningIn
            ? AnimationConfig.EASING
            : AnimationConfig.EASING_INVERTED,
          delay: isTransitioningIn ? 0.2 : 0,
        }}
      >
        {projects.map((project, index) => (
          <ProjectGridItem
            gridBoundTop={bounds.top}
            key={index}
            isActive={isViewing}
            onSelect={setSelectedProject}
            selectedProject={selectedProject}
            // isFirstRow={index < 3}
            projectRow={Math.floor(index / gridCols)}
            projectInfo={getProjectInfo(project.meta)}
            projectStyle={getProjectStyle(project.meta)}
            index={index}
          />
        ))}
      </motion.div>
    </>
  );
};

export default ProjectGrid;
