import React, { useEffect, useMemo, useState } from "react";
import ProjectGrid from "./ProjectGrid";
import { motion, transform } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import { ExternalLink } from "../Layouts/ExternalLink";
import debounce from "../../lib/debounce";
import { PenTool, Sparkles, Boxes, FlaskConical } from "lucide-react";
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
      <div>
        <motion.div
          className={`py-10 md:py-16 flex flex-col md:flex-row md:items-end gap-10 md:gap-16`}
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
            className={`flex-1 max-w-[44rem] text-xl sm:text-2xl 2xl:text-4xl font-medium tracking-[-.02em] leading-[1.4em] sm:leading-[1.4em] 2xl:leading-[1.3em] gap-[1em] flex flex-col`}
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
            <p
              style={{
                fontFamily: '"TikTok Sans", Inter, sans-serif',
                fontWeight: 400,
                fontSize: "clamp(34px, 4.5vw, 60px)",
                lineHeight: 1,
                letterSpacing: "-0.025em",
                color: "var(--title)",
                margin: 0,
              }}
              className="w-full"
            >
              <span className="block">Designer of AI that listens.</span>
              <span className="block mt-2">Builder who ships with it.</span>
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
          <div className="text-sm md:text-base opacity-70 w-full md:w-96 md:shrink-0 md:ml-auto">
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
      <div className="mb-8">
        <h2
          className="text-3xl md:text-[40px]"
          style={{
            fontFamily: '"TikTok Sans", Inter, sans-serif',
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.025em",
            color: "var(--title)",
            margin: "40px 0 32px",
          }}
        >
          Current toolkit
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 max-w-5xl">
          {[
            {
              label: "Design",
              Icon: PenTool,
              items: [
                "Figma",
                "ProtoPie",
                "Design systems",
                "Interaction design",
              ],
            },
            {
              label: "AI & prototyping",
              Icon: Sparkles,
              items: [
                "Claude Code",
                "Cursor",
                "Prompt engineering",
                "LLM prototyping",
              ],
            },
            {
              label: "Spatial & multimodal",
              Icon: Boxes,
              items: [
                "Unity",
                "ShapesXR",
                "AR/VR prototyping",
                "Voice & gesture UI",
              ],
            },
            {
              label: "Research & quality",
              Icon: FlaskConical,
              items: [
                "Usability testing",
                "A/B testing",
                "Contextual inquiry",
                "WCAG 2.2 AA",
              ],
            },
          ].map((group) => (
            <div key={group.label}>
              <div
                className="mb-3 flex items-center gap-2 text-[13px] tracking-wide"
                style={{ color: "var(--fg-muted)" }}
              >
                <group.Icon size={14} strokeWidth={1.75} aria-hidden />
                {group.label}
              </div>
              <ul
                className="flex flex-col gap-1.5 text-sm md:text-[15px] leading-snug"
                style={{ color: "var(--fg-secondary)" }}
              >
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
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
