import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ProjectGridItem from "./ProjectGridItem";
import { getProjectInfo, getProjectStyle } from "../../lib/ProjectInfo";
import {
  breakpoints,
  useAllBreakpoints,
  useBreakpoint,
  useBreakpointValues,
} from "../../hooks/useBreakpoints";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import { useBoundingBox } from "../../hooks/useBoundingClientRect";
import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import { useMotionValueSwitch } from "../../hooks/useMotionValueSwitch";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";

type Props = {
  projects: any[];
  heroOffset: number;
};

export enum GridLayoutState {
  lg = "large",
  md = "medium",
  sm = "small",
}

const ProjectGrid = ({ projects, heroOffset }: Props) => {
  const currentBreakpoint = useAllBreakpoints();
  const shouldEmphasiseFirst = currentBreakpoint > breakpoints.md;
  const rowOffset = shouldEmphasiseFirst ? 1 : 0;
  const isTwoColumns = currentBreakpoint > breakpoints.sm;

  const windowDimension = useWindowDimension();
  const gridBeginRef = useRef() as MutableRefObject<HTMLDivElement>;

  // 그리드 실제 폭 측정 — 썸네일 피처드 타일을 16:9로 맞추기 위함
  const [gridWidth, setGridWidth] = useState(0);
  useLayoutEffect(() => {
    const el = gridBeginRef.current;
    if (!el) return;
    const measure = () => setGridWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const itemSizes = useMemo(() => {
    if (currentBreakpoint >= breakpoints["2xl"]) {
      return {
        normalItem: windowDimension.width * 0.37,
        firstItem: windowDimension.height * 0.85,
      };
    }
    if (currentBreakpoint >= breakpoints.lg) {
      return {
        normalItem: windowDimension.width * 0.37,
        firstItem: windowDimension.height * 0.85,
      };
    }
    if (currentBreakpoint >= breakpoints.md) {
      return {
        normalItem: windowDimension.width * 0.55,
        firstItem: windowDimension.width * 0.55,
      };
    }
    return {
      normalItem: windowDimension.width * 0.9,
      firstItem: windowDimension.width * 0.9,
    };
  }, [currentBreakpoint, windowDimension.height, windowDimension.width]);

  const topOffset = useMemo(() => {
    return currentBreakpoint < breakpoints.lg ? heroOffset + 16 : 0;
  }, [currentBreakpoint, heroOffset]);

  const filteredProjectList = useMemo(() => {
    return projects.filter((project) => {
      const info = getProjectInfo(project.meta);

      return !info.hidden;
    });
  }, [projects]);

  const { scrollY } = useContainerScroll();
  const isScrolled = useMotionValueSwitch(scrollY, (latest) => latest > 150);
  const shouldHideTitlesOnMobile =
    !isScrolled && currentBreakpoint < breakpoints.lg;
  return (
    <div className="flex gap-4">
      {/* <div className="w-7"> */}
      {/*   <motion.div */}
      {/*     className="sticky top-4" */}
      {/*     style={{ writingMode: "vertical-rl" }} */}
      {/*   > */}
      {/*     Selected Works */}
      {/*   </motion.div> */}
      {/* </div> */}
      <div
        className="grid gap-x-5 gap-y-12 w-full"
        ref={gridBeginRef}
        style={{
          gridTemplateColumns: isTwoColumns ? "1fr 1fr" : "1fr",
        }}
      >
        {filteredProjectList.map((project, index) => {
          const projectInfo = getProjectInfo(project.meta);
          const projectStyle = getProjectStyle(project.meta);

          const currentRow = isTwoColumns
            ? Math.floor((index + rowOffset) / 2)
            : index;

          // 피처드 썸네일 타일은 16:9 배너로 (준비된 비율 유지, 크롭 없음)
          const isFeaturedThumb =
            index === 0 &&
            shouldEmphasiseFirst &&
            !!projectInfo.thumbHtml &&
            gridWidth > 0;
          const resolvedHeight = isFeaturedThumb
            ? Math.round((gridWidth * 9) / 16)
            : index === 0
            ? itemSizes.firstItem
            : itemSizes.normalItem;

          return (
            <ProjectGridItem
              cardHeight={resolvedHeight}
              projectRow={currentRow}
              firstRowHeight={itemSizes.firstItem}
              projectStyle={projectStyle}
              projectInfo={projectInfo}
              topOffset={topOffset}
              isWide={shouldEmphasiseFirst && index === 0}
              isFirstItem={index === 0}
              key={index}
              shouldHideTitles={shouldHideTitlesOnMobile}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjectGrid;
