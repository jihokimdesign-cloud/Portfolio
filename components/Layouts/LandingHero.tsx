import {
  motion,
  useIsPresent,
  usePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useBoundingBox } from "../../hooks/useBoundingClientRect";
import useIsFirstRender from "../../hooks/useIsFirstRender";
import { clamp } from "../../lib/clamp";
import { AnimationConfig } from "../AnimationConfig";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { ExternalLink } from "./ExternalLink";

type Props = { isViewingGrid: boolean };

const LANDING_THEME_BG = "#192220";
const DEFAULT_BG = "#0e1010";

const LandingHero = ({ isViewingGrid }: Props) => {
  const { scrollY, scrollContainerRef } = useContainerScroll();
  const [boundRef, bounds] = useBoundingBox([]);
  const introSectionHeight = bounds.height * 0.6;

  const progress = useTransform(scrollY, (val) =>
    clamp(val, 0, introSectionHeight)
  );

  const bgColour = useTransform(
    progress,
    [0, introSectionHeight],
    [LANDING_THEME_BG, DEFAULT_BG]
  );

  const heroScale = useTransform(progress, [0, introSectionHeight], [1, 0.95]);
  const heroOpacity = useTransform(progress, [0, introSectionHeight], [1, 0]);
  // const filter = useTransform(scrollY, (v) => `blur(${v / 100}px)`);
  const yPos = useTransform(scrollY, (v) => -v * 0.4);

  const isFirstRender = useIsFirstRender();
  const isOutsideScrollArea =
    isFirstRender ||
    (scrollContainerRef.current &&
      scrollContainerRef.current.scrollTop > bounds.height);

  const hideLinks = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <>
      <motion.div
        className="fixed w-full h-full -z-10"
        style={{ backgroundColor: isOutsideScrollArea ? DEFAULT_BG : bgColour }}
        // initial={{ backgroundColor: DEFAULT_BG }}
        // animate={{
        //   backgroundColor: LANDING_THEME_BG,
        // }}
        exit={{
          backgroundColor: DEFAULT_BG,
        }}
      ></motion.div>
      <motion.section
        className="sticky top-0 h-[80vh]"
        ref={boundRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFirstRender ? 0 : 1 }}
      >
        <motion.div
          className="px-4 py-4 md:px-6 md:py-6 grid grid-cols-6 grid-rows-[1fr] gap-2 md:h-[100vh] "
          style={{
            scale: heroScale,
            opacity: isOutsideScrollArea ? 0 : heroOpacity,
            // filter: filter,
            y: yPos,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            transition: {
              ease: AnimationConfig.EASING_INVERTED,
              duration: AnimationConfig.NORMAL,
            },
          }}
        >
          <div className="col-start-1 col-span-full 2xl:col-span-4 flex flex-col">
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-light tracking-[-.047em] lg:leading-[1.08em]">
              Alvin Leung is an interaction designer. He thrives in bringing
              wild concepts from 0 to 1 using his prototyping wizardry and
              aesthetic sensibility. Previously designed @ Daybreak Studio &
              Dossier Creative.
            </h1>
            <p className="mt-4 text-sm sm:text-base"></p>
          </div>

          <motion.div
            style={{
              opacity: hideLinks,
            }}
            className="col-start-1 col-span-3 lg:col-start-5 lg:col-span-1 row-start-2 lg:row-start-2 flex flex-col opacity-60 lg:mb-64 text-sm xl:text-base"
          >
            <h3 className="uppercase mb-3 text-sm">Previous Clients</h3>
            <ul>
              <li>
                <ExternalLink href={"https://pager.xyz/"}>Pager</ExternalLink>
              </li>
              <li>
                <ExternalLink href={"https://www.curated.xyz/"}>
                  Curated
                </ExternalLink>
              </li>
              <li>
                <ExternalLink>QuirkChat</ExternalLink>
              </li>
            </ul>
          </motion.div>
          <motion.div
            style={{ opacity: hideLinks }}
            className="col-start-4 col-span-3 lg:col-start-6 lg:col-span-1 row-start-2 lg:row-start-2 flex flex-col opacity-60 text-sm xl:text-base"
          >
            <h3 className="uppercase mb-3 text-sm">Let&apos;s be in Touch</h3>
            <ExternalLink
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
              Instagram
            </ExternalLink>
            <ExternalLink
              href={"mailto:alvinleung2009@gmail.com"}
              icon={"icon/icon-mail.svg"}
              alt={"Say Hello!"}
            >
              Email
            </ExternalLink>
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
};

export default LandingHero;
