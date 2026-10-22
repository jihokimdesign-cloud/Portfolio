import React, {
  MutableRefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ProjectGridItem from "./ProjectGridItem";
import { getProjectInfo, getProjectStyle } from "../../lib/ProjectInfo";
import { breakpoints, useAllBreakpoints } from "../../hooks/useBreakpoints";
import { useWindowDimension } from "../../hooks/useWindowDimension";

type Props = {
  projects: any[];
};

// 2-column grid of case cards (the featured TAP case is rendered separately).
// Every card shares one 4/3 thumbnail ratio so the row reads as one system.
const ProjectGrid = ({ projects }: Props) => {
  const currentBreakpoint = useAllBreakpoints();
  const isTwoColumns = currentBreakpoint > breakpoints.sm;
  const windowDimension = useWindowDimension();

  const gridRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [gridWidth, setGridWidth] = useState(0);
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const measure = () => setGridWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const gapX = 28; // gap-x-7
  const colWidth = isTwoColumns ? (gridWidth - gapX) / 2 : gridWidth;
  // 4/3 thumbnail → height = width * 3/4
  const cardHeight =
    colWidth > 0 ? Math.round((colWidth * 3) / 4) : windowDimension.width * 0.5;

  const visible = useMemo(
    () => projects.filter((p) => !getProjectInfo(p.meta).hidden),
    [projects],
  );

  return (
    <div
      ref={gridRef}
      className="grid gap-x-7 gap-y-12"
      style={{ gridTemplateColumns: isTwoColumns ? "1fr 1fr" : "1fr" }}
    >
      {visible.map((project, index) => (
        <ProjectGridItem
          key={project.meta.slug ?? index}
          cardHeight={cardHeight}
          projectStyle={getProjectStyle(project.meta)}
          projectInfo={getProjectInfo(project.meta)}
          isFirstItem={index === 0}
          shouldHideTitles={false}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
