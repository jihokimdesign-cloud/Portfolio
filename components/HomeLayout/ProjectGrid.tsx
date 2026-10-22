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

  // 티어별 고정 규격: 피처드 = 그리드 폭 16:9 배너, 나머지 = 582×767 세로형.
  // 그리드 실측 폭에서 계산해 모든 소형 카드가 정확히 같은 비율/크기를 가진다.
  const itemSizes = useMemo(() => {
    const gapX = 20; // gap-x-5
    const colWidth = isTwoColumns ? (gridWidth - gapX) / 2 : gridWidth;
    const portrait =
      colWidth > 0
        ? Math.round(colWidth * (767 / 582))
        : windowDimension.width * 0.6;
    const featured =
      gridWidth > 0
        ? Math.round((gridWidth * 9) / 16)
        : windowDimension.height * 0.85;
    return {
      normalItem: portrait,
      firstItem: shouldEmphasiseFirst ? featured : portrait,
    };
  }, [
    gridWidth,
    isTwoColumns,
    shouldEmphasiseFirst,
    windowDimension.height,
    windowDimension.width,
  ]);

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

          // HTML 썸네일(16:9로 제작)은 모바일 1열에서도 배너 비율 유지 —
          // 세로형 높이를 주면 아래가 빈 회색으로 남는다
          const resolvedHeight =
            index === 0
              ? projectInfo.thumbHtml && gridWidth > 0
                ? Math.round((gridWidth * 9) / 16)
                : itemSizes.firstItem
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
