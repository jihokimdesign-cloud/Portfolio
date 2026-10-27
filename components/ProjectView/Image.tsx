import React, { useState } from "react";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";
import { Figure } from "./FigureWrapper";
import ReactiveTapArea from "../ReactiveTapArea/ReactiveTapArea";

type Props = {
  width: number;
  height: number;
  src: string;
  caption?: string;
  alt?: string;
  fullWidth?: boolean;
  rowSpan?: number;
  priority?: boolean;
  children: React.ReactNode;
};

const Image = ({
  src,
  width,
  height,
  fullWidth,
  caption,
  alt,
  children,
  rowSpan = 1,
  priority,
}: Props) => {
  return (
    <Figure rowSpan={rowSpan}>
      <NextImage
        className="w-full object-cover rounded-xl pointer-events-none"
        src={src}
        width={width}
        height={height}
        alt={alt || caption || ""}
        // placeholder="blur"
        priority={priority}
      />
      {children}
    </Figure>
  );
};

export default Image;
