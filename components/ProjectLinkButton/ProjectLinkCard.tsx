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
            className="block h-[64em] rounded-tl-[1.25rem] rounded-tr-[1.25rem] relative cursor-pointer overflow-hidden"
            style={{
              backgroundColor: "var(--canvas)",
              color: "var(--fg)",
              borderTop: "1px solid var(--hairline)",
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
            {/* 다음 프로젝트 액센트로 부드럽게 물드는 전환 리빌 */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[32em]"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${projectStyle.accent} 100%)`,
                opacity: 0.14,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[7em] h-[22em] w-[22em] -translate-x-1/2 rounded-full"
              style={{
                background: projectStyle.accent,
                opacity: 0.1,
                filter: "blur(80px)",
              }}
            />
            {/* "Next project" eyebrow */}
            <div
              className="relative z-10 px-4 pt-6 lg:px-8 lg:pt-8 text-[11px] font-bold uppercase tracking-widest"
              style={{ color: projectStyle.accent }}
            >
              Next project →
            </div>
            <ProjectHeader projectInfo={projectInfo} invertLogo />
          </motion.a>
        </motion.div>
      </Link>
    </ReactiveTapArea>
  );
};

export default ProjectLinkCard;
