import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getProjectLink,
  ProjectInfo,
  ProjectStyle,
} from "../../lib/ProjectInfo";
import { AnimationConfig } from "../AnimationConfig";
import { usePageTransition } from "../PageTransition/PageTransitionContext";

type Props = {
  projectStyle: ProjectStyle;
  projectInfo: ProjectInfo;
  scrolled: boolean;
};

const ProjectLinkButton = ({ projectStyle, projectInfo, scrolled }: Props) => {
  const [isHovering, setIsHovering] = useState(false);
  const linkRef = useRef() as MutableRefObject<HTMLAnchorElement>;
  const { prevCardRef } = usePageTransition();
  const router = useRouter();

  const handleClick = () => {
    // prevCardRef.current = linkRef.current;
  };

  // const baseColor = scrolled ? "rgba(50, 50, 50, 0.4)" : projectStyle.dark;
  // const baseColorHover = scrolled
  //   ? "rgba(50, 50, 50, 0.5)"
  //   : projectStyle.accent;
  // const textColor = scrolled ? "rgba(255, 255, 255, 1)" : projectStyle.accent;
  // const textColorHover = scrolled ? textColor : projectStyle.dark;
  // const circleColor = scrolled ? projectStyle.accent : projectStyle.accent;
  // const circleColorHover = scrolled ? projectStyle.accent : projectStyle.dark;

  const baseColor = projectStyle.dark;
  const baseColorHover = projectStyle.accent;
  const textColor = projectStyle.light;
  const textColorHover = projectStyle.dark;
  const circleColor = projectStyle.accent;
  const circleColorHover = projectStyle.dark;

  const link = useMemo(
    () => getProjectLink(projectInfo.slug),
    [projectInfo.slug]
  );

  // preload the next page
  useEffect(() => {
    router.prefetch(link);
  }, [link]);

  return (
    <Link href={link} legacyBehavior>
      <motion.a
        onClickCapture={handleClick}
        ref={linkRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        transition={{
          duration: AnimationConfig.FAST,
          ease: AnimationConfig.EASING,
        }}
        whileTap={{
          scale: 0.95,
        }}
        animate={{
          backgroundColor: isHovering ? baseColorHover : baseColor,
          // : "rgba(50,50,50,.6)",
          color: isHovering ? textColorHover : textColor,
        }}
        className="inline-flex justify-center rounded-full leading-none py-3 px-4 cursor-pointer"
      >
        <motion.div
          className="w-[1em] h-[1em] mr-3 rounded-full"
          animate={{
            backgroundColor: isHovering ? circleColorHover : circleColor,
          }}
          transition={{
            duration: AnimationConfig.FAST,
            ease: AnimationConfig.EASING,
          }}
        />
        {projectInfo.title}
      </motion.a>
    </Link>
  );
};

export default ProjectLinkButton;
