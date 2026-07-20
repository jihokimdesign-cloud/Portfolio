import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

const ExternalLinkAnimation = {
  default: {
    opacity: 1,
  },
  hover: { opacity: 0.6 },
  active: {
    opacity: 1,
  },
};
const ExternalLinkIconAnimation = {
  default: {
    // rotate: 1,
  },
  hover: {
    // rotate: 10,
  },
};

export const ExternalLink = ({
  children,
  href,
  icon = "icon/icon-link.svg",
  alt,
}: {
  children: string;
  alt?: string;
  href?: string;
  icon?: string;
}) =>
  href ? (
    <motion.a
      href={href}
      target="blank"
      className="flex relative items-center"
      initial={"default"}
      whileHover={"hover"}
      whileTap={"active"}
      variants={ExternalLinkAnimation}
      transition={{
        ease: AnimationConfig.EASING,
        duration: AnimationConfig.VERY_FAST,
      }}
    >
      <motion.img
        className="mr-6 lg:mr-2 -left-[2em] w-[1.2em] h-[1.2em]"
        src={icon}
        alt={alt}
        variants={ExternalLinkIconAnimation}
      />
      <div>{children}</div>
    </motion.a>
  ) : (
    <div className="flex relative items-center">
      <img
        className="mr-2 -left-[2em] w-[1.2em] h-[1.2em]"
        src="icon/icon-empty.svg"
        alt={alt}
      />
      <div>{children}</div>
    </div>
  );
