import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import Image from "next/image";

const HomeLinkAnimation = {
  default: {
    opacity: 1,
  },
  hover: { opacity: 0.6 },
  active: {
    opacity: 1,
    scale: 0.96,
  },
};

export const HomeLink = ({
  children,
  href,
  icon = "icon/icon-link.svg",
  alt,
}: {
  children: string;
  alt?: string;
  href?: string;
  icon?: string;
}) => (
  <span className="h-[1em] relative inline-flex translate-y-[.14em] mx-1">
    <motion.a
      href={href}
      target="blank"
      className="inline-flex justify-start items-center pl-1.5 pr-2 h-[1em] ring-current ring-[.08em] rounded-full"
      initial={"default"}
      whileHover={"hover"}
      whileTap={"active"}
      variants={HomeLinkAnimation}
      transition={{
        ease: AnimationConfig.EASING,
        duration: AnimationConfig.VERY_FAST,
      }}
    >
      <Image
        className="mr-[.05em] inline-block h-[.8em] w-[.8em]"
        style={{ filter: "var(--icon-filter)" }}
        src={icon}
        width={24}
        height={24}
        alt={alt || ""}
      />
      <span className="text-[.7em] tracking-[-0.02em]">{children}</span>
    </motion.a>
  </span>
);
