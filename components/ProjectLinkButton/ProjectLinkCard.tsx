import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { OverscrollDirection, useOverscroll } from "../../hooks/useOverscroll";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import {
  getProjectLink,
  getProjectLogo,
  ProjectInfo,
  ProjectStyle,
} from "../../lib/ProjectInfo";
import { AnimationConfig } from "../AnimationConfig";
import ProjectHeader from "../Layouts/ProjectHeader";
import { usePageTransition } from "../PageTransition/PageTransitionContext";
import ReactiveTapArea from "../ReactiveTapArea/ReactiveTapArea";

type Props = {
  isShowing: boolean;
  isOverscrollComplete: boolean;
  projectStyle: ProjectStyle;
  projectInfo: ProjectInfo;
};

const ProjectLinkCard = ({
  isShowing,
  projectStyle,
  projectInfo,
  isOverscrollComplete,
}: Props) => {
  const linkRef = useRef() as MutableRefObject<HTMLAnchorElement>;

  const { prevCardRef } = usePageTransition();
  const handleClick = () => {
    prevCardRef.current = linkRef.current;
  };

  const router = useRouter();
  useEffect(() => {
    if (isOverscrollComplete !== true) return;

    handleClick();
    router.push(getProjectLink(projectInfo.slug));
  }, [isOverscrollComplete]);

  return (
    <ReactiveTapArea>
      <Link href={getProjectLink(projectInfo.slug)} legacyBehavior>
        <motion.div
          exit={{
            opacity: 0,
            // y: -windowSize.height + 800,
            transition: {
              duration: AnimationConfig.NORMAL,
              ease: AnimationConfig.EASING_INVERTED,
            },
          }}
          animate={{
            scale: isShowing ? 1 : 0.9,
            opacity: isShowing ? 1 : 0,
            transition: {
              duration: AnimationConfig.SLOW,
              ease: AnimationConfig.EASING,
            },
          }}
        >
          <motion.a
            className="block h-[64em] rounded-tl-[1.25rem] rounded-tr-[1.25rem] relative cursor-pointer"
            style={{
              backgroundColor: projectStyle.getBgColor(),
              color: projectStyle.getTextColor(),
            }}
            onClickCapture={handleClick}
            ref={linkRef}
            whileTap={{
              scale: 0.99,
            }}
            transition={{
              duration: AnimationConfig.FAST,
              ease: AnimationConfig.EASING,
            }}
          >
            <ProjectHeader projectInfo={projectInfo} />
          </motion.a>
        </motion.div>
      </Link>
    </ReactiveTapArea>
  );
};

export default ProjectLinkCard;
