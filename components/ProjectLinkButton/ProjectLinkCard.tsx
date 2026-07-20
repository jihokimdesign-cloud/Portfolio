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
            {/* 다음 프로젝트 액센트로 물드는 전환 리빌 — 카드 상단에서 강하고
                아래로 스크롤할수록 캔버스로 부드럽게 사라진다(하드 엣지 없음) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${projectStyle.accent} 0%, transparent 55%)`,
                opacity: 0.16,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[6em] h-[26em] w-[26em] -translate-x-1/2 rounded-full"
              style={{
                background: projectStyle.accent,
                opacity: 0.12,
                filter: "blur(90px)",
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
