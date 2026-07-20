import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { OverscrollDirection, useOverscroll } from "../../hooks/useOverscroll";
import { useWindowDimension } from "../../hooks/useWindowDimension";
import {
  getProjectLink,
  getProjectCover,
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
            {/* Next 라벨 + 프로젝트 이름 */}
            <div className="px-4 pt-8 text-center lg:px-8">
              <div
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: projectStyle.accent }}
              >
                Next project →
              </div>
              <h2
                className="mt-2 text-xl lg:text-2xl"
                style={{
                  fontFamily: '"TikTok Sans", Inter, sans-serif',
                  fontWeight: 400,
                  letterSpacing: "-0.025em",
                  color: "var(--title)",
                }}
              >
                {projectInfo.title}
              </h2>
            </div>

            {/* 프리뷰 — 애니메이션 썸네일(있으면) 또는 커버 이미지.
                카드가 위로 올라오며 프리뷰 상단부터 드러난다 */}
            <div className="mx-4 mt-6 overflow-hidden rounded-[1rem] lg:mx-8">
              {projectInfo.thumbHtml ? (
                <iframe
                  src={projectInfo.thumbHtml}
                  title={projectInfo.title}
                  scrolling="no"
                  className="block w-full border-0"
                  style={{ aspectRatio: "16 / 9" }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getProjectCover(projectInfo.slug)}
                  alt={projectInfo.title}
                  className="block w-full object-cover"
                  style={{ aspectRatio: "16 / 10" }}
                />
              )}
            </div>
          </motion.a>
        </motion.div>
      </Link>
    </ReactiveTapArea>
  );
};

export default ProjectLinkCard;
