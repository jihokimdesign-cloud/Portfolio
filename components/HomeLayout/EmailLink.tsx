import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import { useState } from "react";

const HomeLinkAnimation = {
  default: {
    opacity: 1,
  },
  hover: { opacity: 0.6 },
  active: {
    opacity: 0.6,
    scale: 0.96,
  },
};
const HomeLinkIconAnimation = {
  default: {
    // rotate: 1,
  },
  hover: {
    // rotate: 10,
  },
};

export const EmailLink = ({
  email,
  alt,
}: {
  alt?: string;
  email: string;
  icon?: string;
}) => {
  const [state, setState] = useState<"email" | "copied" | "hint">("email");
  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setState("copied");
  };

  const icon = {
    email: "icon/icon-mail.svg",
    copied: "icon/icon-check.svg",
    hint: "icon/icon-copy.svg",
  };

  const text = {
    email: "email",
    copied: "copied",
    hint: "email",
  };

  return (
    <span className="h-[1em] relative inline-flex translate-y-[.14em] mx-1">
      <motion.a
        href={"#"}
        className="inline-flex justify-start items-center pl-1.5 pr-2 h-[1em] min-w-20 ring-current ring-[.08em] rounded-full"
        initial={"default"}
        whileHover={"hover"}
        whileTap={"active"}
        variants={HomeLinkAnimation}
        onPointerEnter={() => setState("hint")}
        onPointerLeave={() => setState("email")}
        onTap={() => copyEmail()}
        transition={{
          ease: AnimationConfig.EASING,
          duration: AnimationConfig.VERY_FAST,
        }}
      >
        <motion.img
          className="mr-[.05em] inline-block h-[.8em] w-[.8em]"
          src={icon[state]}
          alt={alt}
          variants={HomeLinkIconAnimation}
        />
        <span className="text-[.7em] tracking-[-0.02em]">{text[state]}</span>
      </motion.a>
    </span>
  );
};
