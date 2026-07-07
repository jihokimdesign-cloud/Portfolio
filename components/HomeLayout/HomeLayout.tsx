import React, { useEffect, useMemo, useState } from "react";
import ProjectGrid from "./ProjectGrid";
import { motion, transform } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import { ExternalLink } from "../Layouts/ExternalLink";
import debounce from "../../lib/debounce";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import fluidFont from "../../lib/fluidFont";
import { breakpoints } from "../../hooks/useBreakpoints";
import { HomeLink } from "./HomeLink";
import { EmailLink } from "./EmailLink";

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
      style={{ transformOrigin: transformOrigin }}
      className="grid lg:grid-cols-3 grid-flow-dense gap-4 mx-6 text-cyan-50"
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
      <div className="lg:col-start-3">
        <motion.div
          className={`sticky top-0 py-4 flex flex-col h-[500px] lg:h-screen`}
          initial={{ opacity: 0, scale: 0.97 }}
          style={{
            transformOrigin: "center left",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              delay: 0.25,
              duration: AnimationConfig.VERY_SLOW,
              ease: AnimationConfig.EASING_DRAMATIC,
            },
          }}
        >
          <motion.div
            // className="text-xl sm:text-2xl lg:text-4xl font-light tracking-[-.047em] lg:leading-[1.08em] "
            className={`text-xl sm:text-2xl 2xl:text-4xl font-light tracking-[-.047em] sm:leading-[1.3em] 2xl:leading-[1.15em] gap-[1em] flex flex-col`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.3,
                duration: AnimationConfig.VERY_SLOW,
                ease: AnimationConfig.EASING_DRAMATIC,
              },
            }}
          >
            <p>Jiho Kim is a product designer who turns technical ambiguity and complex AI into experiences that feel effortless.</p>
            <p>
              She bridges design and engineering — prototyping with code, grounding decisions in research, and shipping work that holds up across every user type.
            </p>
            <p>
              Currently building AI agent experiences at a stealth startup. Always open to a good conversation{" "}
              <EmailLink email={"jihokimdesign@gmail.com"} />
            </p>
            <p>
              Connect on{" "}
              <HomeLink
                icon={"icon/icon-linkedin.svg"}
                href={"https://www.linkedin.com/in/hoyak/"}
              >
                LinkedIn
              </HomeLink>
            </p>
          </motion.div>
          {/* <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.2,
                duration: AnimationConfig.NORMAL,
                ease: AnimationConfig.EASING,
              },
            }}
          >
            Previously: Daybreak Studio and Dossier Creative
          </motion.div> */}
          <div className="text-sm md:text-base mt-auto opacity-70">
            {/* <ExternalLink
              href={"https://read.cv/alvinleung"}
              icon={"icon/icon-cv.svg"}
              alt={"My Resume"}
            >
              My CV
            </ExternalLink>
            <ExternalLink
              href={"https://www.instagram.com/alvinn.design/"}
              icon={"icon/icon-instagram.svg"}
              alt={"Visit alvin's instagram"}
            >
              @alvinn.design
            </ExternalLink>
            <ExternalLink
              href={"mailto:alvinleung2009@gmail.com"}
              icon={"icon/icon-mail.svg"}
              alt={"Say Hello!"}
            >
              alvinleung2009@gmail.com
            </ExternalLink> */}
            <div>
              <div className="mb-[1em]">Experiences</div>
              <div className="grid grid-cols-2 gap-0 gap-x-1">
                <div>Stealth AI Startup</div>
                <div>2024-current</div>
                <div>Lepal.ai</div>
                <div>2024</div>
                <div>TAP3D (XR Training)</div>
                <div>2024</div>
                <div>Project Sidewalk</div>
                <div>2023-2024</div>
                <div>Seoul Women&apos;s University</div>
                <div>2021-2023</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="lg:col-span-2  mb-4">
        <ProjectGrid heroOffset={HERO_OFFSET} projects={projects} />
      </div>
    </motion.div>
  );
};

export default HomeLayout;
