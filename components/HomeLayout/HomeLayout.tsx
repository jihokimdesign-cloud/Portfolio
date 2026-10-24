import React, { useEffect, useMemo, useState } from "react";
import SelectedWork from "./SelectedWork";
import { motion, transform } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import { ExternalLink } from "../Layouts/ExternalLink";
import debounce from "../../lib/debounce";
import LandingHero from "./LandingHero";
import { getProjectInfo } from "../../lib/ProjectInfo";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import fluidFont from "../../lib/fluidFont";
import { breakpoints } from "../../hooks/useBreakpoints";

type Props = {
  projects: any[];
};

const HERO_OFFSET = 500;

const HomeLayout = ({ projects }: Props) => {
  const windowDimension = useWindowDimension();
  const projectCount = useMemo(
    () => projects.filter((p) => !getProjectInfo(p.meta).hidden).length,
    [projects]
  );
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const { scrollY } = useContainerScroll();
  useEffect(() => {
    const updateTransformOrigin = debounce((value: number) => {
      setTransformOrigin(`center ${value + windowDimension.height / 2}px`);
    }, 200);
    const unobserve = scrollY.onChange(updateTransformOrigin);
    return () => {
      unobserve();
    };
  }, [windowDimension.width]);

  // const fluidHeader = useMemo(
  //   () => fluidFont(breakpoints.lg, breakpoints["2xl"], 2.3, 2.5),
  //   []
  // );

  // console.log(fluidHeader);

  return (
    <motion.div
      style={{
        transformOrigin: transformOrigin,
        color: "var(--fg)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
      className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 pt-[43px] pb-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          delay: 0.25,
          duration: AnimationConfig.VERY_SLOW,
          ease: AnimationConfig.EASING_DRAMATIC,
        },
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        transition: {
          // delay: 0,
          duration: AnimationConfig.SLOW,
          ease: AnimationConfig.EASING_INVERTED,
        },
      }}
    >
      <LandingHero />
      <div
        className="font-inter mb-4"
        style={{ marginTop: "clamp(112px, 14vw, 192px)" }}
      >
        <div className="sw-header" style={{ marginBottom: 24 }}>
          <span
            className="text-[13px]"
            style={{ fontWeight: 510, color: "var(--hero-fg)" }}
          >
            Selected Work
          </span>
          <span className="text-[13px]" style={{ color: "var(--hero-fg2)" }}>
            {projectCount} projects
          </span>
        </div>
        <SelectedWork projects={projects} />
      </div>
    </motion.div>
  );
};

export default HomeLayout;
