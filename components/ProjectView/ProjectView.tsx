import {
  motion,
  useAnimation,
  useIsPresent,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import { AnimationConfig } from "../AnimationConfig";
import CloseButton from "../CloseButton/CloseButton";
import { usePageTransition } from "../PageTransition/PageTransitionContext";
import {
  getProjectLink,
  ProjectInfo,
  ProjectStyle,
} from "../../lib/ProjectInfo";
import ProjectLinkButton from "../ProjectLinkButton/ProjectLinkButton";
import ProjectLinkCard from "../ProjectLinkButton/ProjectLinkCard";
import {
  ScrollDirection,
  useContainerScroll,
} from "../ScrollContainer/ScrollContainer";
import ProjectHeader from "../Layouts/ProjectHeader";
import ProjectViewNavBar from "./ProjectViewNavBar";
import { useColorContext } from "./ColorShifter";
import useIsFirstRender from "../../hooks/useIsFirstRender";
import { breakpoints, useBreakpoint } from "../../hooks/useBreakpoints";
import debounce from "../../lib/debounce";
import OverscrollAction from "../OverscrollAction/OverscrollAction";
import { OverscrollDirection, useOverscroll } from "../../hooks/useOverscroll";
import { useRouter } from "next/router";
import { useHistory } from "../../contexts/History";
import {
  BackIcon,
  ScrollUpArrow,
  ScrollUpDot,
  ScrollUpIcon,
} from "../CloseButton/Icon";

type Props = {
  children: React.ReactNode;
  projectStyle: ProjectStyle;
  projectInfo: ProjectInfo;
  nextProjectStyle: ProjectStyle;
  nextProjectInfo: ProjectInfo;
  coverImage: string;
  slugTitleMap: [{ title: string; slug: string }];
};

const USE_SIMPLE_TRANSITION = true;

const ProjectView = ({
  children,
  projectStyle,
  nextProjectStyle,
  nextProjectInfo,
  coverImage,
  slugTitleMap,
}: Props) => {
  const anim = useAnimation();
  const contentContainerRef = useRef() as MutableRefObject<HTMLDivElement>;

  const { currentColor, currentBackground } = useColorContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldShowNextProject, setShouldShowNextProject] = useState(false);
  const { prevCardRef } = usePageTransition();
  const { scrollY, scrollDirection, scrollYProgress } = useContainerScroll();
  const windowDimension = useWindowDimension();

  const [shouldShowNav, setShouldShowNav] = useState(true);

  useEffect(() => {
    const unobserveScrollY = scrollY.onChange((val) => {
      if (val > 0) {
        setIsScrolled(true);
        return;
      }
      setIsScrolled(false);
    });

    return () => {
      unobserveScrollY();
    };
  }, [scrollY, scrollYProgress]);

  const [shrinkedScale, setShrinkedScale] = useState(1);
  const is2XLBreakpoint = useBreakpoint(breakpoints["2xl"]);
  const isMDBreakpoint = useBreakpoint(breakpoints.md);
  const margin = useMemo(() => {
    if (is2XLBreakpoint) {
      return 128;
    }
    if (isMDBreakpoint) {
      return 48;
    }
    return 32;
  }, [is2XLBreakpoint, isMDBreakpoint]);

  useLayoutEffect(() => {
    setShrinkedScale(1 - margin / window.innerWidth);
  }, [contentContainerRef, windowDimension.width, margin]);

  const [transformOrigin, setTransformOrigin] = useState("center top");
  useEffect(() => {
    const unobserveScroll = scrollYProgress.onChange((val) => {
      if (val > 0.5) {
        setTransformOrigin("center bottom");
        return;
      }
      setTransformOrigin("center top");
    });

    return () => {
      unobserveScroll();
    };
  }, []);

  // useEffect(() => {
  //   // let scrolledAmount = 0;
  //   // const DIST_THRESHOLD = 200;
  //   // const VELOCITY_THRESHOLD = 9;

  //   // const unobserveScroll = scrollY.onChange(() => {
  //   //   const velocity = scrollY.getVelocity() / 100;
  //   //   scrolledAmount += velocity;
  //   //   if (scrolledAmount < -DIST_THRESHOLD || velocity < -VELOCITY_THRESHOLD) {
  //   //     setShouldShowNav(true);
  //   //     return;
  //   //   }
  //   // });

  //   if (scrollDirection === ScrollDirection.DOWN) {
  //     setShouldShowNav(false);
  //     return;
  //   }
  //   setShouldShowNav(true);
  //   // return () => {
  //   //   unobserveScroll();
  //   // };
  // }, [scrollDirection]);

  useEffect(() => {
    // if (USE_SIMPLE_TRANSITION) {
    //   anim.set({
    //     scale: 0.8,
    //     y: window.innerHeight / 3,
    //     opacity: 0,
    //   });

    //   return;
    // }

    if (!prevCardRef.current) {
      anim.set({
        scale: 0.9,
        y: windowDimension.height,
        opacity: 1,
      });
      return;
    }

    const containerBounds = prevCardRef.current.getBoundingClientRect();
    const y = containerBounds.top;
    const x =
      containerBounds.left + containerBounds.width / 2 - window.innerWidth / 2;
    const wScale = containerBounds.width / window.innerWidth;

    anim.set({
      // scale: 0.8,
      scale: wScale,
      x: x * 0.7,
      // y: y + 24,
      y: y - 80,
      opacity: 1,
    });

    // reset the prev card ref
    // prevCardRef.current = undefined;
  }, []);

  const isAnimInDone = useRef(false);
  const isPresent = useIsPresent();

  useEffect(() => {
    if (!isPresent) {
      return;
    }
    if (!isAnimInDone.current && !isScrolled) {
      anim.start({
        scale: shrinkedScale,
        y: 0,
        x: 0,
        opacity: 1,
        transition: {
          duration: AnimationConfig.VERY_SLOW,
          ease: AnimationConfig.EASING_IN_OUT,
        },
      });
      return;
    }
    if (shouldShowNextProject) {
      anim.start({
        scale: shrinkedScale,
        opacity: 1,
        transition: {
          duration: AnimationConfig.NORMAL,
          ease: AnimationConfig.EASING,
        },
      });
      return;
    }

    if (isScrolled) {
      anim.start({
        scale: isScrolled && !shouldShowNextProject ? 1 : shrinkedScale,
        y: isScrolled && !shouldShowNextProject ? -100 : 0,
        opacity: 1,
        transition: {
          duration: AnimationConfig.SLOW,
          ease: AnimationConfig.EASING,
        },
      });
      return;
    }

    if (!isScrolled) {
      anim.start({
        scale: isScrolled && !shouldShowNextProject ? 1 : shrinkedScale,
        y: isScrolled && !shouldShowNextProject ? -100 : 0,
        opacity: 1,
        transition: {
          duration: AnimationConfig.FAST,
          ease: AnimationConfig.EASING,
        },
      });
      return;
    }

    anim.start({
      scale: isScrolled && !shouldShowNextProject ? 1 : shrinkedScale,
      y: isScrolled && !shouldShowNextProject ? -0 : 0,
      opacity: 1,
      transition: {
        duration: AnimationConfig.NORMAL,
        ease: AnimationConfig.EASING,
      },
    });
  }, [isScrolled, shouldShowNextProject, shrinkedScale, isPresent]);

  const handleAnimComplete = () => {
    // clear enter animation if it has not done
    if (isAnimInDone.current) return;
    isAnimInDone.current = true;
    prevCardRef.current = undefined;
  };

  // ================================================
  // Overscroll interaction
  // ================================================
  const overscrollUp = useOverscroll(OverscrollDirection.UP, 160);
  const overscrollDown = useOverscroll(OverscrollDirection.DOWN, 80);

  // main body exit
  const overscrollOffsetY = useTransform(
    overscrollUp.overscrollProgress,
    [0, 1],
    [0, 120],
  );
  const overscrollScale = useTransform(
    overscrollUp.overscrollProgress,
    [0, 1],
    [1, 1],
  );
  const overscrollOpacity = useTransform(
    overscrollUp.overscrollProgress,
    [0, 1],
    [1, 0],
  );

  // main body enter
  const overscrollDownY = useTransform(
    overscrollDown.overscrollProgress,
    [0, 1],
    [0, -100],
  );
  const overscrollDownScale = useTransform(
    overscrollDown.overscrollProgress,
    [0, 1],
    [1, 0.95],
  );
  const overscrollDownOpacity = useTransform(
    overscrollDown.overscrollProgress,
    [0, 1],
    [1, 0.1],
  );

  const nextProjectY = useTransform(
    overscrollDown.overscrollProgress,
    [0, 1],
    [0, -100],
  );
  const { history, back } = useHistory();

  useEffect(() => {
    if (overscrollUp.isOverscrollComplete) {
      // router.back();
      back();
    }
  }, [overscrollUp.isOverscrollComplete]);

  const lastPage = history.length >= 2 ? history[history.length - 2] : "/";
  const [lastPageTitle, setLastPageTitle] = useState("");
  useEffect(() => {
    if (!isPresent) return;

    const lastPageCleaned = lastPage.substring(
      "/projects/".length,
      lastPage.length,
    );
    const titleMap = slugTitleMap.find((item) => item.slug === lastPageCleaned);

    // if (!titleMap) {
    //   setLastPageTitle("");
    //   return;
    // }
    //@ts-ignore
    setTimeout(() => setLastPageTitle(titleMap?.title), 700);
  }, [lastPage, isPresent]);

  // const lastePageName;
  const scrollUpHintPos = useTransform(
    overscrollUp.overscrollProgress,
    [0, 1],
    [0, 20],
  );

  return (
    <>
      <motion.div
        animate={{
          opacity: shouldShowNav || !isScrolled ? 1 : 0,
          y: shouldShowNav || !isScrolled ? 0 : -60,
        }}
        transition={{
          duration: AnimationConfig.FAST,
          ease: AnimationConfig.EASING,
        }}
        className="sticky left-0 right-0 top-0 z-20"
        exit={{
          opacity: 0,
        }}
      >
        <ProjectViewNavBar
          scrolled={isScrolled}
          nextProjectStyle={nextProjectStyle}
          nextProjectInfo={nextProjectInfo}
          overscrollProgress={overscrollUp.overscrollProgress}
          isOverscrollStarted={overscrollUp.isOverscrollStarted}
        />
      </motion.div>
      <motion.div
        className="fixed left-0 right-0 top-0 z-0 text-white"
        initial={{ opacity: 0 }}
        // style={{
        //   y: scrollUpHintPos,
        // }}
        animate={{
          opacity: overscrollUp.isOverscrollStarted
            ? overscrollUp.isOverscrollComplete
              ? 0
              : 1
            : 0,
          y: overscrollUp.isOverscrollStarted
            ? overscrollUp.isOverscrollComplete
              ? 0
              : 0
            : 30,
          // scale: overscrollUp.isOverscrollStarted ? 1 : 0.9,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: AnimationConfig.FAST,
          ease: AnimationConfig.EASING,
          // bounce: 0,
          // stiffness: 1000,
          // damping: 10,
        }}
      >
        <motion.div
          style={{
            y: scrollUpHintPos,
          }}
          className="w-full text-center mt-8 flex flex-col"
        >
          <div className="flex mx-auto px-4 py-2 rounded-full bg-[rgba(50,50,50,.6)] opacity-1">
            {!lastPageTitle && (
              <>
                {/* <span className="opacity-70 text-[12px] leading-3 ">Back to</span>{" "} */}
                <span>
                  {/* <BackIcon /> */}
                  <ScrollUpIcon progress={overscrollUp.overscrollProgress} />
                  All Projects
                </span>
              </>
            )}
            {lastPageTitle && (
              <>
                {/* <span className="opacity-70 text-[12px] leading-3 ">Back to</span>{" "} */}
                <span>
                  {/* <BackIcon /> */}
                  <ScrollUpIcon progress={overscrollUp.overscrollProgress} />
                  {lastPageTitle}
                </span>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
      {/* <motion.article ref={contentContainerRef} className="mx-6 2xl:mx-16 z-10"> */}
      <motion.article
        ref={contentContainerRef}
        className="z-10"
        style={{
          // this is a very hacking way to make firefox ackonwledge
          // the post-transformeo html body height
          height: `${shrinkedScale * Math.random()}%`,
          y: overscrollOffsetY,
          scale: overscrollScale,
          opacity: overscrollOpacity,
          transformOrigin: transformOrigin,
        }}
      >
        <motion.div
          onAnimationComplete={handleAnimComplete}
          className="overflow-hidden"
          style={{
            willChange: "scale, y",
            transformOrigin: transformOrigin,
          }}
          initial={{
            scale: 0.8,
            y: 100,
            opacity: 0,
          }}
          animate={anim}
          exit={{
            opacity: 0,
            y: 100,
            transition: {
              duration: AnimationConfig.NORMAL,
              ease: AnimationConfig.EASING_INVERTED,
            },
          }}
        >
          <motion.div
            style={{
              y: overscrollDownY,
              opacity: overscrollDown.isOverscrollComplete
                ? 0
                : overscrollDownOpacity,
              scale: overscrollDownScale,
              transformOrigin: transformOrigin,
            }}
            initial={{
              backgroundColor: projectStyle.getBgColor(),
              color: projectStyle.getTextColor(),
            }}
            animate={{
              backgroundColor: currentBackground,
              color: currentColor,
            }}
            exit={
              overscrollDown.isOverscrollComplete
                ? {
                    opacity: 0,
                    y: -windowDimension.height / 4,
                    transition: {
                      duration: AnimationConfig.NORMAL,
                      ease: AnimationConfig.EASING_INVERTED,
                    },
                  }
                : {
                    opacity: 0,
                    y: 100,
                    transition: {
                      duration: AnimationConfig.FAST,
                      ease: AnimationConfig.EASING_INVERTED,
                    },
                  }
            }
            // exit={{ opacity: 0 }}
            transition={{ delay: 0, duration: AnimationConfig.NORMAL }}
            className="relative pb-24 rounded-[1.25rem]"
          >
            {children}
          </motion.div>
          <motion.div
            className="mt-6 h-72"
            onViewportEnter={() => setShouldShowNextProject(true)}
            onViewportLeave={() => setShouldShowNextProject(false)}
            style={{
              y: nextProjectY,
            }}
          >
            <ProjectLinkCard
              isShowing={shouldShowNextProject}
              projectStyle={nextProjectStyle}
              projectInfo={nextProjectInfo}
              isOverscrollComplete={overscrollDown.isOverscrollComplete}
            />
          </motion.div>
        </motion.div>
      </motion.article>
    </>
  );
};

export default ProjectView;
