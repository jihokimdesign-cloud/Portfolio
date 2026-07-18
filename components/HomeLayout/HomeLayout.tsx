import React, { useEffect, useMemo, useState } from "react";
import ProjectGrid from "./ProjectGrid";
import { motion, transform } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import { ExternalLink } from "../Layouts/ExternalLink";
import debounce from "../../lib/debounce";
import LandingBento from "./LandingBento";
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
      className="flex flex-col gap-4 mx-6 pt-24 pb-10"
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
      <LandingBento />
      <div className="mb-4">
        <h2
          className="mb-8 mt-10 text-3xl md:text-[40px]"
          style={{
            fontFamily: '"TikTok Sans", Inter, sans-serif',
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.025em",
            color: "var(--title)",
            margin: "40px 0 32px",
          }}
        >
          Selected work(s)
        </h2>
        <ProjectGrid heroOffset={HERO_OFFSET} projects={projects} />
      </div>
    </motion.div>
  );
};

export default HomeLayout;
